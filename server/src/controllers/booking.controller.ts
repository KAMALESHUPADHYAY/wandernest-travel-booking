import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { z } from 'zod';
import { sendBookingConfirmationEmail, sendCancellationEmail } from '../services/mail.service.js';

// Zod Validation Schemas
export const createBookingSchema = z.object({
  bookingType: z.enum(['HOTEL', 'FLIGHT']),
  // Hotel fields
  hotelId: z.string().optional(),
  roomId: z.string().optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  guests: z.number().int().positive().optional().default(1),
  // Flight fields
  flightId: z.string().optional(),
  flightDepartureDate: z.string().optional(),
  flightReturnDate: z.string().optional(),
  passengers: z.number().int().positive().optional().default(1),
  // Guest / Contact
  contactInfo: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().min(6, 'Valid phone number is required'),
  }),
  guestDetails: z.array(z.any()).optional().default([]),
  specialRequests: z.string().optional(),
  promoCode: z.string().optional(),
  // Payment (MOCK GATEWAY)
  paymentMethod: z.enum(['CREDIT_CARD', 'UPI', 'PAYPAL', 'MOCK_WALLET']).default('CREDIT_CARD'),
  paymentDetails: z.object({
    cardBrand: z.string().optional().default('Visa'),
    last4: z.string().regex(/^\d{4}$/, 'Last 4 digits must be 4 numbers').default('4242'),
    expMonth: z.string().optional().default('12'),
    expYear: z.string().optional().default('28'),
  }).optional(),
});

export const validatePromoSchema = z.object({
  promoCode: z.string().min(1, 'Promo code is required'),
  bookingType: z.enum(['HOTEL', 'FLIGHT', 'ALL']).default('ALL'),
  baseAmount: z.number().positive('Base amount must be greater than 0'),
});

// Helper: Generate unique reference WN-XXXXXX
function generateBookingNumber(): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let ref = 'WN-';
  for (let i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

// 1. Create Booking
export const createBooking = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const validatedData = createBookingSchema.parse(req.body);
    const {
      bookingType,
      hotelId,
      roomId,
      checkIn,
      checkOut,
      guests,
      flightId,
      flightDepartureDate,
      flightReturnDate,
      passengers,
      contactInfo,
      guestDetails,
      specialRequests,
      promoCode,
      paymentMethod,
      paymentDetails,
    } = validatedData;

    // Use interactive transaction to guarantee consistency and eliminate race conditions
    const result = await prisma.$transaction(async (tx) => {
      let basePrice = 0;
      let hotelRecord = null;
      let roomRecord = null;
      let flightRecord = null;

      // ==========================================
      // HOTEL AVAILABILITY & PRICE CALCULATION
      // ==========================================
      if (bookingType === 'HOTEL') {
        if (!hotelId || !roomId || !checkIn || !checkOut) {
          throw new Error('Missing hotel, room, or stay dates');
        }

        const cin = new Date(checkIn);
        const cout = new Date(checkOut);

        if (isNaN(cin.getTime()) || isNaN(cout.getTime()) || cin >= cout) {
          throw new Error('Invalid check-in or check-out dates');
        }

        // Fetch room
        roomRecord = await tx.room.findUnique({
          where: { id: roomId },
          include: { hotel: true },
        });

        if (!roomRecord) {
          throw new Error('Room not found');
        }

        hotelRecord = roomRecord.hotel;

        // Check availability: overlapping bookings for the same room
        const overlappingBookingsCount = await tx.booking.count({
          where: {
            roomId,
            status: { in: ['CONFIRMED', 'PENDING'] },
            checkIn: { lt: cout },
            checkOut: { gt: cin },
          },
        });

        if (overlappingBookingsCount >= roomRecord.availableCount) {
          const err: any = new Error('Selected room is not available for these dates.');
          err.statusCode = 409;
          throw err;
        }

        // Calculate nights
        const nights = Math.max(1, Math.ceil((cout.getTime() - cin.getTime()) / (1000 * 60 * 60 * 24)));
        basePrice = roomRecord.pricePerNight * nights;
      }

      // ==========================================
      // FLIGHT AVAILABILITY & PRICE CALCULATION
      // ==========================================
      if (bookingType === 'FLIGHT') {
        if (!flightId) {
          throw new Error('Flight ID is required');
        }

        flightRecord = await tx.flight.findUnique({
          where: { id: flightId },
        });

        if (!flightRecord) {
          throw new Error('Flight not found');
        }

        const seatsNeeded = passengers || 1;
        if (flightRecord.seatAvailability < seatsNeeded) {
          const err: any = new Error(`Not enough seats available. Only ${flightRecord.seatAvailability} left.`);
          err.statusCode = 409;
          throw err;
        }

        // Decrement seat availability
        await tx.flight.update({
          where: { id: flightId },
          data: { seatAvailability: { decrement: seatsNeeded } },
        });

        basePrice = flightRecord.price * seatsNeeded;
      }

      // ==========================================
      // TAXES, SERVICE FEES & PROMO DISCOUNT
      // ==========================================
      const taxAmount = Math.round(basePrice * 0.12 * 100) / 100; // 12% standard tax
      const serviceFee = Math.round(basePrice * 0.03 * 100) / 100; // 3% service fee
      let discountAmount = 0;
      let appliedPromoCode: string | null = null;

      if (promoCode && promoCode.trim()) {
        const cleanPromo = promoCode.trim().toUpperCase();
        const offer = await tx.offer.findUnique({
          where: { promoCode: cleanPromo },
        });

        if (offer) {
          const now = new Date();
          const isNotExpired = offer.validUntil >= now;
          const hasLimit = offer.usageCount < offer.usageLimit;
          const categoryMatches = offer.category === 'ALL' || offer.category === bookingType;

          if (offer.active && isNotExpired && hasLimit && categoryMatches) {
            discountAmount = Math.round(((basePrice * offer.discountPercent) / 100) * 100) / 100;
            appliedPromoCode = cleanPromo;

            // Increment usage count
            await tx.offer.update({
              where: { id: offer.id },
              data: { usageCount: { increment: 1 } },
            });
          }
        }
      }

      const totalAmount = Math.max(0, Math.round((basePrice + taxAmount + serviceFee - discountAmount) * 100) / 100);

      // ==========================================
      // CREATE BOOKING RECORD
      // ==========================================
      let bookingNumber = generateBookingNumber();
      // Ensure unique reference
      while (await tx.booking.findUnique({ where: { bookingNumber } })) {
        bookingNumber = generateBookingNumber();
      }

      const booking = await tx.booking.create({
        data: {
          bookingNumber,
          userId,
          bookingType,
          status: 'CONFIRMED',
          totalAmount,
          currency: 'INR',
          basePrice,
          taxAmount,
          serviceFee,
          discountAmount,
          promoCode: appliedPromoCode,
          hotelId: hotelRecord?.id || null,
          roomId: roomRecord?.id || null,
          checkIn: checkIn ? new Date(checkIn) : null,
          checkOut: checkOut ? new Date(checkOut) : null,
          guests: guests || 1,
          flightId: flightRecord?.id || null,
          flightDepartureDate: flightDepartureDate ? new Date(flightDepartureDate) : null,
          flightReturnDate: flightReturnDate ? new Date(flightReturnDate) : null,
          contactInfo: JSON.stringify(contactInfo),
          guestDetails: JSON.stringify(guestDetails || []),
          specialRequests: specialRequests || null,
        },
        include: {
          hotel: true,
          room: true,
          flight: true,
        },
      });

      // ==========================================
      // CREATE PAYMENT RECORD
      // ==========================================
      const transactionId = `TXN-WN-${Math.floor(10000000 + Math.random() * 90000000)}`;
      const payment = await tx.payment.create({
        data: {
          bookingId: booking.id,
          transactionId,
          amount: totalAmount,
          currency: 'INR',
          method: paymentMethod || 'CREDIT_CARD',
          status: 'SUCCESS',
          paymentDetails: JSON.stringify({
            cardBrand: paymentDetails?.cardBrand || 'Visa',
            last4: paymentDetails?.last4 || '4242',
            expMonth: paymentDetails?.expMonth || '12',
            expYear: paymentDetails?.expYear || '28',
            mockGateway: true,
            processedAt: new Date().toISOString(),
          }),
        },
      });

      return { booking, payment };
    });

    // Send confirmation email asynchronously via Ethereal Mock Mailer
    sendBookingConfirmationEmail(result.booking).catch((err) =>
      console.error('Async mail dispatch error:', err)
    );

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully',
      data: {
        ...result.booking,
        payment: result.payment,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
      });
    }

    const status = error.statusCode || 400;
    res.status(status).json({
      success: false,
      message: error.message || 'Booking creation failed',
    });
  }
};

// 2. Get User Bookings
export const getUserBookings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const whereClause: any = req.user?.role === 'ADMIN' ? {} : { userId };

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        hotel: true,
        room: true,
        flight: true,
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// 3. Get Single Booking by Reference Number or ID
export const getBookingByNumber = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { bookingNumber } = req.params;

    const booking = await prisma.booking.findFirst({
      where: {
        OR: [{ bookingNumber }, { id: bookingNumber }],
      },
      include: {
        hotel: true,
        room: true,
        flight: true,
        payment: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Authorization: User must own booking or be admin
    if (booking.userId !== userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this booking',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// 4. Cancel Booking with Refund Policy Calculation
export const cancelBooking = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { bookingNumber } = req.params;
    const { reason } = req.body;

    const booking = await prisma.booking.findFirst({
      where: {
        OR: [{ bookingNumber }, { id: bookingNumber }],
      },
      include: {
        payment: true,
        flight: true,
        hotel: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.userId !== userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized action' });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    // ==========================================
    // REFUND POLICY CALCULATION
    // ==========================================
    const startDate = booking.bookingType === 'HOTEL' ? booking.checkIn : booking.flightDepartureDate;
    const now = new Date();
    let refundPercentage = 0;

    if (startDate) {
      const hoursUntil = (new Date(startDate).getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursUntil > 48) {
        // More than 48 hours: 100% full refund
        refundPercentage = 100;
      } else if (hoursUntil >= 24) {
        // Between 24 and 48 hours: 50% partial refund
        refundPercentage = 50;
      } else {
        // Less than 24 hours: Non-refundable
        refundPercentage = 0;
      }
    } else {
      refundPercentage = 100;
    }

    const refundAmount = Math.round(((booking.totalAmount * refundPercentage) / 100) * 100) / 100;

    // Execute in transaction
    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update Booking status
      const cancelledBooking = await tx.booking.update({
        where: { id: booking.id },
        data: {
          status: 'CANCELLED',
          refundAmount,
          cancellationReason: reason || 'Customer requested cancellation',
          cancelledAt: new Date(),
        },
      });

      // 2. Update Payment status
      if (booking.payment) {
        await tx.payment.update({
          where: { id: booking.payment.id },
          data: {
            status: refundAmount > 0 ? 'REFUNDED' : 'SUCCESS',
            paymentDetails: JSON.stringify({
              refundIssued: refundAmount,
              refundPercentage,
              refundedAt: new Date().toISOString(),
            }),
          },
        });
      }

      // 3. If flight, restore seat availability
      if (booking.bookingType === 'FLIGHT' && booking.flightId) {
        let count = 1;
        try {
          const gd = JSON.parse(booking.guestDetails || '[]');
          if (Array.isArray(gd) && gd.length > 0) count = gd.length;
        } catch (e) {}

        await tx.flight.update({
          where: { id: booking.flightId },
          data: { seatAvailability: { increment: count } },
        });
      }

      return cancelledBooking;
    });

    // Send Cancellation Email with refund details
    sendCancellationEmail(booking, refundAmount).catch((err) =>
      console.error('Async cancel mail dispatch error:', err)
    );

    res.status(200).json({
      success: true,
      message: 'Booking successfully cancelled',
      data: {
        bookingNumber: updated.bookingNumber,
        status: updated.status,
        refundPercentage,
        refundAmount,
        currency: updated.currency,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 5. Validate Promo Code
export const validatePromoCode = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const validated = validatePromoSchema.parse(req.body);
    const { promoCode, bookingType, baseAmount } = validated;

    const offer = await prisma.offer.findUnique({
      where: { promoCode: promoCode.trim().toUpperCase() },
    });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Invalid promo code. Please check and try again.',
      });
    }

    if (!offer.active) {
      return res.status(400).json({
        success: false,
        message: 'This promo code is currently inactive.',
      });
    }

    const now = new Date();
    if (offer.validUntil < now) {
      return res.status(400).json({
        success: false,
        message: 'This promo code has expired.',
      });
    }

    if (offer.usageCount >= offer.usageLimit) {
      return res.status(400).json({
        success: false,
        message: 'This promo code has reached its maximum usage limit.',
      });
    }

    if (offer.category !== 'ALL' && bookingType !== 'ALL' && offer.category !== bookingType) {
      return res.status(400).json({
        success: false,
        message: `This promo code is only valid for ${offer.category.toLowerCase()} bookings.`,
      });
    }

    const discountAmount = Math.round(((baseAmount * offer.discountPercent) / 100) * 100) / 100;
    const newTotal = Math.max(0, Math.round((baseAmount - discountAmount) * 100) / 100);

    res.status(200).json({
      success: true,
      message: `Promo code applied! You save ${offer.discountPercent}%.`,
      data: {
        promoCode: offer.promoCode,
        title: offer.title,
        discountPercent: offer.discountPercent,
        discountAmount,
        newTotal,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
      });
    }
    next(error);
  }
};

// 6. Check Availability
export const checkAvailability = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { type, roomId, flightId, checkIn, checkOut, passengers } = req.body;

    if (type === 'HOTEL') {
      if (!roomId || !checkIn || !checkOut) {
        return res.status(400).json({ success: false, message: 'Missing room or dates' });
      }

      const room = await prisma.room.findUnique({ where: { id: roomId } });
      if (!room) {
        return res.status(404).json({ success: false, message: 'Room not found' });
      }

      const cin = new Date(checkIn);
      const cout = new Date(checkOut);

      const overlap = await prisma.booking.count({
        where: {
          roomId,
          status: { in: ['CONFIRMED', 'PENDING'] },
          checkIn: { lt: cout },
          checkOut: { gt: cin },
        },
      });

      const isAvailable = overlap < room.availableCount;
      return res.status(200).json({
        success: true,
        data: {
          available: isAvailable,
          roomsLeft: Math.max(0, room.availableCount - overlap),
        },
      });
    }

    if (type === 'FLIGHT') {
      if (!flightId) {
        return res.status(400).json({ success: false, message: 'Missing flight ID' });
      }

      const flight = await prisma.flight.findUnique({ where: { id: flightId } });
      if (!flight) {
        return res.status(404).json({ success: false, message: 'Flight not found' });
      }

      const needed = passengers || 1;
      const isAvailable = flight.seatAvailability >= needed;

      return res.status(200).json({
        success: true,
        data: {
          available: isAvailable,
          seatsLeft: flight.seatAvailability,
        },
      });
    }

    res.status(400).json({ success: false, message: 'Invalid check type' });
  } catch (error) {
    next(error);
  }
};
