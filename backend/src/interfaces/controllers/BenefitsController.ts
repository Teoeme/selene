import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/AuthMiddleware";
import { ResponseFactory } from "../responses/ResponseFactory";
import { Container } from "../../infrastructure/di/container";
import { ListBenefitsUseCase } from "../../application/use-cases/ListBenefitsUseCase";

export class BenefitsController {

     private listBenefitsUseCase: ListBenefitsUseCase;
    
    
    constructor(){ 
        const container= Container.getInstance();
        const benefitRepository = container.getBenefitRepository();

        this.listBenefitsUseCase = new ListBenefitsUseCase({
            benefitRepository
        });
    }

     listBenefits= async (req: Request, res: Response) => {
        const authReq = req as AuthenticatedRequest;
        const benefits = await this.listBenefitsUseCase.execute(authReq.user.companyId);
        return ResponseFactory.success(res, 'Benefits fetched successfully', benefits);
    }


}