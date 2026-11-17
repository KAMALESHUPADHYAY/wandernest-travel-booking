import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';

export const getHotels = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      city,
      destinationId,
      minPrice,
      maxPrice,
      starRating,
      minRating,
      amenities,
      propertyType,
      freeCancellation,
      featured,
      sortBy,
      page = '1',
      limit = '8',
    } = req.query;

    const whereClause: any = {};

    // 1. Destination / City / Search keyword
    if (city) {
      const searchStr = String(city).trim();
      whereClause.OR = [
        { city: { contains: searchStr } },
        { country: { contains: searchStr } },
        { name: { contains: searchStr } },
        { address: { contains: searchStr } },
        {
          destination: {
            OR: [
              { name: { contains: searchStr } },
              { city: { contains: searchStr } },
              { slug: { contains: searchStr } },
            ],
          },
        },
      ];
    }

    if (destinationId) {
      whereClause.destinationId = String(destinationId);
    }

    if (featured === 'true') {
      whereClause.featured = true;
    }

    // 2. Price filtering
    if (minPrice || maxPrice) {
      whereClause.pricePerNight = {};
      if (minPrice) whereClause.pricePerNight.gte = parseFloat(String(minPrice));
      if (maxPrice) whereClause.pricePerNight.lte = parseFloat(String(maxPrice));
    }

    // 3. Star rating filtering (supports multiple comma-separated e.g. "3,4,5" or single)
    if (starRating) {
      const stars = String(starRating)
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n));
      if (stars.length === 1) {
        whereClause.starRating = stars[0];
      } else if (stars.length > 1) {
        whereClause.starRating = { in: stars };
      }
    }

    // 4. Guest Review rating (e.g. 4.0+, 4.5+, 4.8+)
    if (minRating) {
      whereClause.rating = { gte: parseFloat(String(minRating)) };
    }

    // 5. Free Cancellation policy filter
    if (freeCancellation === 'true') {
      whereClause.policies = { contains: 'Free cancellation' };
    }

    // 6. Amenities filtering (must match substring in amenities JSON)
    if (amenities) {
      const amenityList = String(amenities).split(',').map((a) => a.trim());
      whereClause.AND = amenityList.map((a) => ({
        amenities: { contains: a },
      }));
    }

    // Sorting
    let orderBy: any = [{ rating: 'desc' }, { reviewCount: 'desc' }];
    if (sortBy === 'price_asc') orderBy = { pricePerNight: 'asc' };
    if (sortBy === 'price_desc') orderBy = { pricePerNight: 'desc' };
    if (sortBy === 'rating_desc') orderBy = { rating: 'desc' };
    if (sortBy === 'popularity') orderBy = { reviewCount: 'desc' };
    if (sortBy === 'stars_desc') orderBy = { starRating: 'desc' };

    // Pagination
    const pageNum = Math.max(1, parseInt(String(page), 10));
    const pageSize = Math.max(1, parseInt(String(limit), 10));
    const skip = (pageNum - 1) * pageSize;

    const [totalCount, hotels] = await Promise.all([
      prisma.hotel.count({ where: whereClause }),
      prisma.hotel.findMany({
        where: whereClause,
        skip,
        take: pageSize,
        orderBy,
        include: {
          destination: {
            select: { id: true, name: true, city: true, country: true, slug: true },
          },
          rooms: {
            select: {
              id: true,
              name: true,
              type: true,
              capacity: true,
              pricePerNight: true,
              originalPrice: true,
              bedType: true,
            },
            take: 3,
          },
          _count: {
            select: { reviews: true, rooms: true },
          },
        },
      }),
    ]);

    const parsedHotels = hotels.map((h) => ({
      ...h,
      images: JSON.parse(h.images || '[]'),
      amenities: JSON.parse(h.amenities || '[]'),
    }));

    res.status(200).json({
      success: true,
      data: parsedHotels,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getHotelById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const hotel = await prisma.hotel.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        destination: true,
        rooms: {
          orderBy: { pricePerNight: 'asc' },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
        _count: {
          select: { reviews: true, rooms: true },
        },
      },
    });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel property not found',
      });
    }

    const parsed = {
      ...hotel,
      images: JSON.parse(hotel.images || '[]'),
      amenities: JSON.parse(hotel.amenities || '[]'),
      rooms: hotel.rooms.map((r) => ({
        ...r,
        amenities: JSON.parse(r.amenities || '[]'),
        images: JSON.parse(r.images || '[]'),
      })),
    };

    res.status(200).json({
      success: true,
      data: parsed,
    });
  } catch (error) {
    next(error);
  }
};

export const getPropertyTypes = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const totalHotels = await prisma.hotel.count();
    const data = [
      {
        id: 'hotels',
        name: 'Hotels',
        count: totalHotels * 12 + 140,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
        description: 'Iconic city stays & boutique accommodations',
      },
      {
        id: 'villas',
        name: 'Luxury Villas',
        count: totalHotels * 8 + 84,
        image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80',
        description: 'Private infinity pools & secluded retreats',
      },
      {
        id: 'resorts',
        name: 'Beach & Spa Resorts',
        count: totalHotels * 6 + 62,
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
        description: 'All-inclusive seaside & mountain escapes',
      },
      {
        id: 'apartments',
        name: 'Serviced Apartments',
        count: totalHotels * 15 + 210,
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
        description: 'Home comfort with full kitchens in top hubs',
      },
      {
        id: 'chalets',
        name: 'Alpine Chalets & Cabins',
        count: totalHotels * 4 + 45,
        image: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=600&q=80',
        description: 'Cozy timber wood fireplaces & mountain views',
      },
      {
        id: 'glamping',
        name: 'Glamping & Domes',
        count: totalHotels * 3 + 28,
        image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80',
        description: 'Star-gazing luxury tents in wilderness',
      },
    ];

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
