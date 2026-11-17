import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';

export const getReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit } = req.query;
    const take = limit ? parseInt(String(limit), 10) : 6;

    const reviews = await prisma.review.findMany({
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, avatar: true },
        },
        hotel: {
          select: { name: true, city: true, country: true },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};
