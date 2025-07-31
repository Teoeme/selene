import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { MongoUserRepository } from '../../../src/infrastructure/repositories/MongoUserRepository';
import { MongoBenefitRepository } from '../../../src/infrastructure/repositories/MongoBenefitRepository';
import { MongoBenefitRequestRepository } from '../../../src/infrastructure/repositories/MongoBenefitRequestRepository';
import { MongoCompanyRepository } from '../../../src/infrastructure/repositories/MongoCompanyRepository';
import { User } from '../../../src/domain/entities/User';
import { Benefit } from '../../../src/domain/entities/Benefit';
import { Company } from '../../../src/domain/entities/Company';
import { BenefitRequest } from '../../../src/domain/entities/BenefitRequest';
import { UserRole } from '../../../src/domain/value-objects/UserRole';
import { BenefitType } from '../../../src/domain/value-objects/BenefitType';
import { RequestStatus } from '../../../src/domain/value-objects/RequestStatus';
import { config } from '../../../src/config/env';

describe('MongoDB Repositories', () => {
  let userRepository: MongoUserRepository;
  let benefitRepository: MongoBenefitRepository;
  let benefitRequestRepository: MongoBenefitRequestRepository;
  let companyRepository: MongoCompanyRepository;

  beforeAll(async () => {
    // Conectar a MongoDB de test
    await mongoose.connect(config.database.uri,{
      dbName: `${config.database.name}-test`
    });
    
    userRepository = new MongoUserRepository();
    benefitRepository = new MongoBenefitRepository();
    benefitRequestRepository = new MongoBenefitRequestRepository();
    companyRepository = new MongoCompanyRepository();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    // Limpiar todas las colecciones
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
  });

  describe('CompanyRepository', () => {
    it('should save and find company', async () => {
      const company = new Company(
        'company-1',
        'Test Company',
        'Test Description',
        new Date(),
        new Date()
      );

      await companyRepository.save(company);
      const found = await companyRepository.findById('company-1');

      expect(found).toBeDefined();
      expect(found?.getName()).toBe('Test Company');
      expect(found?.getDescription()).toBe('Test Description');
    });
    
  });

  describe('UserRepository', () => {
    it('should save and find user with populated company', async () => {
      const company = new Company(
        'company-1',
        'Test Company',
        'Test Description',
        new Date(),
        new Date()
      );
      await companyRepository.save(company);

      const user = new User(
        'user-1',
        'test@example.com',
        'Test User',
        'admin123',
        UserRole.EMPLOYEE,
        company,
        new Date(),
        new Date()
      );

      await userRepository.save(user);
      const found = await userRepository.findById('user-1');

      expect(found).toBeDefined();
      expect(found?.getEmail()).toBe('test@example.com');
      expect(found?.getName()).toBe('Test User');
      expect(found?.getRole()).toBe(UserRole.EMPLOYEE);
      expect(found?.getCompany().getId()).toBe('company-1');
      expect(found?.getCompany().getName()).toBe('Test Company');
    });
  });

  describe('BenefitRepository', () => {
    it('should save and find benefit with populated company', async () => {
      const company = new Company(
        'company-1',
        'Test Company',
        'Test Description',
        new Date(),
        new Date()
      );
      await companyRepository.save(company);

      // Crear benefit
      const benefit = new Benefit(
        'benefit-1',
        'Test Benefit',
        'Test Description',
        BenefitType.COURSE,
        true,
        company,
        new Date(),
        new Date()
      );

      await benefitRepository.save(benefit);
      const found = await benefitRepository.findById('benefit-1');

      expect(found).toBeDefined();
      expect(found?.getName()).toBe('Test Benefit');
      expect(found?.getDescription()).toBe('Test Description');
      expect(found?.getType()).toBe(BenefitType.COURSE);
      expect(found?.isAvailable()).toBe(true);
      expect(found?.getCompany().getId()).toBe('company-1');
    });
  });

  describe('BenefitRequestRepository', () => {
    it('should save and find benefit request with populated entities', async () => {
      const company = new Company(
        'company-1',
        'Test Company',
        'Test Description',
        new Date(),
        new Date()
      );
      await companyRepository.save(company);

      const user = new User(
        'user-1',
        'test@example.com',
        'Test User',
        'admin123',
        UserRole.EMPLOYEE,
        company,
        new Date(),
        new Date()
      );
      await userRepository.save(user);

      const benefit = new Benefit(
        'benefit-1',
        'Test Benefit',
        'Test Description',
        BenefitType.COURSE,
        true,
        company,
        new Date(),
        new Date()
      );
      await benefitRepository.save(benefit);

      const request = new BenefitRequest(
        'request-1',
        benefit,
        'Test reason',
        RequestStatus.PENDING,
        new Date(),
        null,
        user,
        company,
        new Date(),
        new Date()
      );

      await benefitRequestRepository.save(request);
      const found = await benefitRequestRepository.findById('request-1');

      expect(found).toBeDefined();
      expect(found?.getReason()).toBe('Test reason');
      expect(found?.getStatus()).toBe(RequestStatus.PENDING);
      expect(found?.getBenefit().getId()).toBe('benefit-1');
      expect(found?.getEmployee().getId()).toBe('user-1');
      expect(found?.getCompany().getId()).toBe('company-1');
    });

    it('should find benefit requests by employee', async () => {
      //crear 2 request para diferetes empleados, solicita de un solo empleado
      const company = new Company(
        'company-1',
        'Test Company',
        'Test Description',
        new Date(),
        new Date()
      );
    
      await companyRepository.save(company);

      const user = new User(
        'user-1',
        'test@example.com',
        'Test User',
        'admin123',
        UserRole.EMPLOYEE,
        company,
        new Date(),
        new Date()
      );

      const user2 = new User(
        'user-2',
        'test2@example.com',
        'Test User 2',
        'admin123',
        UserRole.EMPLOYEE,
        company,
        new Date(),
        new Date()
      );

      await userRepository.save(user);
      await userRepository.save(user2);

      const benefit = new Benefit(
        'benefit-1',
        'Test Benefit',
        'Test Description',
        BenefitType.COURSE,
        true,
        company,
        new Date(),
        new Date()
      );
      await benefitRepository.save(benefit);

      const request = new BenefitRequest(
        'request-1',
        benefit,
        'Test reason',
        RequestStatus.PENDING,
        new Date(),
        null,
        user,
        company,
        new Date(),
        new Date()
      );
      await benefitRequestRepository.save(request);

      const request2 = new BenefitRequest(
        'request-2',
        benefit,
        'Test reason 2',
        RequestStatus.PENDING,
        new Date(),
        null,
        user2,
        company,
        new Date(),
        new Date()
      );

      await benefitRequestRepository.save(request2);

      const requests = await benefitRequestRepository.find({ employeeId: 'user-1' });

      expect(requests).toBeDefined();
      expect(requests.length).toBe(1);
      expect(requests[0].getEmployee().getId()).toBe('user-1');
      expect(requests[0].getBenefit().getId()).toBe('benefit-1');
      expect(requests[0].getCompany().getId()).toBe('company-1');
    });

    it('should find benefit requests by company', async () => {
      const company = new Company(
        'company-1',
        'Test Company',
        'Test Description',
        new Date(),
        new Date()
      );
      await companyRepository.save(company);

      const user = new User(
        'user-1',
        'test@example.com',
        'Test User',
        'admin123',
        UserRole.EMPLOYEE,
        company,
        new Date(),
        new Date()
      );
      await userRepository.save(user);

      const benefit = new Benefit(
        'benefit-1',
        'Test Benefit',
        'Test Description',
        BenefitType.COURSE,
        true,
        company,
        new Date(),
        new Date()
      );
      await benefitRepository.save(benefit);

      const request = new BenefitRequest(
        'request-1',
        benefit,
        'Test reason',
        RequestStatus.PENDING,
        new Date(), 
        null,
        user,
        company,
        new Date(),
        new Date()
      );
      await benefitRequestRepository.save(request);

      const request2 = new BenefitRequest(
        'request-2',
        benefit,
        'Test reason 2',
        RequestStatus.PENDING,
        new Date(),
        null,
        user,
        company,
        new Date(),
        new Date()
      );

      await benefitRequestRepository.save(request2);

      const company2 = new Company(
        'company-2',
        'Test Company 2',
        'Test Description 2',
        new Date(),
        new Date()
      );

      await companyRepository.save(company2);
      
      const request3 = new BenefitRequest(
        'request-3',
        benefit,
        'Test reason 3',
        RequestStatus.PENDING,
        new Date(),
        null,
        user,
        company2,
        new Date(),
        new Date()
      );

      await benefitRequestRepository.save(request3);

      const requests = await benefitRequestRepository.find({ companyId: 'company-1' });

      expect(requests).toBeDefined();
      expect(requests.length).toBe(2);
      expect(requests[0].getCompany().getId()).toBe('company-1');
      expect(requests[0].getEmployee().getId()).toBe('user-1');
    });


  });
}); 