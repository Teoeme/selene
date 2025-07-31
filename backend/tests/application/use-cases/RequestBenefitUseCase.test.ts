import { describe, it, expect, beforeEach } from 'vitest';
import { RequestBenefitUseCase } from '../../../src/application/use-cases/RequestBenefitUseCase';
import { TEST_BENEFITS, TEST_USERS } from '../../domain/test-data';
import { InMemoryBenefitRepository } from '../../infrastructure/repositories/InMemoryBenefitRepository';
import { InMemoryUserRepository } from '../../infrastructure/repositories/InMemoryUserRepository';
import { InMemoryBenefitRequestRepository } from '../../infrastructure/repositories/InMemoryBenefitRequestRepository';
import { RequestStatus } from '../../../src/domain/value-objects/RequestStatus';

describe('RequestBenefitUseCase', () => {
  const benefitRepository = new InMemoryBenefitRepository();
  const userRepository = new InMemoryUserRepository();
  const benefitRequestRepository = new InMemoryBenefitRequestRepository();

  const useCase = new RequestBenefitUseCase({
    benefitRepository,
    userRepository,
    benefitRequestRepository,
  });

  beforeEach(() => {
    benefitRepository.deleteAll();
    userRepository.deleteAll();
    benefitRequestRepository.deleteAll();
  });

  it('should create a benefit request successfully', async () => {
    const input = {
      benefitId: TEST_BENEFITS.COURSE.getId(),
      userId: TEST_USERS.EMPLOYEE.getId(),
      reason: 'I need to improve my skills',
    };

    benefitRepository.givenExistingBenefits(TEST_BENEFITS.COURSE);
    userRepository.givenExistingUsers(TEST_USERS.EMPLOYEE);

    const result = await useCase.execute(input);

    expect(result.benefit).toBe(TEST_BENEFITS.COURSE);
    expect(result.employee).toBe(TEST_USERS.EMPLOYEE);
    expect(result.reason).toBe(input.reason);
    expect(result.status).toBe(RequestStatus.PENDING);
    expect(result.company).toBe(TEST_USERS.EMPLOYEE.getCompany());
    expect(result.requestDate).toBeInstanceOf(Date);

    const savedRequests = await benefitRequestRepository.find({ employeeId: TEST_USERS.EMPLOYEE.getId() });
    expect(savedRequests).toHaveLength(1);
    expect(savedRequests[0].getBenefit()).toBe(TEST_BENEFITS.COURSE);
    expect(savedRequests[0].getReason()).toBe(input.reason);
  });

  it('should throw error if benefit does not exist', async () => {
    const input = {
      benefitId: 'non-existent',
      userId: TEST_USERS.EMPLOYEE.getId(),
      reason: 'test',
    };

    userRepository.givenExistingUsers(TEST_USERS.EMPLOYEE);

    await expect(useCase.execute(input)).rejects.toThrow('Benefit not found');

    const savedRequests = await benefitRequestRepository.find({ employeeId: TEST_USERS.EMPLOYEE.getId() });
    expect(savedRequests).toHaveLength(0);
  });

  it('should throw error if benefit is not available', async () => {
    const input = {
      benefitId: TEST_BENEFITS.INACTIVE_COURSE.getId(),
      userId: TEST_USERS.EMPLOYEE.getId(),
      reason: 'test',
    };

    benefitRepository.givenExistingBenefits(TEST_BENEFITS.INACTIVE_COURSE);
    userRepository.givenExistingUsers(TEST_USERS.EMPLOYEE);

    await expect(useCase.execute(input)).rejects.toThrow('Benefit is not available');

    const savedRequests = await benefitRequestRepository.find({ employeeId: TEST_USERS.EMPLOYEE.getId() });
    expect(savedRequests).toHaveLength(0);
  });

  it('should throw error if user does not exist', async () => {
    const input = {
      benefitId: TEST_BENEFITS.COURSE.getId(),
      userId: 'non-existent',
      reason: 'test',
    };

    benefitRepository.givenExistingBenefits(TEST_BENEFITS.COURSE);

    await expect(useCase.execute(input)).rejects.toThrow('User not found');

    const savedRequests = await benefitRequestRepository.find({ employeeId: input.userId });
    expect(savedRequests).toHaveLength(0);
  });

  it('should throw error if user is not an employee', async () => { 
    const input = {
      benefitId: TEST_BENEFITS.COURSE.getId(),
      userId: TEST_USERS.ADMIN.getId(),
      reason: 'test',
    };

    benefitRepository.givenExistingBenefits(TEST_BENEFITS.COURSE);
    userRepository.givenExistingUsers(TEST_USERS.ADMIN);

    await expect(useCase.execute(input)).rejects.toThrow('Only employees can request benefits');

    const savedRequests = await benefitRequestRepository.find({ employeeId: TEST_USERS.ADMIN.getId() });
    expect(savedRequests).toHaveLength(0);
  });
});
