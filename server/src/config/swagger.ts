import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WanderNest REST API',
      version: '1.0.0',
      description: 'Production-ready Travel & Trip Booking API inspired by Booking.com',
      contact: {
        name: 'WanderNest Engineering Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format **Bearer &lt;token&gt;**',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message description' },
            errors: { type: 'array', items: { type: 'object' } },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-1234' },
            email: { type: 'string', example: 'traveler@wandernest.com' },
            name: { type: 'string', example: 'Jane Doe' },
            role: { type: 'string', example: 'USER' },
            avatar: { type: 'string', example: 'https://images.unsplash.com/...' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
