import { UserRepository } from '../../domain/repositories/UserRepository';
import { BenefitRepository } from '../../domain/repositories/BenefitRepository';
import { BenefitRequestRepository } from '../../domain/repositories/BenefitRequestRepository';
import { CompanyRepository } from '../../domain/repositories/CompanyRepository';
import { MongoUserRepository } from '../repositories/MongoUserRepository';
import { MongoBenefitRepository } from '../repositories/MongoBenefitRepository';
import { MongoBenefitRequestRepository } from '../repositories/MongoBenefitRequestRepository';
import { MongoCompanyRepository } from '../repositories/MongoCompanyRepository';
import { JwtServiceImpl } from '../services/JwtService';
import { JwtService } from '../../domain/services/JwtService';
import { PasswordService } from '../../domain/services/PasswordService';
import { BcryptPasswordService } from '../services/PasswordService';

export class Container {
  private static instance: Container;
  private repositories: Map<string, any> = new Map();

  private constructor() {
    this.initializeRepositories();
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  private initializeRepositories(): void {
    this.repositories.set('UserRepository', new MongoUserRepository());
    this.repositories.set('BenefitRepository', new MongoBenefitRepository());
    this.repositories.set('BenefitRequestRepository', new MongoBenefitRequestRepository());
    this.repositories.set('CompanyRepository', new MongoCompanyRepository());
    this.repositories.set('JwtService', new JwtServiceImpl());
    this.repositories.set('PasswordService', new BcryptPasswordService());
  }

  getUserRepository(): UserRepository {
    return this.repositories.get('UserRepository');
  }

  getBenefitRepository(): BenefitRepository {
    return this.repositories.get('BenefitRepository');
  }

  getBenefitRequestRepository(): BenefitRequestRepository {
    return this.repositories.get('BenefitRequestRepository');
  }

  getCompanyRepository(): CompanyRepository {
    return this.repositories.get('CompanyRepository');
  }

  getJwtService(): JwtService {
    return this.repositories.get('JwtService');
  }

  getPasswordService(): PasswordService {
    return this.repositories.get('PasswordService');
  }
} 