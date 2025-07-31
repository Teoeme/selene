import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
  };
  timestamp: string;
}



export class ResponseFactory {
  private static createResponse<T>(
    success: boolean,
    message: string,
    data?: T,
    error?: { code: string; details?: any }
  ): ApiResponse<T> {
    return {
      success,
      message,
      ...(data !== undefined && { data }),
      ...(error && { error }),
      timestamp: new Date().toISOString()
    };
  }

  static success<T>(res: Response, message: string, data?: T, statusCode: number = 200): Response {
    return res.status(statusCode).json(
      this.createResponse(true, message, data)
    );
  }

  static created<T>(res: Response, message: string, data?: T): Response {
    return res.status(201).json(
      this.createResponse(true, message, data)
    );
  }

  static noContent(res: Response, message: string = 'Operation completed successfully'): Response {
    return res.status(204).json(
      this.createResponse(true, message)
    );
  }



  static badRequest(res: Response, message: string, details?: any): Response {
    return res.status(400).json(
      this.createResponse(false, message, undefined, {
        code: 'BAD_REQUEST',
        details
      })
    );
  }

  static unauthorized(res: Response, message: string = 'Authentication required'): Response {
    return res.status(401).json(
      this.createResponse(false, message, undefined, {
        code: 'UNAUTHORIZED'
      })
    );
  }

  static forbidden(res: Response, message: string = 'Insufficient permissions'): Response {
    return res.status(403).json(
      this.createResponse(false, message, undefined, {
        code: 'FORBIDDEN'
      })
    );
  }

  static notFound(res: Response, message: string = 'Resource not found'): Response {
    return res.status(404).json(
      this.createResponse(false, message, undefined, {
        code: 'NOT_FOUND'
      })
    );
  }

  static conflict(res: Response, message: string, details?: any): Response {
    return res.status(409).json(
      this.createResponse(false, message, undefined, {
        code: 'CONFLICT',
        details
      })
    );
  }

  static validationError(res: Response, message: string, details: any): Response {
    return res.status(422).json(
      this.createResponse(false, message, undefined, {
        code: 'VALIDATION_ERROR',
        details
      })
    );
  }

  static internalError(res: Response, message: string = 'Internal server error', details?: any): Response {
    return res.status(500).json(
      this.createResponse(false, message, undefined, {
        code: 'INTERNAL_ERROR',
        ...(process.env.NODE_ENV === 'development' && details && { details })
      })
    );
  }

  //errores personalizados
  static error(res: Response, statusCode: number, code: string, message: string, details?: any): Response {
    return res.status(statusCode).json(
      this.createResponse(false, message, undefined, {
        code,
        details
      })
    );
  }
} 