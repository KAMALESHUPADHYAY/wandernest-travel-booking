import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import { errorHandler } from './middlewares/error.middleware.js';

import authRoutes from './routes/auth.routes.js';
import destinationRoutes from './routes/destination.routes.js';
import hotelRoutes from './routes/hotel.routes.js';
import flightRoutes from './routes/flight.routes.js';
import offerRoutes from './routes/offer.routes.js';
import reviewRoutes from './routes/review.routes.js';
import newsletterRoutes from './routes/newsletter.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import bookingRoutes from './routes/booking.routes.js';

export const createApp = (): Application => {
  const app = express();

  // Global Middlewares
  app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));

  // API Documentation (Swagger)
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'WanderNest API Documentation',
    customCss: '.swagger-ui .topbar { background-color: #003B95; }',
  }));

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'WanderNest Backend REST API',
      version: '1.0.0',
    });
  });

  // Mount API Routers
  app.use('/api/auth', authRoutes);
  app.use('/api/destinations', destinationRoutes);
  app.use('/api/hotels', hotelRoutes);
  app.use('/api/flights', flightRoutes);
  app.use('/api/offers', offerRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/newsletter', newsletterRoutes);
  app.use('/api/wishlist', wishlistRoutes);
  app.use('/api/bookings', bookingRoutes);

  // Fallback 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: 'Endpoint not found',
    });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
