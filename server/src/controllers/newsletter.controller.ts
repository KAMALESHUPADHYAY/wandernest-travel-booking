import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { z } from 'zod';

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const subscribeNewsletter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parse = newsletterSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        success: false,
        message: parse.error.errors[0]?.message || 'Invalid email address',
      });
    }

    const { email } = parse.data;

    const existing = await prisma.newsletter.findUnique({ where: { email } });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: "You're already subscribed to our exclusive deals!",
        data: existing,
      });
    }

    const created = await prisma.newsletter.create({
      data: { email },
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for subscribing! Your secret promo code is WANDER25.',
      data: created,
    });
  } catch (error) {
    next(error);
  }
};
