// src/config/redis.config.ts
import Redis from 'ioredis';
import { env } from './env.config';

export const redis = new Redis(env.REDIS_URL);

export const redisPub = new Redis(env.REDIS_URL);
export const redisSub = new Redis(env.REDIS_URL);