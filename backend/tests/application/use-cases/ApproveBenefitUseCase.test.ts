import { describe, it, expect, beforeEach } from 'vitest';
import { ApproveBenefitUseCase } from '../../../src/application/use-cases/ApproveBenefitUseCase';
import { InMemoryUserRepository } from '../../infrastructure/repositories/InMemoryUserRepository';
import { InMemoryBenefitRequestRepository } from '../../infrastructure/repositories/InMemoryBenefitRequestRepository';
import { TEST_USERS, TEST_REQUESTS } from '../../domain/test-data';
import { RequestStatus } from '../../../src/domain/value-objects/RequestStatus';

describe('ApproveBenefitUseCase', () => {
  const userRepository = new InMemoryUserRepository();
  const benefitRequestRepository = new InMemoryBenefitRequestRepository();

  const useCase = new ApproveBenefitUseCase({
    userRepository,
    benefitRequestRepository,
  });

  beforeEach(() => {
    userRepository.deleteAll();
    benefitRequestRepository.deleteAll();
  });

  it('should approve a pending request', async () => {
    userRepository.givenExistingUsers(TEST_USERS.ADMIN);
    benefitRequestRepository.givenExistingRequests(TEST_REQUESTS.PENDING);

    const input = {
      requestId: TEST_REQUESTS.PENDING.getId(),
      adminId: TEST_USERS.ADMIN.getId(),
    };

    await useCase.execute(input);

    const updatedRequest = await benefitRequestRepository.findById(input.requestId);
    expect(updatedRequest?.getStatus()).toBe(RequestStatus.APPROVED);
    expect(updatedRequest?.getResolutionDate()).toBeInstanceOf(Date);
  });

  it('should throw error if admin does not exist', async () => {
    benefitRequestRepository.givenExistingRequests(TEST_REQUESTS.PENDING);

    const input = {
      requestId: TEST_REQUESTS.PENDING.getId(),
      adminId: 'non-existent',
    };

    await expect(useCase.execute(input)).rejects.toThrow('Admin not found');
  });

  it('should throw error if user is not an admin', async () => {
    userRepository.givenExistingUsers(TEST_USERS.EMPLOYEE);
    benefitRequestRepository.givenExistingRequests(TEST_REQUESTS.PENDING);

    const input = {
      requestId: TEST_REQUESTS.PENDING.getId(),
      adminId: TEST_USERS.EMPLOYEE.getId(),
    };

    await expect(useCase.execute(input)).rejects.toThrow('Only admins can approve requests');
  });

  it('should throw error if request does not exist', async () => {
    userRepository.givenExistingUsers(TEST_USERS.ADMIN);

    const input = {
      requestId: 'non-existent',
      adminId: TEST_USERS.ADMIN.getId(),
    };

    await expect(useCase.execute(input)).rejects.toThrow('Benefit request not found');
  });

  it('should throw error if request is not pending', async () => {
    userRepository.givenExistingUsers(TEST_USERS.ADMIN);
    benefitRequestRepository.givenExistingRequests(TEST_REQUESTS.APPROVED);

    const input = {
      requestId: TEST_REQUESTS.APPROVED.getId(),
      adminId: TEST_USERS.ADMIN.getId(),
    };

    await expect(useCase.execute(input)).rejects.toThrow('Cannot approve a request that is not pending');
  });

  it('should throw error if benefit is not available', async () => {
    userRepository.givenExistingUsers(TEST_USERS.ADMIN);
    benefitRequestRepository.givenExistingRequests(TEST_REQUESTS.PENDING);

    benefitRequestRepository.givenExistingRequests(TEST_REQUESTS.PENDING_FOR_INACTIVE);

    const input = {
      requestId: TEST_REQUESTS.PENDING_FOR_INACTIVE.getId(),
      adminId: TEST_USERS.ADMIN.getId(),
    };


    await expect(useCase.execute(input)).rejects.toThrow('Cannot approve a request for an inactive benefit');
  });
});
