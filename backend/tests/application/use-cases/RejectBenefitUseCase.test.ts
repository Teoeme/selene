import { describe, it, expect, beforeEach } from 'vitest';
import { RejectBenefitUseCase } from '../../../src/application/use-cases/RejectBenefitUseCase';
import { InMemoryUserRepository } from '../../infrastructure/repositories/InMemoryUserRepository';
import { InMemoryBenefitRequestRepository } from '../../infrastructure/repositories/InMemoryBenefitRequestRepository';
import { TEST_USERS, TEST_REQUESTS } from '../../domain/test-data';
import { RequestStatus } from '../../../src/domain/value-objects/RequestStatus';

describe('RejectBenefitUseCase', () => {
  const userRepository = new InMemoryUserRepository();
  const benefitRequestRepository = new InMemoryBenefitRequestRepository();

  const useCase = new RejectBenefitUseCase({
    userRepository,
    benefitRequestRepository,
  });

  beforeEach(() => {
    userRepository.deleteAll();
    benefitRequestRepository.deleteAll();
  });

  it('should reject a pending request with reason', async () => {
    userRepository.givenExistingUsers(TEST_USERS.ADMIN);
    benefitRequestRepository.givenExistingRequests(TEST_REQUESTS.PENDING);

    const input = {
      requestId: TEST_REQUESTS.PENDING.getId(),
      adminId: TEST_USERS.ADMIN.getId(),
      reason: 'No budget available',
    };

    await useCase.execute(input);

    const updatedRequest = await benefitRequestRepository.findById(input.requestId);
    expect(updatedRequest?.getStatus()).toBe(RequestStatus.REJECTED);
    expect(updatedRequest?.getResolutionDate()).toBeInstanceOf(Date);
  });

  it('should throw error if admin does not exist', async () => {
    benefitRequestRepository.givenExistingRequests(TEST_REQUESTS.PENDING);

    const input = {
      requestId: TEST_REQUESTS.PENDING.getId(),
      adminId: 'non-existent',
      reason: 'No budget available',
    };

    await expect(useCase.execute(input)).rejects.toThrow('Admin not found');
  });

  it('should throw error if user is not an admin', async () => {
    userRepository.givenExistingUsers(TEST_USERS.EMPLOYEE);
    benefitRequestRepository.givenExistingRequests(TEST_REQUESTS.PENDING);

    const input = {
      requestId: TEST_REQUESTS.PENDING.getId(),
      adminId: TEST_USERS.EMPLOYEE.getId(),
      reason: 'No budget available',
    };

    await expect(useCase.execute(input)).rejects.toThrow('Only admins can reject requests');
  });

  it('should throw error if request does not exist', async () => {
    userRepository.givenExistingUsers(TEST_USERS.ADMIN);

    const input = {
      requestId: 'non-existent',
      adminId: TEST_USERS.ADMIN.getId(),
      reason: 'No budget available',
    };

    await expect(useCase.execute(input)).rejects.toThrow('Benefit request not found');
  });

  it('should throw error if request is not pending', async () => {
    userRepository.givenExistingUsers(TEST_USERS.ADMIN);
    benefitRequestRepository.givenExistingRequests(TEST_REQUESTS.APPROVED);

    const input = {
      requestId: TEST_REQUESTS.APPROVED.getId(),
      adminId: TEST_USERS.ADMIN.getId(),
      reason: 'No budget available',
    };

    await expect(useCase.execute(input)).rejects.toThrow('Cannot reject a request that is not pending');
  });

  it('should throw error if no reason is provided', async () => {
    userRepository.givenExistingUsers(TEST_USERS.ADMIN);
    benefitRequestRepository.givenExistingRequests(TEST_REQUESTS.PENDING);

    const input = {
      requestId: TEST_REQUESTS.PENDING.getId(),
      adminId: TEST_USERS.ADMIN.getId(),
      reason: '',
    };

    await expect(useCase.execute(input)).rejects.toThrow('Rejection reason is required');
  });

  it('should throw error if reason is only whitespace', async () => {
    userRepository.givenExistingUsers(TEST_USERS.ADMIN);
    benefitRequestRepository.givenExistingRequests(TEST_REQUESTS.PENDING);

    const input = {
      requestId: TEST_REQUESTS.PENDING.getId(),
      adminId: TEST_USERS.ADMIN.getId(),
      reason: '   ',
    };


    await expect(useCase.execute(input)).rejects.toThrow('Rejection reason is required');
  });
});
