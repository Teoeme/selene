import { BenefitRequestRepository } from '../../domain/repositories/BenefitRequestRepository';
import { UserRepository } from '../../domain/repositories/UserRepository';

interface ApproveBenefitUseCaseDependencies {
  userRepository: UserRepository;
  benefitRequestRepository: BenefitRequestRepository;
}

interface ApproveBenefitUseCaseInput {
  requestId: string;
  adminId: string;
}

export class ApproveBenefitUseCase {
  private readonly userRepository: UserRepository;
  private readonly benefitRequestRepository: BenefitRequestRepository;

  constructor(dependencies: ApproveBenefitUseCaseDependencies) {
    this.userRepository = dependencies.userRepository;
    this.benefitRequestRepository = dependencies.benefitRequestRepository;
  }

  async execute(input: ApproveBenefitUseCaseInput): Promise<void> {
    const admin = await this.userRepository.findById(input.adminId);
    if (!admin) {
      throw new Error('Admin not found');
    }
    if (!admin.isAdmin()) {
      throw new Error('Only admins can approve requests');
    }

    const request = await this.benefitRequestRepository.findById(input.requestId);
    if (!request) {
      throw new Error('Benefit request not found');
    }

    request.approve();

    await this.benefitRequestRepository.save(request);
  }
}
