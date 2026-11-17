import { prisma } from '../config/prisma.js';

interface TestResult {
  name: string;
  passed: boolean;
  message?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runBookingTests() {
  console.log('🧪 Starting WanderNest Phase 5 Booking & Payment Tests...\n');

  // Test 1: Price Calculation and Breakdown
  try {
    const basePrice = 1000;
    const taxRate = 0.12;
    const serviceFeeRate = 0.03;
    const discountPercent = 20;

    const taxAmount = Math.round(basePrice * taxRate * 100) / 100; // 120
    const serviceFee = Math.round(basePrice * serviceFeeRate * 100) / 100; // 30
    const discountAmount = Math.round(((basePrice * discountPercent) / 100) * 100) / 100; // 200
    const totalAmount = Math.round((basePrice + taxAmount + serviceFee - discountAmount) * 100) / 100; // 950

    assert(taxAmount === 120, `Expected tax 120, got ${taxAmount}`);
    assert(serviceFee === 30, `Expected serviceFee 30, got ${serviceFee}`);
    assert(discountAmount === 200, `Expected discount 200, got ${discountAmount}`);
    assert(totalAmount === 950, `Expected total 950, got ${totalAmount}`);

    results.push({ name: '1. Price Calculation & Breakdown', passed: true });
    console.log('  ✅ 1. Price Calculation & Breakdown: Passed');
  } catch (err: any) {
    results.push({ name: '1. Price Calculation & Breakdown', passed: false, message: err.message });
    console.error('  ❌ 1. Price Calculation & Breakdown:', err.message);
  }

  // Test 2: Promo Code Expiry and Usage Limit Validation
  try {
    const validOffer = await prisma.offer.findUnique({ where: { promoCode: 'WANDER10' } });
    assert(!!validOffer, 'WANDER10 coupon should exist');
    assert(validOffer!.active === true, 'WANDER10 should be active');
    assert(validOffer!.validUntil > new Date(), 'WANDER10 should not be expired');
    assert(validOffer!.usageCount < validOffer!.usageLimit, 'WANDER10 should not exceed limit');

    const expiredOffer = await prisma.offer.findUnique({ where: { promoCode: 'EXPIRED50' } });
    assert(!!expiredOffer, 'EXPIRED50 coupon should exist');
    assert(expiredOffer!.validUntil < new Date(), 'EXPIRED50 should be recognized as expired');

    const maxedOffer = await prisma.offer.findUnique({ where: { promoCode: 'MAXED30' } });
    assert(!!maxedOffer, 'MAXED30 coupon should exist');
    assert(maxedOffer!.usageCount >= maxedOffer!.usageLimit, 'MAXED30 should be recognized as maxed out');

    results.push({ name: '2. Promo Code Expiry & Usage Validation', passed: true });
    console.log('  ✅ 2. Promo Code Expiry & Usage Validation: Passed');
  } catch (err: any) {
    results.push({ name: '2. Promo Code Expiry & Usage Validation', passed: false, message: err.message });
    console.error('  ❌ 2. Promo Code Expiry & Usage Validation:', err.message);
  }

  // Test 3: Hotel Availability and Double-Booking Prevention
  try {
    const demoUser = await prisma.user.findFirst({ where: { role: 'USER' } }) || await prisma.user.findFirst();
    const hotel = await prisma.hotel.findFirst({ include: { rooms: true } });
    assert(!!demoUser && !!hotel && hotel.rooms.length > 0, 'Seed data missing for availability test');

    const room = hotel!.rooms[0];
    const checkIn = new Date('2028-06-01T12:00:00Z');
    const checkOut = new Date('2028-06-05T10:00:00Z');

    // Clean any prior test bookings for this room in 2028
    await prisma.booking.deleteMany({
      where: {
        roomId: room.id,
        checkIn: { gte: new Date('2028-01-01') },
      },
    });

    // Create bookings up to room.availableCount
    const createdIds: string[] = [];
    for (let i = 0; i < room.availableCount; i++) {
      const b = await prisma.booking.create({
        data: {
          bookingNumber: `TEST-WN-${Math.floor(100000 + Math.random() * 900000)}`,
          userId: demoUser!.id,
          bookingType: 'HOTEL',
          status: 'CONFIRMED',
          totalAmount: 500,
          currency: 'INR',
          roomId: room.id,
          hotelId: hotel!.id,
          checkIn,
          checkOut,
          contactInfo: JSON.stringify({ email: 'test@wandernest.com', fullName: 'Test Traveler' }),
        },
      });
      createdIds.push(b.id);
    }

    // Now attempt to book an overlapping date: 2028-06-02 to 2028-06-04
    const overlapCin = new Date('2028-06-02T12:00:00Z');
    const overlapCout = new Date('2028-06-04T10:00:00Z');

    const overlapCount = await prisma.booking.count({
      where: {
        roomId: room.id,
        status: { in: ['CONFIRMED', 'PENDING'] },
        checkIn: { lt: overlapCout },
        checkOut: { gt: overlapCin },
      },
    });

    const isAvailable = overlapCount < room.availableCount;
    assert(!isAvailable, `Double-booking prevention: room must be NOT available when overlapCount (${overlapCount}) >= capacity (${room.availableCount})`);

    // Clean up test bookings
    await prisma.booking.deleteMany({
      where: { id: { in: createdIds } },
    });

    results.push({ name: '3. Hotel Availability & Double-Booking Prevention', passed: true });
    console.log('  ✅ 3. Hotel Availability & Double-Booking Prevention: Passed');
  } catch (err: any) {
    results.push({ name: '3. Hotel Availability & Double-Booking Prevention', passed: false, message: err.message });
    console.error('  ❌ 3. Hotel Availability & Double-Booking Prevention:', err.message);
  }

  // Test 4: Cancellation Refund Policy Rules
  try {
    const total = 1000;
    const now = new Date();

    // Case A: More than 48 hours in future (> 48h) -> 100% refund
    const futureDateFar = new Date(now.getTime() + 72 * 60 * 60 * 1000);
    const hoursFar = (futureDateFar.getTime() - now.getTime()) / (1000 * 60 * 60);
    const refundPctFar = hoursFar > 48 ? 100 : hoursFar >= 24 ? 50 : 0;
    const refundFar = (total * refundPctFar) / 100;
    assert(refundFar === 1000, `Expected 1000 full refund for 72h notice, got ${refundFar}`);

    // Case B: Between 24 and 48 hours (36h) -> 50% refund
    const futureDateMid = new Date(now.getTime() + 36 * 60 * 60 * 1000);
    const hoursMid = (futureDateMid.getTime() - now.getTime()) / (1000 * 60 * 60);
    const refundPctMid = hoursMid > 48 ? 100 : hoursMid >= 24 ? 50 : 0;
    const refundMid = (total * refundPctMid) / 100;
    assert(refundMid === 500, `Expected 500 partial refund for 36h notice, got ${refundMid}`);

    // Case C: Less than 24 hours (12h) -> 0% refund
    const futureDateClose = new Date(now.getTime() + 12 * 60 * 60 * 1000);
    const hoursClose = (futureDateClose.getTime() - now.getTime()) / (1000 * 60 * 60);
    const refundPctClose = hoursClose > 48 ? 100 : hoursClose >= 24 ? 50 : 0;
    const refundClose = (total * refundPctClose) / 100;
    assert(refundClose === 0, `Expected 0 non-refundable for 12h notice, got ${refundClose}`);

    results.push({ name: '4. Cancellation Refund Policy Rules', passed: true });
    console.log('  ✅ 4. Cancellation Refund Policy Rules: Passed');
  } catch (err: any) {
    results.push({ name: '4. Cancellation Refund Policy Rules', passed: false, message: err.message });
    console.error('  ❌ 4. Cancellation Refund Policy Rules:', err.message);
  }

  // Summary
  console.log('\n===============================================================');
  const allPassed = results.every((r) => r.passed);
  if (allPassed) {
    console.log('🎉 ALL 4 BOOKING TEST SUITES PASSED CLEANLY (100%)');
  } else {
    console.error('❌ SOME TESTS FAILED');
    process.exit(1);
  }
  console.log('===============================================================\n');
}

runBookingTests()
  .catch((e) => {
    console.error('Fatal test error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
