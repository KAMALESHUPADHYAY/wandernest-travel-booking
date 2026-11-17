import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { AppError } from '../middlewares/error.middleware.js';

export const toggleWishlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Unauthorized', 401);

    const { hotelId, destinationId } = req.body;
    if (!hotelId && !destinationId) {
      throw new AppError('Either hotelId or destinationId must be provided', 400);
    }

    if (hotelId) {
      const existing = await prisma.wishlist.findUnique({
        where: {
          userId_hotelId: { userId, hotelId },
        },
      });

      if (existing) {
        await prisma.wishlist.delete({ where: { id: existing.id } });
        return res.status(200).json({
          success: true,
          action: 'removed',
          message: 'Removed from saved properties',
        });
      } else {
        const item = await prisma.wishlist.create({
          data: { userId, hotelId },
        });
        return res.status(201).json({
          success: true,
          action: 'added',
          message: 'Saved to your wishlist!',
          data: item,
        });
      }
    }

    if (destinationId) {
      const existing = await prisma.wishlist.findUnique({
        where: {
          userId_destinationId: { userId, destinationId },
        },
      });

      if (existing) {
        await prisma.wishlist.delete({ where: { id: existing.id } });
        return res.status(200).json({
          success: true,
          action: 'removed',
          message: 'Destination removed from wishlist',
        });
      } else {
        const item = await prisma.wishlist.create({
          data: { userId, destinationId },
        });
        return res.status(201).json({
          success: true,
          action: 'added',
          message: 'Destination saved to wishlist!',
          data: item,
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

export const getWishlist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Unauthorized', 401);

    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        hotel: {
          include: {
            destination: true,
          },
        },
        destination: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
};
