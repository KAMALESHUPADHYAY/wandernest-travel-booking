import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';

export const getFlights = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { deals, featured, departureCity, arrivalCity, limit } = req.query;

    const whereClause: any = {};
    if (featured === 'true' || deals === 'true') whereClause.featured = true;
    if (departureCity) whereClause.departureCity = { contains: String(departureCity) };
    if (arrivalCity) whereClause.arrivalCity = { contains: String(arrivalCity) };

    const take = limit ? parseInt(String(limit), 10) : 6;

    const flights = await prisma.flight.findMany({
      where: whereClause,
      take,
      orderBy: { price: 'asc' },
    });

    res.status(200).json({
      success: true,
      data: flights,
    });
  } catch (error) {
    next(error);
  }
};
