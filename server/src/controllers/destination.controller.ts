import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';

export const getDestinations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { popular, featured, country, search, region, category } = req.query;

    const whereClause: any = {};
    if (popular === 'true') whereClause.popular = true;
    if (featured === 'true') whereClause.featured = true;
    if (country) whereClause.country = String(country);
    
    if (category && String(category).toLowerCase() !== 'all') {
      whereClause.category = { equals: String(category) };
    }

    if (region === 'india') {
      whereClause.country = 'India';
    } else if (region === 'international') {
      whereClause.country = { not: 'India' };
    }

    if (search && String(search).trim()) {
      const q = String(search).trim();
      const searchConditions = [
        { name: { contains: q } },
        { city: { contains: q } },
        { country: { contains: q } },
      ];
      if (whereClause.OR) {
        whereClause.AND = [{ OR: whereClause.OR }, { OR: searchConditions }];
        delete whereClause.OR;
      } else {
        whereClause.OR = searchConditions;
      }
    }

    const destinations = await prisma.destination.findMany({
      where: whereClause,
      include: {
        hotels: {
          select: {
            id: true,
            pricePerNight: true,
          },
        },
        _count: {
          select: {
            hotels: true,
          },
        },
      },
      orderBy: [{ popular: 'desc' }, { name: 'asc' }],
    });

    // Compute lowest starting price for each destination
    const formatted = destinations.map((d) => {
      const prices = d.hotels.map((h) => h.pricePerNight).filter(Boolean);
      const startingPrice = prices.length > 0 ? Math.min(...prices) : 120;
      const { hotels, ...rest } = d;
      return {
        ...rest,
        hotelCount: d._count.hotels,
        startingPrice,
      };
    });

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};

export const getDestinationBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;

    const destination = await prisma.destination.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
      include: {
        hotels: {
          take: 6,
          include: {
            rooms: {
              take: 1,
              select: { pricePerNight: true, name: true },
            },
          },
        },
      },
    });

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found',
      });
    }

    // Parse attractions and gallery JSON safely
    let attractions = [];
    if (destination.attractions) {
      try {
        attractions = JSON.parse(destination.attractions);
      } catch (e) {
        attractions = [];
      }
    }

    let gallery = [];
    if (destination.gallery) {
      try {
        gallery = JSON.parse(destination.gallery);
      } catch (e) {
        gallery = [];
      }
    }

    // If gallery is empty, fall back to main image and related hotel images
    if (!gallery || gallery.length === 0) {
      gallery = [destination.image];
      for (const h of destination.hotels) {
        try {
          const imgs = JSON.parse(h.images);
          if (Array.isArray(imgs)) gallery.push(...imgs);
        } catch (e) {}
      }
    }

    // Fetch popular flights to this destination city
    const flights = await prisma.flight.findMany({
      where: {
        OR: [
          { arrivalCity: { contains: destination.city } },
          { arrivalCity: { contains: destination.name } },
        ],
      },
      take: 4,
      orderBy: { price: 'asc' },
    });

    // Compute starting price
    const hotelPrices = destination.hotels.map((h) => h.pricePerNight).filter(Boolean);
    const startingPrice = hotelPrices.length > 0 ? Math.min(...hotelPrices) : 120;

    res.status(200).json({
      success: true,
      data: {
        ...destination,
        attractions,
        gallery: Array.from(new Set(gallery)),
        startingPrice,
        nearbyHotels: destination.hotels,
        popularFlights: flights,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const autocompleteDestinations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = String(req.query.q || '').trim();
    if (!q) {
      const popular = await prisma.destination.findMany({
        take: 6,
        orderBy: { popular: 'desc' },
        select: { id: true, name: true, city: true, country: true, image: true, slug: true },
      });
      return res.status(200).json({ success: true, data: popular });
    }

    const destinations = await prisma.destination.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { city: { contains: q } },
          { country: { contains: q } },
        ],
      },
      take: 8,
      select: { id: true, name: true, city: true, country: true, image: true, slug: true },
    });

    res.status(200).json({
      success: true,
      data: destinations,
    });
  } catch (error) {
    next(error);
  }
};
