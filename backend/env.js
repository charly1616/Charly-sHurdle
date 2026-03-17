import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

export const ENV = {
  PORT: Number(process.env.PORT) || 3000,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  OPEN_ROUTER_MODEL: process.env.OPEN_ROUTER_MODEL,
  OPEN_ROUTER_KEY: process.env.OPEN_ROUTER_KEY,
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URL: process.env.MONGODB_URL,
  CLIENT_URL: process.env.CLIENT_URL
};
