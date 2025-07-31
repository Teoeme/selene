import { describe, it, expect } from 'vitest';
import { BenefitRequest } from '../../../src/domain/entities/BenefitRequest';
import { TEST_REQUESTS, TEST_BENEFITS, TEST_USERS, TEST_DATES, TEST_COMPANIES } from '../test-data';
import { RequestStatus } from '../../../src/domain/value-objects/RequestStatus';

describe('BenefitRequest', () => {
  describe('creation', () => {
    it('should create a valid pending request', () => {
      const requestData = TEST_REQUESTS.PENDING;

      // Creamos una nueva instancia en lugar de usar la del test data
      const request = new BenefitRequest(
        requestData.getId(),
        requestData.getBenefit(),
        requestData.getReason(),
        requestData.getStatus(),
        requestData.getRequestDate(),
        requestData.getResolutionDate(),
        requestData.getEmployee(),
        requestData.getCompany(),
        requestData.getCreatedAt(),
        requestData.getUpdatedAt(),
      );

      expect(request.getId()).toBe(requestData.getId());
      expect(request.getBenefit()).toBe(requestData.getBenefit());
      expect(request.getReason()).toBe(requestData.getReason());
      expect(request.getStatus()).toBe(RequestStatus.PENDING);
      expect(request.getRequestDate()).toBe(requestData.getRequestDate());
      expect(request.getResolutionDate()).toBeNull();
      expect(request.getEmployee()).toBe(requestData.getEmployee());
      expect(request.getCompany()).toBe(requestData.getCompany());
      expect(request.getCreatedAt()).toBe(requestData.getCreatedAt());
      expect(request.getUpdatedAt()).toBe(requestData.getUpdatedAt());
    });
  });

  describe('status management', () => {
    it('should approve a pending request for an active benefit', () => {
      const request = new BenefitRequest(
        'test-id',
        TEST_BENEFITS.COURSE,
        'test reason',
        RequestStatus.PENDING,
        TEST_DATES.REQUEST,
        null,
        TEST_USERS.EMPLOYEE,
        TEST_COMPANIES.COMPANY,
        TEST_DATES.CREATED,
        TEST_DATES.UPDATED,
      );

      request.approve();

      expect(request.getStatus()).toBe(RequestStatus.APPROVED);
      expect(request.getResolutionDate()).toBeInstanceOf(Date);
      expect(request.isApproved()).toBe(true);
      expect(request.isPending()).toBe(false);
      expect(request.isRejected()).toBe(false);
    });

    it('should not approve a pending request for an inactive benefit', () => {
      const request = new BenefitRequest(
        'test-id',
        TEST_BENEFITS.INACTIVE_COURSE,
        'test reason',
        RequestStatus.PENDING,
        TEST_DATES.REQUEST,
        null,
        TEST_USERS.EMPLOYEE,
        TEST_COMPANIES.COMPANY,
        TEST_DATES.CREATED,
        TEST_DATES.UPDATED,
      );

      expect(() => request.approve()).toThrow('Cannot approve a request for an inactive benefit');
      expect(request.getStatus()).toBe(RequestStatus.PENDING);
      expect(request.getResolutionDate()).toBeNull();
    });

    it('should reject a pending request', () => {
      const request = new BenefitRequest(
        'test-id',
        TEST_BENEFITS.COURSE,
        'test reason',
        RequestStatus.PENDING,
        TEST_DATES.REQUEST,
        null,
        TEST_USERS.EMPLOYEE,
        TEST_COMPANIES.COMPANY,
        TEST_DATES.CREATED,
        TEST_DATES.UPDATED,
      );

      request.reject();

      expect(request.getStatus()).toBe(RequestStatus.REJECTED);
      expect(request.getResolutionDate()).toBeInstanceOf(Date);
      expect(request.isRejected()).toBe(true);
      expect(request.isPending()).toBe(false);
      expect(request.isApproved()).toBe(false);
    });

    it('should not approve an already resolved request', () => {
      const request = new BenefitRequest(
        'test-id',
        TEST_BENEFITS.COURSE,
        'test reason',
        RequestStatus.REJECTED,
        TEST_DATES.REQUEST,
        TEST_DATES.RESOLUTION,
        TEST_USERS.EMPLOYEE,
        TEST_COMPANIES.COMPANY,
        TEST_DATES.CREATED,
        TEST_DATES.UPDATED,
      );

      expect(() => request.approve()).toThrow('Cannot approve a request that is not pending');
      expect(request.getStatus()).toBe(RequestStatus.REJECTED);
    });

    it('should not reject an already resolved request', () => {
      const request = new BenefitRequest(
        'test-id',
        TEST_BENEFITS.COURSE,
        'test reason',
        RequestStatus.APPROVED,
        TEST_DATES.REQUEST,
        TEST_DATES.RESOLUTION,
        TEST_USERS.EMPLOYEE,
        TEST_COMPANIES.COMPANY,
        TEST_DATES.CREATED,
        TEST_DATES.UPDATED,
      );

      expect(() => request.reject()).toThrow('Cannot reject a request that is not pending');
      expect(request.getStatus()).toBe(RequestStatus.APPROVED);
    });
  });
});
