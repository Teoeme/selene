import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { UserRole } from '../../domain/value-objects/UserRole';
import { Container } from '../../infrastructure/di/container';
import { ResponseFactory } from '../responses/ResponseFactory';
import { JwtService } from '../../domain/services/JwtService';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    companyId: string;
  };
}

export class AuthMiddleware {
  private userRepository: UserRepository;
  private jwtService: JwtService;

  constructor() {
    this.userRepository = Container.getInstance().getUserRepository();
    this.jwtService = Container.getInstance().getJwtService();
  }

  authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token= req.headers.authorization?.replace('Bearer ', '');
      console.log('token', token);
      if(!token) {
        return ResponseFactory.unauthorized(res, 'Authentication required.');
      }
      const decodedToken = await this.jwtService.verifyToken(token);
      const user = await this.userRepository.findById(decodedToken.userId);

      if (!user) {
        return ResponseFactory.unauthorized(res, 'Invalid user credentials');
      }

      // Agregar información del usuario al request
      (req as AuthenticatedRequest).user = {
        id: user.getId(),
        email: user.getEmail(),
        name: user.getName(),
        role: user.getRole(), //revalida el rol
        companyId: user.getCompany().getId() //valida la empresa a la que pertenece el usuario
      };

      next();
    } catch (error) {
      console.error('Authentication error:', error);
      
      if (error instanceof Error) {
        // Error específico de JWT inválido
        if (error.message.includes('jwt') || error.message.includes('token')) {
          return ResponseFactory.unauthorized(res, 'Invalid or expired token');
        }
      }
      
      return ResponseFactory.internalError(res, 'Authentication failed');
    }
  };

  // Middleware para verificar que el usuario sea admin
  requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthenticatedRequest;
    
          if (!authReq.user) {
        ResponseFactory.unauthorized(res, 'User not authenticated');
        return;
      }

      if (authReq.user.role !== UserRole.ADMIN) {
        ResponseFactory.forbidden(res, 'Admin role required');
        return;
      }

    next();
  };

  // Middleware para verificar que el usuario sea empleado
  requireEmployee = async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthenticatedRequest;
    
          if (!authReq.user) {
        ResponseFactory.unauthorized(res, 'User not authenticated');
        return;
      }

      if (authReq.user.role !== UserRole.EMPLOYEE) {
        ResponseFactory.forbidden(res, 'Employee role required');
        return;
      }

    next();
  };
} 