import { describe, it, expect } from 'vitest';
import { Benefit } from '../../../src/domain/entities/Benefit';
import { TEST_BENEFITS } from '../test-data';
import { BenefitType } from '../../../src/domain/value-objects/BenefitType';

describe('Benefit', () => {
  describe('creation', () => {
    it('should create a valid active benefit', () => {
      const benefitData = TEST_BENEFITS.COURSE;
      const benefit = new Benefit(
        benefitData.id,
        benefitData.name,
        benefitData.description,
        benefitData.type,
        benefitData.isActive,
        benefitData.company,
        benefitData.createdAt,
        benefitData.updatedAt,
      );

      expect(benefit.getId()).toBe(benefitData.id);
      expect(benefit.getName()).toBe(benefitData.name);
      expect(benefit.getDescription()).toBe(benefitData.description);
      expect(benefit.getType()).toBe(BenefitType.COURSE);
      expect(benefit.isAvailable()).toBe(true);
      expect(benefit.getCompany()).toBe(benefitData.company);
      expect(benefit.getCreatedAt()).toBe(benefitData.createdAt);
      expect(benefit.getUpdatedAt()).toBe(benefitData.updatedAt);
    });

    it('should create a valid inactive benefit', () => {
      const benefitData = TEST_BENEFITS.INACTIVE_COURSE;
      const benefit = new Benefit(
        benefitData.id,
        benefitData.name,
        benefitData.description,
        benefitData.type,
        benefitData.isActive,
        benefitData.company,
        benefitData.createdAt,
        benefitData.updatedAt,
      );

      expect(benefit.isAvailable()).toBe(false);
    });
  });

  describe('type checks', () => {
    it('should correctly identify a course benefit', () => {
      const benefitData = TEST_BENEFITS.COURSE;
      const benefit = new Benefit(
        benefitData.id,
        benefitData.name,
        benefitData.description,
        benefitData.type,
        benefitData.isActive,
        benefitData.company,
        benefitData.createdAt,
        benefitData.updatedAt,
      );

      expect(benefit.isCourse()).toBe(true);
      expect(benefit.isLicense()).toBe(false);
      expect(benefit.isMeal()).toBe(false);
      expect(benefit.isCoworking()).toBe(false);
    });

    it('should correctly identify a license benefit', () => {
      const benefitData = TEST_BENEFITS.LICENSE;
      const benefit = new Benefit(
        benefitData.id,
        benefitData.name,
        benefitData.description,
        benefitData.type,
        benefitData.isActive,
        benefitData.company,
        benefitData.createdAt,
        benefitData.updatedAt,
      );

      expect(benefit.isCourse()).toBe(false);
      expect(benefit.isLicense()).toBe(true);
      expect(benefit.isMeal()).toBe(false);
      expect(benefit.isCoworking()).toBe(false);
    });
  });
});
