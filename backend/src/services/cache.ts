import { Redis } from 'ioredis';
import { config } from '../config.js';

const redis = new Redis(config.REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 1 });
let available = false;

redis.on('ready', () => { available = true; });
redis.on('error', () => { available = false; });

export async function connectCache() {
  try { if (redis.status === 'wait') await redis.connect(); } catch { available = false; }
}

export async function cached<T>(key: string, ttlSeconds: number, loader: () => Promise<T>): Promise<T> {
  if (available) {
    const value = await redis.get(key).catch(() => null);
    if (value) return JSON.parse(value) as T;
  }
  const value = await loader();
  if (available) await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds).catch(() => undefined);
  return value;
}

export async function invalidate(pattern = 'urban-heat:*') {
  if (!available) return;
  const keys = await redis.keys(pattern).catch(() => []);
  if (keys.length) await redis.del(...keys).catch(() => undefined);
}
