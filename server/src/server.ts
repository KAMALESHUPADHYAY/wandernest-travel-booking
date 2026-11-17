import { createApp } from './app.js';
import { ENV } from './config/env.js';

const app = createApp();

const server = app.listen(ENV.PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 WanderNest Server running on port ${ENV.PORT}`);
  console.log(`📚 Swagger Docs: http://localhost:${ENV.PORT}/api/docs`);
  console.log(`🩺 Health Check: http://localhost:${ENV.PORT}/api/health`);
  console.log(`===============================================`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
