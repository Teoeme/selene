import { Request, Response, NextFunction } from 'express';
import { ResponseFactory } from '../responses/ResponseFactory';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: string;
  details?: any;
}

export class ErrorMiddleware {
  static handle = (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Error:', err);

    // Error de validación Zod
    if (err.name === 'ZodError') {
      return ResponseFactory.validationError(res, 'Validation failed', err.details || err.message);
    }

    // Error con código de estado personalizado
    if (err.statusCode) {
      const code = err.code || (err.statusCode < 500 ? 'CLIENT_ERROR' : 'SERVER_ERROR');
      return ResponseFactory.error(res, err.statusCode, code, err.message, err.details);
    }

    // Error interno del servidor
    return ResponseFactory.internalError(res, 'Something went wrong', 
      process.env.NODE_ENV === 'development' ? err.stack : undefined
    );
  };

  static notFound = (_req: Request, res: Response) => {
    ResponseFactory.notFound(res, 'The requested endpoint was not found');
  };
} 