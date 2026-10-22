import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1).default('postgresql://urbanheat:urbanheat@localhost:5432/urbanheat'),
  REDIS_URL: z.string().min(1).default('redis://localhost:6379'),
  CORS_ORIGIN: z.string().default('http://localhost:5173')
});

export const config = envSchema.parse(process.env);
