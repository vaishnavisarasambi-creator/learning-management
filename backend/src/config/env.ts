import dotenv from 'dotenv';

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  
  DATABASE_URL: process.env.DATABASE_URL || '',
  
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'access-secret',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || '15m',
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '30d',
  
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || 'localhost',
};
