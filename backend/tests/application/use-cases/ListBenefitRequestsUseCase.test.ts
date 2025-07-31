import { describe, it, expect, beforeEach } from 'vitest';
import { ListBenefitRequestsUseCase } from '../../../src/application/use-cases/ListBenefitRequestsUseCase';
import { InMemoryUserRepository } from '../../infrastructure/repositories/InMemoryUserRepository';
import { InMemoryBenefitRequestRepository } from '../../infrastructure/repositories/InMemoryBenefitRequestRepository';
import { TEST_USERS, TEST_REQUESTS, TEST_COMPANIES } from '../../domain/test-data';
import { RequestStatus } from '../../../src/domain/value-objects/RequestStatus';
import { User } from '../../../src/domain/entities/User';
import { UserRole } from '../../../src/domain/value-objects/UserRole';
import { BenefitRequest } from '../../../src/domain/entities/BenefitRequest';
import { TEST_DATES } from '../../domain/test-data';
import { TEST_BENEFITS } from '../../domain/test-data';

describe('ListBenefitRequestsUseCase', () => {
  const userRepository = new InMemoryUserRepository();
  const benefitRequestRepository = new InMemoryBenefitRequestRepository();

  const useCase = new ListBenefitRequestsUseCase({
    userRepository,
    benefitRequestRepository,
  });

  beforeEach(() => {
    userRepository.deleteAll();
    benefitRequestRepository.deleteAll();
  });

  describe('when user is an employee', () => {
    beforeEach(() => {
      userRepository.givenExistingUsers(TEST_USERS.EMPLOYEE);
      benefitRequestRepository.givenExistingRequests(
        TEST_REQUESTS.PENDING,
        TEST_REQUESTS.APPROVED,
        TEST_REQUESTS.REJECTED,
        TEST_REQUESTS.PENDING_ANOTHER_COMPANY
      );
    });

    it('should return only their own requests', async () => {
       
      const input = { userId: TEST_USERS.EMPLOYEE.getId() };

      
      const result = await useCase.execute(input);

      
      expect(result.requests).toHaveLength(3);
      result.requests.forEach(request => {
        expect(request.employeeName).toBe(TEST_USERS.EMPLOYEE.getName());
      });
    });

    it('should filter by status when specified', async () => {
       
      const input = {
        userId: TEST_USERS.EMPLOYEE.getId(),
        status: RequestStatus.PENDING,
      };

      
      const result = await useCase.execute(input);

      
      expect(result.requests).toHaveLength(1);
      expect(result.requests[0].status).toBe(RequestStatus.PENDING);
    });

    it('should not see requests from other employees', async () => {
       
      const otherEmployee = new User(
        'other-employee-id',
        'other@company.com',
        'Other Employee',
        'admin123',
        UserRole.EMPLOYEE,
        TEST_COMPANIES.COMPANY,
        TEST_DATES.CREATED,
        TEST_DATES.UPDATED
      );

      const otherEmployeeRequest = new BenefitRequest(
        'other-request-id',
        TEST_BENEFITS.COURSE,
        'test reason',
        RequestStatus.PENDING,
        TEST_DATES.REQUEST,
        null,
        otherEmployee,
        TEST_COMPANIES.COMPANY,
        TEST_DATES.CREATED,
        TEST_DATES.UPDATED
      );

      benefitRequestRepository.givenExistingRequests(otherEmployeeRequest);
      const input = { userId: TEST_USERS.EMPLOYEE.getId() };

      
      const result = await useCase.execute(input);

      
      expect(result.requests.some(r => r.employeeName !== TEST_USERS.EMPLOYEE.getName())).toBe(false);
    });
  });

  describe('when user is an admin', () => {
    beforeEach(() => {
      userRepository.givenExistingUsers(TEST_USERS.ADMIN);
      benefitRequestRepository.givenExistingRequests(
        TEST_REQUESTS.PENDING,
        TEST_REQUESTS.APPROVED,
        TEST_REQUESTS.REJECTED,
        TEST_REQUESTS.PENDING_ANOTHER_COMPANY
      );
    });

    it('should return all requests from the company of the user', async () => {
       
      const input = { userId: TEST_USERS.ADMIN.getId() };

      
      const result = await useCase.execute(input);

      
      expect(result.requests).toHaveLength(3);
      result.requests.forEach(request => {
        expect(request.id).toBeDefined();
        expect(request.benefitName).toBeDefined();
        expect(request.employeeName).toBeDefined();
        expect(request.reason).toBeDefined();
        expect(request.status).toBeDefined();
        expect(request.requestDate).toBeInstanceOf(Date);
      });
    });

    it('should filter by status when specified', async () => {
       
      const input = {
        userId: TEST_USERS.ADMIN.getId(),
        status: RequestStatus.APPROVED,
      };

      
      const result = await useCase.execute(input);

      
      expect(result.requests).toHaveLength(1);
      expect(result.requests[0].status).toBe(RequestStatus.APPROVED);
    });


    it('should filter by startDate when specified', async () => {
      const input = {
        userId: TEST_USERS.ADMIN.getId(),
        startDate: TEST_DATES.REQUEST,
      };

      const requests=[
        new BenefitRequest(
          'past-request',
          TEST_BENEFITS.COURSE,
          'test reason',
          RequestStatus.PENDING,
          new Date(TEST_DATES.REQUEST.getTime() - 1000),
          null,
          TEST_USERS.EMPLOYEE,
          TEST_COMPANIES.COMPANY,
          TEST_DATES.CREATED,
          TEST_DATES.UPDATED
        ),
        new BenefitRequest(
          'future-request',
          TEST_BENEFITS.COURSE,
          'test reason',
          RequestStatus.PENDING,
          TEST_DATES.REQUEST,
          null,
          TEST_USERS.EMPLOYEE,
          TEST_COMPANIES.COMPANY,
          TEST_DATES.CREATED,
          TEST_DATES.UPDATED
        ),
      ]

      benefitRequestRepository.givenExistingRequests(...requests);

      const result = await useCase.execute(input);
  
      expect(result.requests).toHaveLength(1);
      expect(result.requests[0].requestDate).toBe(TEST_DATES.REQUEST);
    });


    it('sould filter request when end data is specifiqued', async ()=>{
      const input = {
        userId: TEST_USERS.ADMIN.getId(),
        endDate: TEST_DATES.REQUEST,
      };

      const requests=[
        new BenefitRequest(
          'future-request',
          TEST_BENEFITS.COURSE,
          'test reason',
          RequestStatus.PENDING,
          new Date(TEST_DATES.REQUEST.getTime() + 1000 * 60 * 60 * 24),
          null,
          TEST_USERS.EMPLOYEE,
          TEST_COMPANIES.COMPANY,
          TEST_DATES.CREATED,
          TEST_DATES.UPDATED
        ),
        new BenefitRequest(
          'request',
          TEST_BENEFITS.COURSE,
          'test reason',
          RequestStatus.PENDING,
          TEST_DATES.REQUEST,
          null,
          TEST_USERS.EMPLOYEE,
          TEST_COMPANIES.COMPANY,
          TEST_DATES.CREATED,
          TEST_DATES.UPDATED
        ),
      ]

      benefitRequestRepository.givenExistingRequests(...requests);

      const result = await useCase.execute(input);
  
      expect(result.requests).toHaveLength(1);
      expect(result.requests[0].requestDate).toBe(TEST_DATES.REQUEST);

    })

    it('should return request filtered by start and end date', async ()=>{
      const input = {
        userId: TEST_USERS.ADMIN.getId(),
        startDate: new Date(TEST_DATES.REQUEST.getTime() - (1000 * 60 * 60 * 24 * 1)), //1 day before
        endDate: new Date(TEST_DATES.REQUEST.getTime() + (1000 * 60 * 60 * 24 * 1)), //1 day after
      };

      const requests=[
        new BenefitRequest(
          'tomorrow-request',
          TEST_BENEFITS.COURSE,
          'test reason',
          RequestStatus.PENDING,
          new Date(TEST_DATES.REQUEST.getTime() + 1000 * 60 * 60 * 24),
          null,
          TEST_USERS.EMPLOYEE,
          TEST_COMPANIES.COMPANY,
          TEST_DATES.CREATED,
          TEST_DATES.UPDATED
        ),
        new BenefitRequest(
          'past-request',
          TEST_BENEFITS.COURSE,
          'test reason',
          RequestStatus.PENDING,
          new Date(TEST_DATES.REQUEST.getTime() - (1000 * 60 * 60 * 24 * 7)), //7 days before
          null,
          TEST_USERS.EMPLOYEE,
          TEST_COMPANIES.COMPANY,
          TEST_DATES.CREATED,
          TEST_DATES.UPDATED
        ),
        new BenefitRequest(
          'request',
          TEST_BENEFITS.LICENSE,
          'reason',
          RequestStatus.APPROVED,
          TEST_DATES.REQUEST,
          null,
          TEST_USERS.EMPLOYEE,
          TEST_COMPANIES.COMPANY,
          TEST_DATES.CREATED,
          TEST_DATES.UPDATED
        )
      ]

      benefitRequestRepository.givenExistingRequests(...requests);

      const result = await useCase.execute(input);
  
      expect(result.requests).toHaveLength(2);
      expect(result.requests[0].id).toBe('tomorrow-request');
      expect(result.requests[1].id).toBe('request');

    })



    it('should  see requests from the company of the user', async () => {
       
      const otherCompanyRequest = new BenefitRequest(
        'other-request-id',
        TEST_BENEFITS.COURSE,
        'test reason',
        RequestStatus.PENDING,
        TEST_DATES.REQUEST,
        null,
        TEST_USERS.EMPLOYEE,
        TEST_COMPANIES.OTHER_COMPANY,
        TEST_DATES.CREATED,
        TEST_DATES.UPDATED
      );

      benefitRequestRepository.givenExistingRequests(otherCompanyRequest);

      const input = { userId: TEST_USERS.ADMIN.getId(), companyId: TEST_COMPANIES.COMPANY.getId() };
      const result = await useCase.execute(input);

      expect(result.requests.some(r => r.company.getId() !== TEST_COMPANIES.OTHER_COMPANY.getId())).toBe(false);
    });
  });

 

  it('should throw error if user does not exist', async () => {
     
    const input = { userId: 'non-existent' };

    await expect(useCase.execute(input)).rejects.toThrow('User not found');
  });
});
