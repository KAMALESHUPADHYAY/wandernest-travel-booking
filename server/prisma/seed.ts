import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting WanderNest Database Seed...');

  // Clean existing tables (in order of relations)
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.room.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.flight.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.newsletter.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing records.');

  // 1. Create Users (Admin and Demo Travelers)
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('admin123', salt);
  const travelerPassword = await bcrypt.hash('traveler123', salt);

  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin WanderNest',
      email: 'admin@wandernest.com',
      password: adminPassword,
      role: 'ADMIN',
      phone: '+1 800 555 0199',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      name: 'Sarah Jenkins',
      email: 'traveler@wandernest.com',
      password: travelerPassword,
      role: 'USER',
      phone: '+1 415 892 4432',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    },
  });

  console.log('👤 Users created: Admin & Demo Traveler');

  // 2. Create Destinations
  const destinationsData = [
    {
      name: 'Paris',
      slug: 'paris-france',
      country: 'France',
      city: 'Paris',
      description: 'The City of Light captivates with timeless art, historic boulevards, romantic bistros, and iconic architectural wonders like the Eiffel Tower.',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      popular: true,
      featured: true,
      latitude: 48.8566,
      longitude: 2.3522,
    },
    {
      name: 'Tokyo',
      slug: 'tokyo-japan',
      country: 'Japan',
      city: 'Tokyo',
      description: 'A dazzling convergence of ultramodern neon skyscrapers, ancient Shinto shrines, Michelin-starred cuisine, and vibrant street culture.',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      popular: true,
      featured: true,
      latitude: 35.6762,
      longitude: 139.6503,
    },
    {
      name: 'Bali',
      slug: 'bali-indonesia',
      country: 'Indonesia',
      city: 'Bali',
      description: 'An Indonesian tropical paradise renowned for emerald rice terraces, serene beachfront resorts, spiritual temples, and surf sanctuaries.',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
      popular: true,
      featured: true,
      latitude: -8.4095,
      longitude: 115.1889,
    },
    {
      name: 'New York City',
      slug: 'new-york-usa',
      country: 'United States',
      city: 'New York',
      description: 'The premier global metropolis with world-famous Broadway theaters, iconic skyline views, Central Park greenery, and 24/7 energy.',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
      popular: true,
      featured: true,
      latitude: 40.7128,
      longitude: -74.006,
    },
    {
      name: 'Swiss Alps',
      slug: 'swiss-alps-switzerland',
      country: 'Switzerland',
      city: 'Zermatt',
      description: 'Majestic snow-capped alpine peaks, scenic glacier express trains, luxury ski chalets, and breathtaking pristine mountain lakes.',
      image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
      popular: true,
      featured: true,
      latitude: 45.9765,
      longitude: 7.7491,
    },
    {
      name: 'Dubai',
      slug: 'dubai-uae',
      country: 'United Arab Emirates',
      city: 'Dubai',
      description: 'A futuristic oasis of record-breaking skyscrapers, opulent shopping malls, desert safaris, and ultra-luxurious beachfront palaces.',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
      popular: true,
      featured: false,
      latitude: 25.2048,
      longitude: 55.2708,
    },
    {
      name: 'Rome',
      slug: 'rome-italy',
      country: 'Italy',
      city: 'Rome',
      description: 'The Eternal City where ancient Roman ruins like the Colosseum blend seamlessly with lively piazzas, artisan gelato, and Vatican treasures.',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
      popular: true,
      featured: true,
      latitude: 41.9028,
      longitude: 12.4964,
    },
    {
      name: 'Santorini',
      slug: 'santorini-greece',
      country: 'Greece',
      city: 'Oia',
      description: 'Stunning white-washed cliffside villages, cobalt blue domes, dramatic volcanic caldera vistas, and world-renowned golden sunsets.',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
      popular: true,
      featured: true,
      latitude: 36.3932,
      longitude: 25.4615,
    },
  ];

  const createdDestinations: Record<string, any> = {};
  for (const dest of destinationsData) {
    const created = await prisma.destination.create({ data: dest });
    createdDestinations[dest.city] = created;
  }
  console.log(`📍 Created ${destinationsData.length} Destinations`);

  // 3. Create Hotels & Rooms
  const hotelsData = [
    {
      city: 'Paris',
      name: 'Le Grand Palais Royale Hotel',
      slug: 'le-grand-palais-royale-paris',
      address: '14 Rue de Rivoli, 1st Arrondissement',
      country: 'France',
      latitude: 48.8624,
      longitude: 2.3364,
      rating: 4.9,
      reviewCount: 384,
      starRating: 5,
      pricePerNight: 380,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80',
      ]),
      amenities: JSON.stringify([
        'Free high-speed WiFi',
        'Eiffel Tower views',
        'Fine Dining Restaurant',
        'Spa & Wellness Sanctuary',
        '24/7 Concierge Service',
        'Airport Limousine Transfer',
      ]),
      description: 'Situated steps away from the Louvre and Tuileries Garden, this 5-star haven provides quintessential Parisian luxury with plush suites, marble baths, and Michelin-starred dining.',
      policies: 'Check-in: 3:00 PM | Check-out: 12:00 PM. Free cancellation up to 48 hours before check-in.',
      featured: true,
      rooms: [
        {
          name: 'Classic Parisian Queen Room',
          type: 'Standard',
          capacity: 2,
          bedType: '1 Queen Bed',
          pricePerNight: 380,
          originalPrice: 450,
          size: 28,
          amenities: JSON.stringify(['City View', 'Ensuite Marble Bath', 'Nespresso Machine', 'Complimentary WiFi']),
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
          ]),
          availableCount: 4,
        },
        {
          name: 'Executive Eiffel View Suite',
          type: 'Suite',
          capacity: 3,
          bedType: '1 King Bed + 1 Sofa Bed',
          pricePerNight: 620,
          originalPrice: 750,
          size: 48,
          amenities: JSON.stringify(['Eiffel Tower Balcony View', 'Living Salon', 'Deep Soaking Tub', 'Breakfast Buffet Included']),
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
          ]),
          availableCount: 2,
        },
      ],
    },
    {
      city: 'Tokyo',
      name: 'Shinjuku Skyview Tower Hotel',
      slug: 'shinjuku-skyview-tower-tokyo',
      address: '2-8-1 Nishi-Shinjuku, Shinjuku-ku',
      country: 'Japan',
      latitude: 35.6896,
      longitude: 139.6917,
      rating: 4.8,
      reviewCount: 512,
      starRating: 5,
      pricePerNight: 295,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80',
      ]),
      amenities: JSON.stringify([
        'Panoramic Mount Fuji Views',
        'Indoor Heated Pool',
        'Authentic Japanese Onsen Spa',
        'Subway Direct Access',
        'Whisky & Cocktail Bar',
      ]),
      description: 'Towering above the bustling vibrant pulse of Shinjuku, this sanctuary combines Japanese minimalism with contemporary elegance and awe-inspiring cityscape views.',
      policies: 'Check-in: 2:00 PM | Check-out: 11:00 AM. 100% Non-smoking property.',
      featured: true,
      rooms: [
        {
          name: 'Deluxe City View Twin Room',
          type: 'Deluxe',
          capacity: 2,
          bedType: '2 Twin Beds',
          pricePerNight: 295,
          originalPrice: 340,
          size: 32,
          amenities: JSON.stringify(['High Floor Panorama', 'Yukata Robes', 'Rain Shower', 'Complimentary High-speed WiFi']),
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
          ]),
          availableCount: 6,
        },
        {
          name: 'Corner Sky Suite with Mt. Fuji Vista',
          type: 'Suite',
          capacity: 2,
          bedType: '1 California King Bed',
          pricePerNight: 510,
          originalPrice: 590,
          size: 55,
          amenities: JSON.stringify(['Floor-to-Ceiling Windows', 'Club Lounge Access', 'Luxury Washlet', 'Free Minibar']),
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
          ]),
          availableCount: 3,
        },
      ],
    },
    {
      city: 'Bali',
      name: 'Maya Ubud Sanctuary & Villas',
      slug: 'maya-ubud-sanctuary-villas-bali',
      address: 'Jl. Gunung Sari, Peliatan, Ubud',
      country: 'Indonesia',
      latitude: -8.5069,
      longitude: 115.2625,
      rating: 4.95,
      reviewCount: 420,
      starRating: 5,
      pricePerNight: 240,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80',
      ]),
      amenities: JSON.stringify([
        'Private Infinity Plunge Pool',
        'Jungle Canopy Yoga Pavilion',
        'Organic Farm-to-Table Dining',
        'Ayurvedic River Spa',
        'Complimentary Ubud Shuttle',
      ]),
      description: 'Hidden amid lush river valleys and whispering jungle canopies in Ubud, discover handcrafted private pool villas designed for total rejuvenation and peace.',
      policies: 'Check-in: 2:00 PM | Check-out: 12:00 PM. Includes daily gourmet breakfast and afternoon tea.',
      featured: true,
      rooms: [
        {
          name: 'Forest Haven Villa with Private Pool',
          type: 'Suite',
          capacity: 2,
          bedType: '1 King Four-Poster Bed',
          pricePerNight: 240,
          originalPrice: 310,
          size: 65,
          amenities: JSON.stringify(['Private Plunge Pool', 'Outdoor Sun Deck', 'Garden Stone Tub', 'Daily Gourmet Breakfast']),
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
          ]),
          availableCount: 5,
        },
      ],
    },
    {
      city: 'New York',
      name: 'The Manhattanite Midtown Boutique',
      slug: 'the-manhattanite-midtown-boutique-nyc',
      address: '128 W 58th St, Midtown Manhattan',
      country: 'United States',
      latitude: 40.7644,
      longitude: -73.9787,
      rating: 4.65,
      reviewCount: 290,
      starRating: 4,
      pricePerNight: 315,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1000&q=80',
      ]),
      amenities: JSON.stringify([
        'Steps from Central Park & Fifth Ave',
        'Rooftop Speakeasy Lounge',
        'Equinox Fitness Center Pass',
        'Complimentary Morning Espresso Bar',
      ]),
      description: 'A stylish and energetic Manhattan residence offering chic design, custom hardwood furnishings, and instant proximity to Columbus Circle and Broadway.',
      policies: 'Check-in: 3:00 PM | Check-out: 11:00 AM. Pet-friendly with dedicated dog amenities.',
      featured: true,
      rooms: [
        {
          name: 'Midtown King Studio',
          type: 'Deluxe',
          capacity: 2,
          bedType: '1 King Bed',
          pricePerNight: 315,
          originalPrice: 380,
          size: 30,
          amenities: JSON.stringify(['Custom Work Desk', 'Smart 55" TV', 'Rainfall Shower', 'Artisan Coffee Maker']),
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
          ]),
          availableCount: 8,
        },
      ],
    },
    {
      city: 'Zermatt',
      name: 'Matterhorn Alpine Chalet & Spa',
      slug: 'matterhorn-alpine-chalet-spa-zermatt',
      address: 'Riedweg 15, Zermatt',
      country: 'Switzerland',
      latitude: 45.9765,
      longitude: 7.7491,
      rating: 4.9,
      reviewCount: 210,
      starRating: 5,
      pricePerNight: 460,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1000&q=80',
      ]),
      amenities: JSON.stringify([
        'Direct Ski-in / Ski-out Access',
        'Heated Thermal Outdoor Pool with Matterhorn View',
        'Finnish Sauna & Steam Grotto',
        'Swiss Fondue & Wine Cellar',
      ]),
      description: 'Experience genuine Swiss hospitality in an exclusive timber chalet boasting uninterrupted views of the legendary Matterhorn peak.',
      policies: 'Car-free resort town; electro-taxi transfer included from Zermatt train station.',
      featured: true,
      rooms: [
        {
          name: 'Matterhorn Alpine Suite',
          type: 'Suite',
          capacity: 2,
          bedType: '1 King Bed',
          pricePerNight: 460,
          originalPrice: 540,
          size: 45,
          amenities: JSON.stringify(['Private Wood-burning Fireplace', 'Matterhorn Balcony', 'Whirlpool Bath', 'Heated Ski Locker']),
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
          ]),
          availableCount: 3,
        },
      ],
    },
  ];

  for (const h of hotelsData) {
    const destination = createdDestinations[h.city];
    if (!destination) continue;

    const { rooms, ...hotelFields } = h;
    const hotel = await prisma.hotel.create({
      data: {
        ...hotelFields,
        destinationId: destination.id,
      },
    });

    for (const r of rooms) {
      await prisma.room.create({
        data: {
          ...r,
          hotelId: hotel.id,
        },
      });
    }
  }
  console.log(`🏨 Created ${hotelsData.length} Hotels with Luxury Rooms`);

  // 4. Create Flights
  const flightsData = [
    {
      flightNumber: 'AF-142',
      airline: 'Air France',
      airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=100&q=80',
      departureAirport: 'JFK',
      arrivalAirport: 'CDG',
      departureCity: 'New York',
      arrivalCity: 'Paris',
      departureTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
      arrivalTime: new Date(Date.now() + 1000 * 60 * 60 * (24 * 7 + 8)), // 8 hr duration
      duration: 480,
      stops: 0,
      price: 540,
      cabinClass: 'ECONOMY',
      seatAvailability: 42,
      featured: true,
    },
    {
      flightNumber: 'NH-108',
      airline: 'All Nippon Airways (ANA)',
      airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=100&q=80',
      departureAirport: 'LAX',
      arrivalAirport: 'HND',
      departureCity: 'Los Angeles',
      arrivalCity: 'Tokyo',
      departureTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
      arrivalTime: new Date(Date.now() + 1000 * 60 * 60 * (24 * 10 + 11.5)),
      duration: 690,
      stops: 0,
      price: 780,
      cabinClass: 'ECONOMY',
      seatAvailability: 35,
      featured: true,
    },
    {
      flightNumber: 'EK-201',
      airline: 'Emirates',
      airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=100&q=80',
      departureAirport: 'LHR',
      arrivalAirport: 'DXB',
      departureCity: 'London',
      arrivalCity: 'Dubai',
      departureTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
      arrivalTime: new Date(Date.now() + 1000 * 60 * 60 * (24 * 5 + 7)),
      duration: 420,
      stops: 0,
      price: 490,
      cabinClass: 'BUSINESS',
      seatAvailability: 18,
      featured: true,
    },
    {
      flightNumber: 'SQ-452',
      airline: 'Singapore Airlines',
      airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=100&q=80',
      departureAirport: 'SIN',
      arrivalAirport: 'DPS',
      departureCity: 'Singapore',
      arrivalCity: 'Bali',
      departureTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      arrivalTime: new Date(Date.now() + 1000 * 60 * 60 * (24 * 3 + 2.8)),
      duration: 170,
      stops: 0,
      price: 185,
      cabinClass: 'ECONOMY',
      seatAvailability: 60,
      featured: true,
    },
    {
      flightNumber: 'BA-560',
      airline: 'British Airways',
      airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=100&q=80',
      departureAirport: 'LHR',
      arrivalAirport: 'FCO',
      departureCity: 'London',
      arrivalCity: 'Rome',
      departureTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
      arrivalTime: new Date(Date.now() + 1000 * 60 * 60 * (24 * 4 + 2.5)),
      duration: 150,
      stops: 0,
      price: 135,
      cabinClass: 'ECONOMY',
      seatAvailability: 24,
      featured: true,
    },
  ];

  for (const f of flightsData) {
    await prisma.flight.create({ data: f });
  }
  console.log(`✈️ Created ${flightsData.length} Global Flights`);

  // 5. Create Offers & Promos
  const offersData = [
    {
      title: 'Early Bird Summer Escape',
      badge: 'Save 25%',
      discountPercent: 25,
      promoCode: 'SUMMER25',
      description: 'Book your dream summer vacation 30 days in advance and unlock 25% off participating luxury hotels.',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      validUntil: new Date('2026-09-30'),
      category: 'HOTEL',
    },
    {
      title: 'Global Jetsetter Flights',
      badge: 'Flat 15% OFF',
      discountPercent: 15,
      promoCode: 'FLY15',
      description: 'Fly with top-tier global airlines across international routes with an instant 15% discount at checkout.',
      imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
      validUntil: new Date('2026-12-31'),
      category: 'FLIGHT',
    },
    {
      title: 'Weekend Flash Getaway',
      badge: 'Up to 30% OFF',
      discountPercent: 30,
      promoCode: 'WEEKEND30',
      description: 'Spontaneous escapes made affordable. Enjoy exclusive weekend staycation deals with free breakfast included.',
      imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
      validUntil: new Date('2026-11-30'),
      category: 'HOTEL',
    },
  ];

  for (const off of offersData) {
    await prisma.offer.create({ data: off });
  }
  console.log(`🏷️ Created ${offersData.length} Offers & Deals`);

  // 6. Create Demo Booking and Review for Sarah Jenkins
  const parisHotel = await prisma.hotel.findFirst({ where: { city: 'Paris' }, include: { rooms: true } });
  if (parisHotel && parisHotel.rooms[0]) {
    const booking = await prisma.booking.create({
      data: {
        bookingNumber: 'WN-2026-78419',
        userId: demoUser.id,
        bookingType: 'HOTEL',
        status: 'CONFIRMED',
        totalAmount: 760,
        currency: 'USD',
        checkIn: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
        checkOut: new Date(Date.now() + 1000 * 60 * 60 * 24 * 16),
        guests: 2,
        hotelId: parisHotel.id,
        roomId: parisHotel.rooms[0].id,
        contactInfo: JSON.stringify({
          fullName: 'Sarah Jenkins',
          email: 'traveler@wandernest.com',
          phone: '+1 415 892 4432',
        }),
        guestDetails: JSON.stringify([
          { name: 'Sarah Jenkins', type: 'Adult' },
          { name: 'David Jenkins', type: 'Adult' },
        ]),
        specialRequests: 'Quiet high-floor room preferred. Arriving around 4 PM.',
      },
    });

    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        transactionId: 'TXN-WN-9842104',
        amount: 760,
        currency: 'USD',
        method: 'CREDIT_CARD',
        status: 'SUCCESS',
        paymentDetails: JSON.stringify({
          brand: 'Visa',
          last4: '4242',
        }),
      },
    });

    await prisma.review.create({
      data: {
        userId: demoUser.id,
        hotelId: parisHotel.id,
        rating: 5.0,
        title: 'Unforgettable Parisian Stay',
        comment: 'The location near the Louvre is unbeatable! The staff went above and beyond to secure reservations for us, and the bed felt like sleeping on a cloud.',
        pros: 'Stunning city views, delicious breakfast pastries, pristine cleanliness.',
        cons: 'Elevator was slightly snug, but expected for historic architecture.',
        tripType: 'COUPLE',
      },
    });

    await prisma.wishlist.create({
      data: {
        userId: demoUser.id,
        hotelId: parisHotel.id,
      },
    });
  }

  console.log('✅ WanderNest Database Seed Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
