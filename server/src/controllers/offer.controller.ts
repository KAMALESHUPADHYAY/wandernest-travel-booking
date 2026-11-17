import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';

export const getOffers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.query;

    const whereClause: any = { active: true };
    if (category) whereClause.category = String(category);

    const offers = await prisma.offer.findMany({
      where: whereClause,
      orderBy: { discountPercent: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: offers,
    });
  } catch (error) {
    next(error);
  }
};
