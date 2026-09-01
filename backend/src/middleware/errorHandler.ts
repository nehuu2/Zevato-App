import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export class AppError extends Error {
  statusCode: number;
  errors?: Record<string, string>;

  constructor(message: string, statusCode = 500, errors?: Record<string, string>) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'test' && statusCode >= 500) {
    console.error('[SERVER ERROR]:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: err.name || 'Error',
    errors: err.errors,
  });
};
