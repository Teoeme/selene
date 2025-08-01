import { Benefit } from "@/domain/entities/Benefit";
import { BenefitRepository } from "@/domain/repositories/BenefitRepository";

export class ListBenefitsUseCase {
    private benefitRepository: BenefitRepository;

    constructor(dependencies:{
        benefitRepository: BenefitRepository
    }){
        this.benefitRepository = dependencies.benefitRepository;
    }

    async execute(companyId: string): Promise<Benefit[]> {
        if(!companyId){
            throw new Error('Company ID is required');
        }
       
        
        const benefits = await this.benefitRepository.findByCompany(companyId);
        return benefits;
    }
}