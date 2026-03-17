import dotenv from 'dotenv';

// Solo carga .env si existe (en local)
dotenv.config();

export const ENV = {
  PORT: Number(process.env.PORT) || 3000,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  OPEN_ROUTER_MODEL: process.env.OPEN_ROUTER_MODEL,
  OPEN_ROUTER_KEY: process.env.OPEN_ROUTER_KEY,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URL: process.env.MONGODB_URL
};