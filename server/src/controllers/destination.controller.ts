import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';

export const getDestinations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { popular, featured, country, search, region } = req.query;

    const whereClause: any = {};
    if (popular === 'true') whereClause.popular = true;
    if (featured === 'true') whereClause.featured = true;
    if (country) whereClause.country = String(country);
    if (region === 'india') {
      whereClause.country = 'India';
    } else if (region === 'international') {
      whereClause.country = { not: 'India' };
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: String(search) } },
        { city: { contains: String(search) } },
        { country: { contains: String(search) } },
      ];
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

export const autocompleteDestinations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = String(req.query.q || '').trim();
    if (!q) {
      const popular = await prisma.destination.findMany({
        take: 6,
        orderBy: { popular: 'desc' },
        select: { id: true, name: true, city: true, country: true, image: true },
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
      select: { id: true, name: true, city: true, country: true, image: true },
    });

    res.status(200).json({
      success: true,
      data: destinations,
    });
  } catch (error) {
    next(error);
  }
};
