// src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response.utils';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);
  
  if (err instanceof AppError) {
    return errorResponse(res, err.message, err.statusCode);
  }
  
  // Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    if (prismaError.code === 'P2002') {
      return errorResponse(res, 'Unique constraint violation', 409);
    }
    if (prismaError.code === 'P2025') {
      return errorResponse(res, 'Record not found', 404);
    }
  }
  
  return errorResponse(
    res,
    process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    500
  );
};