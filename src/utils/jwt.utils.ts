// src/utils/jwt.utils.ts
import jwt from 'jsonwebtoken';
import { env } from '../config/env.config';

export const generateTokens = (payload: { userId: string; academyId: string; role: string }) => {
  const accessToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
  
  const refreshToken = jwt.sign(
    { userId: payload.userId, type: 'refresh' }, 
    env.JWT_SECRET, 
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN }
  );
  
  return { accessToken, refreshToken };
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET) as {
    userId: string;
    academyId: string;
    role: string;
  };
};