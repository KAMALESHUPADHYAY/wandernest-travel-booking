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

  // 2. Create Destinations (International & India)
  const destinationsData = [
    {
      name: 'Paris',
      slug: 'paris-france',
      country: 'France',
      city: 'Paris',
      category: 'City',
      bestTime: 'April to October (Spring bloom & mild autumn)',
      description: 'The City of Light captivates with timeless art, historic boulevards, romantic bistros, and iconic architectural wonders like the Eiffel Tower.',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      attractions: JSON.stringify([
        { name: 'Eiffel Tower', desc: 'Wrought-iron landmark offering 360-degree panoramas over the Seine' },
        { name: 'Louvre Museum', desc: 'World largest art museum housing the Mona Lisa and Venus de Milo' },
        { name: 'Montmartre & Sacré-Cœur', desc: 'Bohemian hilltop artists district with panoramic basilica terrace' },
      ]),
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
      category: 'City',
      bestTime: 'March to May & September to November',
      description: 'A dazzling convergence of ultramodern neon skyscrapers, ancient Shinto shrines, Michelin-starred cuisine, and vibrant street culture.',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      attractions: JSON.stringify([
        { name: 'Sensō-ji Temple', desc: 'Asakusa historic 7th-century temple surrounded by artisan street stalls' },
        { name: 'Shibuya Crossing', desc: 'The world busiest pedestrian intersection lined with neon video billboards' },
        { name: 'Meiji Jingu Shrine', desc: 'Tranquil forested Shinto sanctuary dedicated to Emperor Meiji' },
      ]),
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
      category: 'Beach',
      bestTime: 'May to September (Dry sunny season)',
      description: 'An Indonesian tropical paradise renowned for emerald rice terraces, serene beachfront resorts, spiritual temples, and surf sanctuaries.',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
      attractions: JSON.stringify([
        { name: 'Uluwatu Cliff Temple', desc: 'Ancient ocean-cliff temple hosting nightly Kecak fire dance shows' },
        { name: 'Tegallalang Rice Terraces', desc: 'UNESCO-recognized terraced paddy fields sculpted into jungle hills' },
        { name: 'Seminyak Beach & Reefs', desc: 'Golden sand coastline famous for world-class sunset beach clubs' },
      ]),
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
      category: 'City',
      bestTime: 'September to November & Spring months',
      description: 'The premier global metropolis with world-famous Broadway theaters, iconic skyline views, Central Park greenery, and 24/7 energy.',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
      attractions: JSON.stringify([
        { name: 'Central Park', desc: '843 acres of sprawling greenery, ponds, and bridges in the heart of Manhattan' },
        { name: 'Empire State Building', desc: 'Art Deco skyscraper with an 86th-floor open-air observation deck' },
        { name: 'Times Square & Broadway', desc: 'Electrifying theater district alive with world-class stage musicals' },
      ]),
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
      category: 'Mountains',
      bestTime: 'December to April (Skiing) & July to September (Hiking)',
      description: 'Majestic snow-capped alpine peaks, scenic glacier express trains, luxury ski chalets, and breathtaking pristine mountain lakes.',
      image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
      attractions: JSON.stringify([
        { name: 'The Matterhorn Peak', desc: 'Iconic pyramid-shaped summit renowned across mountaineering history' },
        { name: 'Gornergrat Railway', desc: 'Historic open-air cogwheel train climbing to 3,089 meters' },
        { name: 'Matterhorn Glacier Paradise', desc: 'Highest cable car station in Europe with year-round snow viewing' },
      ]),
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
      category: 'City',
      bestTime: 'November to March (Pleasant outdoor weather)',
      description: 'A futuristic oasis of record-breaking skyscrapers, opulent shopping malls, desert safaris, and ultra-luxurious beachfront palaces.',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
      attractions: JSON.stringify([
        { name: 'Burj Khalifa', desc: 'World tallest skyscraper reaching 828 meters above Downtown Dubai' },
        { name: 'Dubai Mall & Fountain', desc: 'Enormous entertainment destination with choreographed water displays' },
        { name: 'Palm Jumeirah', desc: 'Tree-shaped archipelago lined with luxury beach resorts and marinas' },
      ]),
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
      category: 'Honeymoon',
      bestTime: 'April to June & September to October',
      description: 'The Eternal City where ancient Roman ruins like the Colosseum blend seamlessly with lively piazzas, artisan gelato, and Vatican treasures.',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
      attractions: JSON.stringify([
        { name: 'The Colosseum', desc: 'Iconic amphitheater where ancient gladiators fought before 50,000 spectators' },
        { name: 'Trevi Fountain', desc: 'Baroque masterpiece fountain where tossing a coin guarantees your return' },
        { name: 'Vatican City & St. Peters', desc: 'Papal seat featuring Michelangelo Sistine Chapel frescoes' },
      ]),
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
      category: 'Honeymoon',
      bestTime: 'May to October (Warm Aegean summer days)',
      description: 'Stunning white-washed cliffside villages, cobalt blue domes, dramatic volcanic caldera vistas, and world-renowned golden sunsets.',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
      attractions: JSON.stringify([
        { name: 'Oia Sunset Castle', desc: 'Venetian ruins offering world-famous cliffside golden hour vistas' },
        { name: 'Red Beach & Caldera Boat Tours', desc: 'Striking volcanic red cliffs and hot mineral sea springs' },
        { name: 'Fira to Oia Cliff Trail', desc: 'Scenic 10km coastal hiking trail hugging the volcanic rim' },
      ]),
      popular: true,
      featured: true,
      latitude: 36.3932,
      longitude: 25.4615,
    },
    {
      name: 'Goa',
      slug: 'goa-india',
      country: 'India',
      city: 'Goa',
      category: 'Beach',
      bestTime: 'November to March (Cool breezes & festive beach nightlife)',
      description: 'Sun-drenched golden beaches, Portuguese-colonial architecture, vibrant beach shacks, and exhilarating water sports on the Arabian Sea.',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      attractions: JSON.stringify([
        { name: 'Basilica of Bom Jesus', desc: '16th-century UNESCO World Heritage church housing St. Francis Xavier tomb' },
        { name: 'Palolem Beach', desc: 'Picturesque crescent bay shaded by coconut groves and beach cafes' },
        { name: 'Dudhsagar Waterfalls', desc: 'Four-tiered sea of milk cascade nestled inside Bhagwan Mahavir Sanctuary' },
      ]),
      popular: true,
      featured: true,
      latitude: 15.2993,
      longitude: 74.124,
    },
    {
      name: 'Jaipur',
      slug: 'jaipur-india',
      country: 'India',
      city: 'Jaipur',
      category: 'Family',
      bestTime: 'October to March (Pleasant winter climate for forts)',
      description: 'The storied Pink City of Rajasthan with magnificent hilltop forts, ornate royal palaces, bustling handicraft bazaars, and opulent heritage stays.',
      image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
      attractions: JSON.stringify([
        { name: 'Amber Fort & Palace', desc: 'Spectacular yellow sandstone fortress with the famous Sheesh Mahal mirror hall' },
        { name: 'Hawa Mahal', desc: 'Honeycomb Palace of Winds designed with 953 intricate jharokha windows' },
        { name: 'City Palace Museum', desc: 'Regal royal courtyard complex showcasing textiles, weaponry, and courtyards' },
      ]),
      popular: true,
      featured: true,
      latitude: 26.9124,
      longitude: 75.7873,
    },
    {
      name: 'Kerala',
      slug: 'kerala-india',
      country: 'India',
      city: 'Munnar',
      category: 'Adventure',
      bestTime: 'September to March (Lush green tea plantations)',
      description: "God's Own Country, famed for emerald backwaters, rolling tea plantation hills, tranquil Ayurvedic wellness retreats, and coastal palms.",
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
      attractions: JSON.stringify([
        { name: 'Eravikulam National Park', desc: 'Home to the endangered Nilgiri Tahr and rolling misty shola grassland' },
        { name: 'Mattupetty Dam & Lake', desc: 'Scenic mountain water storage offering speed boating and tea hill views' },
        { name: 'Anamudi Peak', desc: 'The highest peak in South India soaring 2,695 meters into the clouds' },
      ]),
      popular: true,
      featured: true,
      latitude: 10.0889,
      longitude: 77.0595,
    },
    {
      name: 'Manali',
      slug: 'manali-india',
      country: 'India',
      city: 'Manali',
      category: 'Mountains',
      bestTime: 'October to February (Snowfall) & March to June (Pleasant summers)',
      description: 'A Himalayan mountain paradise with pine forests, snow-peaked passes, apple orchards, river rafting, and cozy alpine log cabins.',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
      attractions: JSON.stringify([
        { name: 'Solang Valley', desc: 'Premier adventure hub for paragliding, zorbing, skiing, and snowmobiles' },
        { name: 'Rohtang Pass', desc: 'Spectacular 3,978-meter gateway connecting Kullu to the Lahaul-Spiti valley' },
        { name: 'Hadimba Wooden Temple', desc: 'Pagoda-style 16th-century cedar wood temple in the Dhungri forest' },
      ]),
      popular: true,
      featured: true,
      latitude: 32.2432,
      longitude: 77.1892,
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
    {
      city: 'Goa',
      name: 'The Leela Goa Beach Resort & Lagoons',
      slug: 'the-leela-goa-beach-resort',
      address: 'Mobor Beach, Cavelossim',
      country: 'India',
      latitude: 15.1611,
      longitude: 73.9458,
      rating: 4.88,
      reviewCount: 340,
      starRating: 5,
      pricePerNight: 210,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80',
      ]),
      amenities: JSON.stringify([
        'Direct Private Beachfront',
        'Lagoon Waterway Pools',
        '12-Hole Golf Course',
        'Seafood Beach Grill & Bar',
        'Ayurvedic Wellness Spa',
      ]),
      description: 'Set amidst 75 pristine acres of lush gardens and shimmering lotus lagoons by the Arabian Sea, experience ultimate Goan coastal luxury.',
      policies: 'Check-in: 2:00 PM | Check-out: 12:00 PM. Includes complimentary breakfast buffet.',
      featured: true,
      rooms: [
        {
          name: 'Lagoon Terrace Suite',
          type: 'Suite',
          capacity: 2,
          bedType: '1 King Bed',
          pricePerNight: 210,
          originalPrice: 260,
          size: 52,
          amenities: JSON.stringify(['Private Lagoon Balcony', 'Deep Soaking Tub', 'Complimentary High-speed WiFi']),
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
          ]),
          availableCount: 5,
        },
      ],
    },
    {
      city: 'Jaipur',
      name: 'Rambagh Heritage Palace & Courtyards',
      slug: 'rambagh-heritage-palace-jaipur',
      address: 'Bhawani Singh Road, Rambagh',
      country: 'India',
      latitude: 26.8978,
      longitude: 75.8073,
      rating: 4.96,
      reviewCount: 480,
      starRating: 5,
      pricePerNight: 350,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1000&q=80',
      ]),
      amenities: JSON.stringify([
        'Royal Palace Architecture',
        'Peacock Garden Walkways',
        'Heritage Spa Treatments',
        'Fine Dining Polo Lounge',
        'Butler Service',
      ]),
      description: 'Once the residence of the Maharaja of Jaipur, step into living history with marble corridors, hand-carved jali screens, and regal luxury.',
      policies: 'Check-in: 2:00 PM | Check-out: 12:00 PM. Traditional welcome with flower garlands.',
      featured: true,
      rooms: [
        {
          name: 'Royal Heritage Chamber',
          type: 'Suite',
          capacity: 2,
          bedType: '1 King Four-Poster Bed',
          pricePerNight: 350,
          originalPrice: 420,
          size: 60,
          amenities: JSON.stringify(['Palace Garden Views', 'Antique Furnishings', 'Luxury Marble Bath']),
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
          ]),
          availableCount: 4,
        },
      ],
    },
    {
      city: 'Munnar',
      name: 'Munnar Tea Mist Sanctuary & Villas',
      slug: 'munnar-tea-mist-sanctuary-kerala',
      address: 'Chithirapuram, Munnar',
      country: 'India',
      latitude: 10.0544,
      longitude: 77.0392,
      rating: 4.82,
      reviewCount: 195,
      starRating: 4,
      pricePerNight: 145,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80',
      ]),
      amenities: JSON.stringify([
        'Tea Plantation Treks',
        'Infinity Mist Pool',
        'Ayurvedic Spice Spa',
        'Private Valley Balconies',
        'Campfire Nights',
      ]),
      description: 'Perched high in the Western Ghats among fragrant spice groves and rolling emerald tea hills, Munnar Tea Mist offers pure mountain tranquility.',
      policies: 'Check-in: 1:00 PM | Check-out: 11:00 AM. Free guided morning tea walk.',
      featured: true,
      rooms: [
        {
          name: 'Valley View Mist Cottage',
          type: 'Standard',
          capacity: 2,
          bedType: '1 King Bed',
          pricePerNight: 145,
          originalPrice: 180,
          size: 38,
          amenities: JSON.stringify(['Tea Garden Panorama', 'Fireplace', 'Rain Shower']),
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
          ]),
          availableCount: 6,
        },
      ],
    },
    {
      city: 'Manali',
      name: 'Himalayan Cedar Woods Alpine Chalet',
      slug: 'himalayan-cedar-woods-manali',
      address: 'Log Huts Area, Old Manali',
      country: 'India',
      latitude: 32.2514,
      longitude: 77.1783,
      rating: 4.89,
      reviewCount: 230,
      starRating: 4,
      pricePerNight: 130,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1000&q=80',
      ]),
      amenities: JSON.stringify([
        'Snow Peak Views',
        'Cedar Wood Interiors',
        'Apple Orchard Gardens',
        'River Beas Rafting Desk',
        'Barbeque & Bonfire Lawn',
      ]),
      description: 'Crafted from authentic deodar timber and stone, enjoy stunning views of the Rohtang Pass peaks and peaceful Himalayan serenity.',
      policies: 'Check-in: 12:00 PM | Check-out: 11:00 AM. Heated rooms with electric blankets.',
      featured: true,
      rooms: [
        {
          name: 'Cedar Alpine Room',
          type: 'Deluxe',
          capacity: 2,
          bedType: '1 King Bed',
          pricePerNight: 130,
          originalPrice: 165,
          size: 35,
          amenities: JSON.stringify(['Mountain Balcony', 'Wood Stove Fireplace', 'Complimentary Breakfast']),
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
          ]),
          availableCount: 7,
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

  // 4. Create Flights (Comprehensive domestic & international airline fleet)
  const flightsData = [
    {
      flightNumber: '6E-204',
      airline: 'IndiGo',
      airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=100&q=80',
      departureAirport: 'DEL',
      arrivalAirport: 'GOI',
      departureCity: 'Delhi',
      arrivalCity: 'Goa',
      departureTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 60 * 6), // 06:00 AM
      arrivalTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 60 * 8.5),
      duration: 150,
      stops: 0,
      price: 85,
      cabinClass: 'ECONOMY',
      baggage: '7kg Cabin + 15kg Check-in',
      seatAvailability: 54,
      featured: true,
    },
    {
      flightNumber: '6E-512',
      airline: 'IndiGo',
      airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=100&q=80',
      departureAirport: 'BOM',
      arrivalAirport: 'GOI',
      departureCity: 'Mumbai',
      arrivalCity: 'Goa',
      departureTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4 + 1000 * 60 * 60 * 14), // 02:00 PM
      arrivalTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4 + 1000 * 60 * 60 * 15.25),
      duration: 75,
      stops: 0,
      price: 65,
      cabinClass: 'ECONOMY',
      baggage: '7kg Cabin + 15kg Check-in',
      seatAvailability: 48,
      featured: true,
    },
    {
      flightNumber: 'AI-805',
      airline: 'Air India',
      airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=100&q=80',
      departureAirport: 'BOM',
      arrivalAirport: 'JAI',
      departureCity: 'Mumbai',
      arrivalCity: 'Jaipur',
      departureTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 60 * 9), // 09:00 AM
      arrivalTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 60 * 10.8),
      duration: 110,
      stops: 0,
      price: 75,
      cabinClass: 'ECONOMY',
      baggage: '7kg Cabin + 25kg Check-in',
      seatAvailability: 38,
      featured: true,
    },
    {
      flightNumber: 'UK-945',
      airline: 'Vistara',
      airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=100&q=80',
      departureAirport: 'DEL',
      arrivalAirport: 'CDG',
      departureCity: 'Delhi',
      arrivalCity: 'Paris',
      departureTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6 + 1000 * 60 * 60 * 1), // 01:00 AM
      arrivalTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6 + 1000 * 60 * 60 * 10),
      duration: 540,
      stops: 0,
      price: 490,
      cabinClass: 'ECONOMY',
      baggage: '7kg Cabin + 30kg Check-in',
      seatAvailability: 28,
      featured: true,
    },
    {
      flightNumber: 'EK-501',
      airline: 'Emirates',
      airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=100&q=80',
      departureAirport: 'BOM',
      arrivalAirport: 'DXB',
      departureCity: 'Mumbai',
      arrivalCity: 'Dubai',
      departureTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 60 * 19), // 07:00 PM
      arrivalTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 60 * 22.5),
      duration: 210,
      stops: 0,
      price: 230,
      cabinClass: 'BUSINESS',
      baggage: '10kg Cabin + 40kg Check-in',
      seatAvailability: 16,
      featured: true,
    },
    {
      flightNumber: 'AF-142',
      airline: 'Air France',
      airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=100&q=80',
      departureAirport: 'JFK',
      arrivalAirport: 'CDG',
      departureCity: 'New York',
      arrivalCity: 'Paris',
      departureTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 18),
      arrivalTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8 + 1000 * 60 * 60 * 2),
      duration: 480,
      stops: 0,
      price: 540,
      cabinClass: 'ECONOMY',
      baggage: '7kg Cabin + 23kg Check-in',
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
      departureTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10 + 1000 * 60 * 60 * 11),
      arrivalTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 11 + 1000 * 60 * 60 * 1),
      duration: 690,
      stops: 0,
      price: 780,
      cabinClass: 'ECONOMY',
      baggage: '7kg Cabin + 2x23kg Check-in',
      seatAvailability: 35,
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
      departureTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 60 * 8),
      arrivalTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 60 * 10.8),
      duration: 170,
      stops: 0,
      price: 185,
      cabinClass: 'ECONOMY',
      baggage: '7kg Cabin + 30kg Check-in',
      seatAvailability: 60,
      featured: true,
    },
    {
      flightNumber: 'BA-143',
      airline: 'British Airways',
      airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=100&q=80',
      departureAirport: 'LHR',
      arrivalAirport: 'DEL',
      departureCity: 'London',
      arrivalCity: 'Delhi',
      departureTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6 + 1000 * 60 * 60 * 10),
      arrivalTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6 + 1000 * 60 * 60 * 19),
      duration: 540,
      stops: 0,
      price: 580,
      cabinClass: 'ECONOMY',
      baggage: '7kg Cabin + 23kg Check-in',
      seatAvailability: 24,
      featured: true,
    },
    {
      flightNumber: 'LH-760',
      airline: 'Lufthansa',
      airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=100&q=80',
      departureAirport: 'FRA',
      arrivalAirport: 'DEL',
      departureCity: 'Frankfurt',
      arrivalCity: 'Delhi',
      departureTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 13),
      arrivalTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 21),
      duration: 480,
      stops: 0,
      price: 620,
      cabinClass: 'ECONOMY',
      baggage: '8kg Cabin + 23kg Check-in',
      seatAvailability: 30,
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

  // Add more testimonials
  const goaHotel = await prisma.hotel.findFirst({ where: { city: 'Goa' } });
  if (goaHotel) {
    await prisma.review.create({
      data: {
        userId: demoUser.id,
        hotelId: goaHotel.id,
        rating: 4.9,
        title: 'Pure Serenity by the Arabian Sea',
        comment: 'The private lagoon villas and beach sunset walks made our holiday so peaceful. The Ayurvedic spa was truly world-class.',
        pros: 'Private beach access, incredible seafood buffet, tranquil pools.',
        cons: 'Hard to leave!',
        tripType: 'FAMILY',
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
