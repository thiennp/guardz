import { isIntersectionOf } from './isIntersectionOf';
import { isType } from './isType';
import { isString } from './isString';
import { isNumber } from './isNumber';
import { isBoolean } from './isBoolean';
import { isPositiveInteger } from './isPositiveInteger';
import { isArrayWithEachItem } from './isArrayWithEachItem';

describe('isIntersectionOf', () => {
  interface Person {
    name: string;
    age: number;
  }

  interface Employee {
    employeeId: string;
    department: string;
  }

  interface Manager {
    managedTeamSize: number;
    level: string;
  }

  interface Admin {
    permissions: string[];
    accessLevel: number;
  }

  type PersonEmployee = Person & Employee;
  type PersonEmployeeManager = Person & Employee & Manager;
  type PersonEmployeeManagerAdmin = Person & Employee & Manager & Admin;

  const isPerson = isType<Person>({
    name: isString,
    age: isNumber,
  });

  const isEmployee = isType<Employee>({
    employeeId: isString,
    department: isString,
  });

  const isManager = isType<Manager>({
    managedTeamSize: isPositiveInteger,
    level: isString,
  });

  const isAdmin = isType<Admin>({
    permissions: isArrayWithEachItem(isString),
    accessLevel: isPositiveInteger,
  });

  describe('2 type guards', () => {
    const isPersonEmployee = isIntersectionOf(isPerson, isEmployee);

    it('should return true when value satisfies both type guards', () => {
      const validValue: PersonEmployee = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
      };

      expect(isPersonEmployee(validValue)).toBe(true);
    });

    it('should return false when value fails first type guard', () => {
      const invalidValue = {
        // missing name and age
        employeeId: 'EMP001',
        department: 'Engineering',
      };

      expect(isPersonEmployee(invalidValue)).toBe(false);
    });

    it('should return false when value fails second type guard', () => {
      const invalidValue = {
        name: 'John Doe',
        age: 30,
        // missing employeeId and department
      };

      expect(isPersonEmployee(invalidValue)).toBe(false);
    });
  });

  describe('3 type guards', () => {
    const isPersonEmployeeManager = isIntersectionOf(isPerson, isEmployee, isManager);

    it('should return true when value satisfies all three type guards', () => {
      const validValue: PersonEmployeeManager = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
        managedTeamSize: 5,
        level: 'Senior',
      };

      expect(isPersonEmployeeManager(validValue)).toBe(true);
    });

    it('should return false when value fails any type guard', () => {
      const invalidValue = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
        // missing manager properties
      };

      expect(isPersonEmployeeManager(invalidValue)).toBe(false);
    });
  });

  describe('4 type guards', () => {
    const isPersonEmployeeManagerAdmin = isIntersectionOf(isPerson, isEmployee, isManager, isAdmin);

    it('should return true when value satisfies all four type guards', () => {
      const validValue: PersonEmployeeManagerAdmin = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
        managedTeamSize: 5,
        level: 'Senior',
        permissions: ['read', 'write'],
        accessLevel: 3,
      };

      expect(isPersonEmployeeManagerAdmin(validValue)).toBe(true);
    });

    it('should return false when value fails any type guard', () => {
      const invalidValue = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
        managedTeamSize: 5,
        level: 'Senior',
        // missing admin properties
      };

      expect(isPersonEmployeeManagerAdmin(invalidValue)).toBe(false);
    });
  });

  describe('5+ type guards', () => {
    const isActive = isType<{ isActive: boolean }>({ isActive: isBoolean });
    const isVerified = isType<{ verified: boolean }>({ verified: isBoolean });
    const isPremium = isType<{ premium: boolean }>({ premium: isBoolean });
    const isSubscribed = isType<{ subscribed: boolean }>({ subscribed: isBoolean });
    const isEnabled = isType<{ enabled: boolean }>({ enabled: isBoolean });

    it('should work with 5 type guards', () => {
      const isFiveTypes = isIntersectionOf(isPerson, isEmployee, isManager, isActive, isVerified);

      const validValue = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
        managedTeamSize: 5,
        level: 'Senior',
        isActive: true,
        verified: true,
      };

      const invalidValue = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
        managedTeamSize: 5,
        level: 'Senior',
        isActive: true,
        // missing verified
      };

      expect(isFiveTypes(validValue)).toBe(true);
      expect(isFiveTypes(invalidValue)).toBe(false);
    });

    it('should work with 6 type guards', () => {
      const isSixTypes = isIntersectionOf(isPerson, isEmployee, isManager, isActive, isVerified, isPremium);

      const validValue = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
        managedTeamSize: 5,
        level: 'Senior',
        isActive: true,
        verified: true,
        premium: true,
      };

      expect(isSixTypes(validValue)).toBe(true);
    });

    it('should work with 7 type guards', () => {
      const isSevenTypes = isIntersectionOf(isPerson, isEmployee, isManager, isActive, isVerified, isPremium, isSubscribed);

      const validValue = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
        managedTeamSize: 5,
        level: 'Senior',
        isActive: true,
        verified: true,
        premium: true,
        subscribed: true,
      };

      expect(isSevenTypes(validValue)).toBe(true);
    });

    it('should work with 8 type guards', () => {
      const isEightTypes = isIntersectionOf(isPerson, isEmployee, isManager, isActive, isVerified, isPremium, isSubscribed, isEnabled);

      const validValue = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
        managedTeamSize: 5,
        level: 'Senior',
        isActive: true,
        verified: true,
        premium: true,
        subscribed: true,
        enabled: true,
      };

      expect(isEightTypes(validValue)).toBe(true);
    });

    it('should work with 9 type guards', () => {
      const isNineTypes = isIntersectionOf(isPerson, isEmployee, isManager, isActive, isVerified, isPremium, isSubscribed, isEnabled, isAdmin);

      const validValue = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
        managedTeamSize: 5,
        level: 'Senior',
        isActive: true,
        verified: true,
        premium: true,
        subscribed: true,
        enabled: true,
        permissions: ['read', 'write'],
        accessLevel: 3,
      };

      expect(isNineTypes(validValue)).toBe(true);
    });

    it('should work with 10 type guards', () => {
      const isTenTypes = isIntersectionOf(
        isPerson, isEmployee, isManager, isActive, isVerified, 
        isPremium, isSubscribed, isEnabled, isAdmin, isType({ extra: isString })
      );

      const validValue = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
        managedTeamSize: 5,
        level: 'Senior',
        isActive: true,
        verified: true,
        premium: true,
        subscribed: true,
        enabled: true,
        permissions: ['read', 'write'],
        accessLevel: 3,
        extra: 'additional',
      };

      expect(isTenTypes(validValue)).toBe(true);
    });
  });

  it('should work with error configuration', () => {
    const errors: string[] = [];
    const config = {
      callbackOnError: (error: string) => errors.push(error),
      identifier: 'testValue',
    };

    const isPersonEmployee = isIntersectionOf(isPerson, isEmployee);
    const invalidValue = {
      name: 'John Doe',
      // missing age (fails first type guard)
      employeeId: 'EMP001',
      department: 'Engineering',
    };

    const result = isPersonEmployee(invalidValue, config);
    expect(result).toBe(false);
    expect(errors.length).toBeGreaterThan(0);
  });
}); 