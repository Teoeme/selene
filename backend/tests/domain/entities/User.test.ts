import { describe, it, expect } from 'vitest';
import { User } from '../../../src/domain/entities/User';
import { TEST_USERS, TEST_COMPANIES  } from '../test-data';
import { UserRole } from '../../../src/domain/value-objects/UserRole';

describe('User', () => {
  describe('creation', () => {
    it('should create a valid employee user', () => {
      const userData = TEST_USERS.EMPLOYEE;
      const user = new User(
        userData.getId(),
        userData.getEmail(),
        userData.getName(),
        userData.getPassword(),
        userData.getRole(),
        userData.getCompany(),
        userData.getCreatedAt(),
        userData.getUpdatedAt(),
      );

      expect(user.getId()).toBe(userData.getId());
      expect(user.getEmail()).toBe(userData.getEmail());
      expect(user.getName()).toBe(userData.getName());
      expect(user.getRole()).toBe(UserRole.EMPLOYEE);
      expect(user.getCompany()).toBe(userData.getCompany());
      expect(user.getCreatedAt()).toBe(userData.getCreatedAt());
      expect(user.getUpdatedAt()).toBe(userData.getUpdatedAt());
    });

    it('should create a valid admin user', () => {
      const userData = TEST_USERS.ADMIN;
      const user = new User(
        userData.getId(),
        userData.getEmail(),
        userData.getName(),
        userData.getPassword(),
        userData.getRole(),
        userData.getCompany(),
        userData.getCreatedAt(),
        userData.getUpdatedAt(),
      );

      expect(user.getId()).toBe(userData.getId());
      expect(user.getRole()).toBe(UserRole.ADMIN);
    });
  });

  describe('role checks', () => {
    it('should correctly identify an admin user', () => {
      const userData = TEST_USERS.ADMIN;
      const user = new User(
        userData.getId(),
        userData.getEmail(),
        userData.getName(),
        userData.getPassword(),
        userData.getRole(),
        userData.getCompany(),
        userData.getCreatedAt(),
        userData.getUpdatedAt(),
      );

      expect(user.isAdmin()).toBe(true);
      expect(user.isEmployee()).toBe(false);
    });

    it('should correctly identify an employee user', () => {
      const userData = TEST_USERS.EMPLOYEE;
      const user = new User(
        userData.getId(),
        userData.getEmail(),
        userData.getName(),
        userData.getPassword(),
        userData.getRole(),
        userData.getCompany(),
        userData.getCreatedAt(),
        userData.getUpdatedAt(),
      );

      expect(user.isAdmin()).toBe(false);
      expect(user.isEmployee()).toBe(true);
    });
  });

  describe('company checks', () => {
    it('should correctly check if user belongs to a company', () => {
      const userData = TEST_USERS.EMPLOYEE;
      const user = new User(
        userData.getId(),
        userData.getEmail(),
        userData.getName(),
        userData.getPassword(),
        userData.getRole(),
        userData.getCompany(),
        userData.getCreatedAt(),
        userData.getUpdatedAt(),
      );

      expect(user.belongsToCompany(TEST_COMPANIES.COMPANY)).toBe(true);
      expect(user.belongsToCompany(TEST_COMPANIES.OTHER_COMPANY)).toBe(false);
    }); 
  });
});
