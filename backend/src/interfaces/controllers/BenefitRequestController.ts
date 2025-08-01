import { Request, Response } from 'express';
import { RequestBenefitUseCase } from '../../application/use-cases/RequestBenefitUseCase';
import { ApproveBenefitUseCase } from '../../application/use-cases/ApproveBenefitUseCase';
import { RejectBenefitUseCase } from '../../application/use-cases/RejectBenefitUseCase';
import { ListBenefitRequestsUseCase } from '../../application/use-cases/ListBenefitRequestsUseCase';
import { Container } from '../../infrastructure/di/container';
import { AuthenticatedRequest } from '../middleware/AuthMiddleware';
import { RequestStatus } from '../../domain/value-objects/RequestStatus';
import { ResponseFactory } from '../responses/ResponseFactory';

import { BenefitRequestMapper } from '../mappers/BenefitRequestMapper';
import { ApproveRejectBenefitRequestParamsSchema, CreateBenefitRequestSchema, GetBenefitRequestParamsSchema, ListBenefitRequestsQuerySchema } from '../schemas/BenefitRequestSchemas';

export class BenefitRequestController {
  private requestBenefitUseCase: RequestBenefitUseCase;
  private approveBenefitUseCase: ApproveBenefitUseCase;
  private rejectBenefitUseCase: RejectBenefitUseCase;
  private listBenefitRequestsUseCase: ListBenefitRequestsUseCase;

  constructor() {
    const container = Container.getInstance();
    const userRepository = container.getUserRepository();
    const benefitRepository = container.getBenefitRepository();
    const benefitRequestRepository = container.getBenefitRequestRepository();

    this.requestBenefitUseCase = new RequestBenefitUseCase({
      benefitRepository,
      userRepository,
      benefitRequestRepository
    });

    this.approveBenefitUseCase = new ApproveBenefitUseCase({
      userRepository,
      benefitRequestRepository
    });

    this.rejectBenefitUseCase = new RejectBenefitUseCase({
      userRepository,
      benefitRequestRepository
    });

    this.listBenefitRequestsUseCase = new ListBenefitRequestsUseCase({
      userRepository,
      benefitRequestRepository
    });
  }

  createRequest = async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthenticatedRequest;

      const validation = CreateBenefitRequestSchema.safeParse(req.body);
      if (!validation.success) {
        return ResponseFactory.validationError(res, 'Validation failed', validation.error);
      }

      const { benefitId, reason } = validation.data!;

      const result = await this.requestBenefitUseCase.execute({
        benefitId,
        userId: authReq.user.id,
        reason
      });

      const responseData = BenefitRequestMapper.toCreateResponse(result);

      return ResponseFactory.created(res, 'Benefit request created successfully', responseData);
      
    } catch (error) {
      console.error('Error creating benefit request:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('not found') || 
            error.message.includes('not available') ||
            error.message.includes('Only employees')) {
          return ResponseFactory.badRequest(res, error.message);
        }
      }

      return ResponseFactory.internalError(res, 'Failed to create benefit request');
    }
  };

  approveRequest = async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthenticatedRequest;

      const validation = ApproveRejectBenefitRequestParamsSchema.safeParse(req.params);
      if (!validation.success) {
        return ResponseFactory.validationError(res, 'Invalid parameters', validation.error);
      }

      const { id: requestId } = validation.data!;

      await this.approveBenefitUseCase.execute({ 
        requestId,
        adminId: authReq.user.id 
      });

      return ResponseFactory.success(res, 'Benefit request approved successfully');

    } catch (error) {
      console.error('Error approving benefit request:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('not found') || 
            error.message.includes('Cannot approve')) {
          return ResponseFactory.badRequest(res, error.message);
        }
      }

      return ResponseFactory.internalError(res, 'Failed to approve benefit request');
    }
  };

  rejectRequest = async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthenticatedRequest;

      const validation = ApproveRejectBenefitRequestParamsSchema.safeParse(req.params);
      if (!validation.success) {
        return ResponseFactory.validationError(res, 'Invalid parameters', validation.error);
      }

      const { id: requestId } = validation.data!;

      await this.rejectBenefitUseCase.execute({ 
        requestId,
        adminId: authReq.user.id,
        reason: 'Rejected by administrator' // Por simplicidad, se usa una razón por defecto
      });

      return ResponseFactory.success(res, 'Benefit request rejected successfully');

    } catch (error) {
      console.error('Error rejecting benefit request:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('not found') || 
            error.message.includes('Cannot reject')) {
          return ResponseFactory.badRequest(res, error.message);
        }
      }

      return ResponseFactory.internalError(res, 'Failed to reject benefit request');
    }
  };

  listRequests = async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const validation = ListBenefitRequestsQuerySchema.safeParse(req.query);

      if (!validation.success) {
        return ResponseFactory.validationError(res, 'Invalid query parameters', validation.error);
      }

      const query = validation.data!;

      const input: any = { //TODO: evitar el uso de any
        userId: authReq.user.id
      };

      if (query.status) {
        input.status = query.status.toUpperCase() as RequestStatus;
      }

      if (query.startDate) {
        input.startDate = new Date(query.startDate + 'T00:00:00');
      }

      if (query.endDate) {
        input.endDate = new Date(query.endDate + 'T23:59:59');
      }


      const result = await this.listBenefitRequestsUseCase.execute(input);

      const responseData = BenefitRequestMapper.toListItemsFromUseCase(result.requests);

      return ResponseFactory.success(res, 'Benefit requests retrieved successfully', responseData);

    } catch (error) {
      console.error('Error listing benefit requests:', error);
      return ResponseFactory.internalError(res, 'Failed to retrieve benefit requests');
    }
  };

  getRequest = async (req: Request, res: Response) => { //TODO: mejorar la logica, filtrado desde db
    try {
      const authReq = req as AuthenticatedRequest;

      const validation = GetBenefitRequestParamsSchema.safeParse(req.params);
      if (!validation.success) {
        return ResponseFactory.validationError(res, 'Invalid parameters', validation.error);
      }

      const { id: requestId } = validation.data!;

      const result = await this.listBenefitRequestsUseCase.execute({
        userId: authReq.user.id
      });

      const request = result.requests.find(req => req.id === requestId);

      if (!request) {
        return ResponseFactory.notFound(res, 'Benefit request not found');
      }

      const responseData = BenefitRequestMapper.toListItemsFromUseCase([request])[0];

      return ResponseFactory.success(res, 'Benefit request retrieved successfully', responseData);

    } catch (error) {
      console.error('Error getting benefit request:', error);
      return ResponseFactory.internalError(res, 'Failed to retrieve benefit request');
    }
  };
} 