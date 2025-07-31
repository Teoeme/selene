import { UserRole } from '../value-objects/UserRole';
import { Company } from './Company';

export class User {
  constructor(
    private readonly id: string,
    private readonly email: string,
    private readonly name: string,
    private readonly password: string, 
    private readonly role: UserRole,
    private readonly company: Company,
    private readonly createdAt: Date,
    private readonly updatedAt: Date
  ) {}

  public getId(): string {
    return this.id;
  }

  public getEmail(): string {
    return this.email;
  }

  public getName(): string {
    return this.name;
  }

  public getPassword(): string {
    return this.password;
  }

  public getRole(): UserRole {
    return this.role;
  }

  public getCompany(): Company {
    return this.company;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  public isEmployee(): boolean {
    return this.role === UserRole.EMPLOYEE;
  }

  public belongsToCompany(company: Company): boolean {
    return this.company.getId() === company.getId();
  }
} 