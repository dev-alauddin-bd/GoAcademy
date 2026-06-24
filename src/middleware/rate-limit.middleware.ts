// src/middleware/rate-limit.middleware.ts
import rateLimit from 'express-rate-limit';

export const createRateLimit = (windowMs: number, max: number) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      const academyId = (req as any).academyId || 'global';
      const userId = (req as any).user?.id || req.ip;
      return `${academyId}:${userId}`;
    },
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later',
      });
    },
  });
};

export const authRateLimit = createRateLimit(15 * 60 * 1000, 5); // 5 per 15 min
export const apiRateLimit = createRateLimit(60 * 1000, 100); // 100 per minute