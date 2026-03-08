import app from './app';
import { env } from './config/env';
import { prisma } from './config/db';

const PORT = env.PORT;

// Test database connection before starting server
prisma.$connect()
  .then(() => {
    console.log('Database connected successfully');
    
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${env.NODE_ENV}`);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        prisma.$disconnect();
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully');
      server.close(() => {
        prisma.$disconnect();
        process.exit(0);
      });
    });
  })
  .catch((error: Error) => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  });
