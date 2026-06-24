// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';

import { TenantRequest } from './tenant.middleware';
import { errorResponse } from '../utils/response.utils';
import { verifyToken } from '../utils/jwt.utils';

export interface AuthRequest extends TenantRequest {
  user?: {
    id: string;
    email: string;
    role: string;
    academyId: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'No token provided', 401);
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    // Verify tenant match
    if (req.academyId && decoded.academyId !== req.academyId) {
      return errorResponse(res, 'Invalid token for this academy', 403);
    }
    
    req.user = {
      id: decoded.userId,
      email: '', // Will be populated if needed
      role: decoded.role,
      academyId: decoded.academyId,
    };
    
    next();
  } catch (error) {
    return errorResponse(res, 'Invalid token', 401);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return errorResponse(res, 'Not authenticated', 401);
    }
    
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 'Insufficient permissions', 403);
    }
    
    next();
  };
};