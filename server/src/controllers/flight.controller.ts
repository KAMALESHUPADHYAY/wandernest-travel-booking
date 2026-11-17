import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';

export const getFlights = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      from,
      to,
      departureCity,
      arrivalCity,
      departDate,
      passengers,
      cabinClass,
      stops,
      airlines,
      minPrice,
      maxPrice,
      maxDuration,
      departureTimeWindow,
      sortBy = 'cheapest',
      page = 1,
      limit = 10,
      deals,
      featured,
    } = req.query;

    const whereClause: any = {};

    if (featured === 'true' || deals === 'true') {
      whereClause.featured = true;
    }

    const fromVal = String(from || departureCity || '').trim();
    if (fromVal && fromVal !== 'all') {
      whereClause.OR = [
        { departureCity: { contains: fromVal } },
        { departureAirport: { contains: fromVal } },
      ];
    }

    const toVal = String(to || arrivalCity || '').trim();
    if (toVal && toVal !== 'all') {
      const destFilter = [
        { arrivalCity: { contains: toVal } },
        { arrivalAirport: { contains: toVal } },
      ];
      if (whereClause.OR) {
        whereClause.AND = [{ OR: whereClause.OR }, { OR: destFilter }];
        delete whereClause.OR;
      } else {
        whereClause.OR = destFilter;
      }
    }

    if (passengers) {
      const count = parseInt(String(passengers), 10);
      if (!isNaN(count) && count > 0) {
        whereClause.seatAvailability = { gte: count };
      }
    }

    if (cabinClass && String(cabinClass).toUpperCase() !== 'ALL') {
      whereClause.cabinClass = String(cabinClass).toUpperCase();
    }

    if (stops !== undefined && stops !== '' && stops !== 'all') {
      const stopList = String(stops)
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n));
      if (stopList.length > 0) {
        whereClause.stops = { in: stopList };
      }
    }

    if (airlines && String(airlines).trim()) {
      const airlineList = String(airlines)
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean);
      if (airlineList.length > 0) {
        whereClause.airline = { in: airlineList };
      }
    }

    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price.gte = parseFloat(String(minPrice));
      if (maxPrice) whereClause.price.lte = parseFloat(String(maxPrice));
    }

    if (maxDuration) {
      const dur = parseInt(String(maxDuration), 10);
      if (!isNaN(dur)) {
        whereClause.duration = { lte: dur };
      }
    }

    // Determine orderBy
    let orderBy: any = { price: 'asc' };
    if (sortBy === 'fastest') {
      orderBy = { duration: 'asc' };
    } else if (sortBy === 'earliest') {
      orderBy = { departureTime: 'asc' };
    } else if (sortBy === 'cheapest') {
      orderBy = { price: 'asc' };
    }

    const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
    const take = Math.max(1, parseInt(String(limit), 10) || 10);
    const skip = (pageNum - 1) * take;

    let [flights, total] = await Promise.all([
      prisma.flight.findMany({
        where: whereClause,
        orderBy,
        skip,
        take,
      }),
      prisma.flight.count({ where: whereClause }),
    ]);

    // If a departureTimeWindow is requested, filter in-memory if Prisma DateTime hours filtering is complex
    if (departureTimeWindow && String(departureTimeWindow) !== 'all') {
      const windowStr = String(departureTimeWindow).toLowerCase();
      flights = flights.filter((f) => {
        const hour = new Date(f.departureTime).getUTCHours();
        if (windowStr === 'early-morning') return hour >= 0 && hour < 6;
        if (windowStr === 'morning') return hour >= 6 && hour < 12;
        if (windowStr === 'afternoon') return hour >= 12 && hour < 18;
        if (windowStr === 'evening') return hour >= 18 && hour < 24;
        return true;
      });
      total = flights.length;
    }

    // Return distinct airlines and min/max prices for filter metadata
    const allAirlines = await prisma.flight.findMany({
      select: { airline: true },
      distinct: ['airline'],
    });

    res.status(200).json({
      success: true,
      data: flights,
      pagination: {
        total,
        page: pageNum,
        limit: take,
        totalPages: Math.ceil(total / take) || 1,
      },
      metadata: {
        availableAirlines: allAirlines.map((a) => a.airline),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getFlightById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const flight = await prisma.flight.findFirst({
      where: {
        OR: [{ id }, { flightNumber: id }],
      },
    });

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found',
      });
    }

    res.status(200).json({
      success: true,
      data: flight,
    });
  } catch (error) {
    next(error);
  }
};

export const getAirports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const flights = await prisma.flight.findMany({
      select: {
        departureCity: true,
        departureAirport: true,
        arrivalCity: true,
        arrivalAirport: true,
      },
    });

    const map = new Map<string, { city: string; airport: string }>();

    for (const f of flights) {
      if (!map.has(f.departureAirport)) {
        map.set(f.departureAirport, {
          city: f.departureCity,
          airport: f.departureAirport,
        });
      }
      if (!map.has(f.arrivalAirport)) {
        map.set(f.arrivalAirport, {
          city: f.arrivalCity,
          airport: f.arrivalAirport,
        });
      }
    }

    const airports = Array.from(map.values()).sort((a, b) => a.city.localeCompare(b.city));

    res.status(200).json({
      success: true,
      data: airports,
    });
  } catch (error) {
    next(error);
  }
};
