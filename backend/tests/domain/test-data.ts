import { UserRole } from '../../src/domain/value-objects/UserRole';
import { BenefitType } from '../../src/domain/value-objects/BenefitType';
import { RequestStatus } from '../../src/domain/value-objects/RequestStatus';
import { User } from '../../src/domain/entities/User';
import { Benefit } from '../../src/domain/entities/Benefit';
import { BenefitRequest } from '../../src/domain/entities/BenefitRequest';
import { Company } from '../../src/domain/entities/Company';

export const TEST_DATES = {
  CREATED: new Date(),
  UPDATED: new Date(),
  REQUEST: new Date(new Date().getTime() - 1000 * 60 * 60 * 6),
  RESOLUTION: new Date(),
};

export const TEST_COMPANIES = {
  COMPANY: new Company(
    'company-1',
    'Test Company',
    'Test Company Description',
    TEST_DATES.CREATED,
    TEST_DATES.UPDATED,
  ),
  OTHER_COMPANY: new Company(
    'company-2',
    'Other Company',
    'Other Company Description',
    TEST_DATES.CREATED,
    TEST_DATES.UPDATED,
  ),
};

// Datos de prueba para User
export const TEST_USERS = {
  EMPLOYEE: new User(
    'user-1',
    'employee@company.com',
    'John Employee',
    'admin123',
    UserRole.EMPLOYEE,
    TEST_COMPANIES.COMPANY,
    TEST_DATES.CREATED,
    TEST_DATES.UPDATED,
  ),
  ADMIN: new User(
    'user-2',
    'admin@company.com',
    'Jane Admin',
    'admin123',
    UserRole.ADMIN,
    TEST_COMPANIES.COMPANY,
    TEST_DATES.CREATED,
    TEST_DATES.UPDATED,
  ),
  EMPLOYEE_ANOTHER_COMPANY: new User(
    'user-3',
    'employee-another-company@company.com',
    'John Employee Another Company',
    'admin123',
    UserRole.EMPLOYEE,
    TEST_COMPANIES.OTHER_COMPANY,
    TEST_DATES.CREATED,
    TEST_DATES.UPDATED,
  ),
};

export const TEST_BENEFITS = {
  COURSE: new Benefit(
    'benefit-1',
    'Curso de TypeScript',
    'Curso completo de TypeScript',
    BenefitType.COURSE,
    true,
    TEST_COMPANIES.COMPANY,
    TEST_DATES.CREATED,
    TEST_DATES.UPDATED,
  ),
  INACTIVE_COURSE: new Benefit(
    'benefit-2',
    'Curso de React',
    'Curso completo de React',
    BenefitType.COURSE,
    false,
    TEST_COMPANIES.COMPANY,
    TEST_DATES.CREATED,
    TEST_DATES.UPDATED,
  ),
  LICENSE: new Benefit(
    'benefit-3',
    'Licencia JetBrains',
    'Licencia anual para productos JetBrains',
    BenefitType.LICENSE,
    true,
    TEST_COMPANIES.COMPANY,
    TEST_DATES.CREATED,
    TEST_DATES.UPDATED,
  ),
};

export const TEST_REQUESTS = {
  PENDING: new BenefitRequest(
    'request-1',
    TEST_BENEFITS.COURSE,
    'Necesito mejorar mis habilidades en TypeScript',
    RequestStatus.PENDING,
    TEST_DATES.REQUEST,
    null,
    TEST_USERS.EMPLOYEE,
    TEST_COMPANIES.COMPANY,
    TEST_DATES.CREATED,
    TEST_DATES.UPDATED,
  ),
  APPROVED: new BenefitRequest(
    'request-2',
    TEST_BENEFITS.LICENSE,
    'Necesito la licencia para el trabajo diario',
    RequestStatus.APPROVED,
    TEST_DATES.REQUEST,
    TEST_DATES.RESOLUTION,
    TEST_USERS.EMPLOYEE,
    TEST_COMPANIES.COMPANY,
    TEST_DATES.CREATED,
    TEST_DATES.UPDATED,
  ),
  REJECTED: new BenefitRequest(
    'request-3',
    TEST_BENEFITS.COURSE,
    'Quiero aprender TypeScript',
    RequestStatus.REJECTED,
    TEST_DATES.REQUEST,
    TEST_DATES.RESOLUTION,
    TEST_USERS.EMPLOYEE,
    TEST_COMPANIES.COMPANY,
    TEST_DATES.CREATED,
    TEST_DATES.UPDATED,
  ),
  PENDING_FOR_INACTIVE: new BenefitRequest(
    'request-4',
    TEST_BENEFITS.INACTIVE_COURSE,
    'Quiero tomar el curso de React',
    RequestStatus.PENDING,
    TEST_DATES.REQUEST,
    null,
    TEST_USERS.EMPLOYEE,
    TEST_COMPANIES.COMPANY,
    TEST_DATES.CREATED,
    TEST_DATES.UPDATED,
  ),
  PENDING_ANOTHER_COMPANY: new BenefitRequest(
    'request-5',
    TEST_BENEFITS.COURSE,
    'Quiero tomar el curso de React',
    RequestStatus.PENDING,
    TEST_DATES.REQUEST,
    null,
    TEST_USERS.EMPLOYEE_ANOTHER_COMPANY,
    TEST_COMPANIES.OTHER_COMPANY,
    TEST_DATES.CREATED,
    TEST_DATES.UPDATED,
  ),
};
