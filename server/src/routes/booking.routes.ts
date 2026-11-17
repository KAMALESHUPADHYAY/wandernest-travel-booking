import { Router } from 'express';
import {
  createBooking,
  getUserBookings,
  getBookingByNumber,
  cancelBooking,
  validatePromoCode,
  checkAvailability,
} from '../controllers/booking.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Promo validation & availability can be checked during checkout
router.post('/validate-promo', validatePromoCode);
router.post('/check-availability', checkAvailability);

// Protected routes (Authentication Required)
router.post('/', authenticate, createBooking);
router.get('/', authenticate, getUserBookings);
router.get('/:bookingNumber', authenticate, getBookingByNumber);
router.post('/:bookingNumber/cancel', authenticate, cancelBooking);

export default router;
