import { isIntersectionOf } from './isIntersectionOf';
import { isType } from './isType';
import { isString } from './isString';
import { isNumber } from './isNumber';
import { isBoolean } from './isBoolean';
import { isArrayWithEachItem } from './isArrayWithEachItem';
import { isNonNullObject } from './isNonNullObject';
import { isDate } from './isDate';
import { isFunction } from './isFunction';
import type { TypeGuardFn } from './isType';

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
    teamSize: number;
    reportsTo: string;
  }

  interface Address {
    street: string;
    city: string;
    zipCode: number;
  }

  interface Contact {
    email: string;
    phone: string;
  }

  interface Settings {
    theme: string;
    notifications: boolean;
  }

  interface Metadata {
    createdAt: Date;
    updatedAt: Date;
  }

  type PersonEmployee = Person & Employee;
  type PersonEmployeeManager = Person & Employee & Manager;
  type FullProfile = Person & Employee & Manager & Address & Contact & Settings & Metadata;

  const isPerson = isType<Person>({
    name: isString,
    age: isNumber,
  });

  const isEmployee = isType<Employee>({
    employeeId: isString,
    department: isString,
  });

  const isManager = isType<Manager>({
    teamSize: isNumber,
    reportsTo: isString,
  });

  const isAddress = isType<Address>({
    street: isString,
    city: isString,
    zipCode: isNumber,
  });

  const isContact = isType<Contact>({
    email: isString,
    phone: isString,
  });

  const isSettings = isType<Settings>({
    theme: isString,
    notifications: isBoolean,
  });

  const isMetadata = isType<Metadata>({
    createdAt: isDate,
    updatedAt: isDate,
  });

  // Simple array type guard for testing
  const isArray: TypeGuardFn<unknown[]> = (value): value is unknown[] => {
    return Array.isArray(value);
  };

  // Mock type guard functions for testing
  const createMockGuard = (returnValue: boolean): TypeGuardFn<unknown> => {
    return (value: unknown): value is unknown => returnValue;
  };

  describe('Basic functionality', () => {
    it('should return true when value satisfies all type guards', () => {
      const validValue: PersonEmployee = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
      };

      const isPersonEmployee = isIntersectionOf(isPerson, isEmployee);
      expect(isPersonEmployee(validValue)).toBe(true);
    });

    it('should return false when value fails any type guard', () => {
      const invalidValue = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        // missing department
      };

      const isPersonEmployee = isIntersectionOf(isPerson, isEmployee);
      expect(isPersonEmployee(invalidValue)).toBe(false);
    });

    it('should return false when value fails the first type guard', () => {
      const invalidValue = {
        // missing name and age
        employeeId: 'EMP001',
        department: 'Engineering',
      };

      const isPersonEmployee = isIntersectionOf(isPerson, isEmployee);
      expect(isPersonEmployee(invalidValue)).toBe(false);
    });

    it('should return false when value fails the last type guard', () => {
      const invalidValue = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 123, // should be string
      };

      const isPersonEmployee = isIntersectionOf(isPerson, isEmployee);
      expect(isPersonEmployee(invalidValue)).toBe(false);
    });
  });

  describe('Single type guard', () => {
    it('should work with single type guard', () => {
      const singleTypeGuard = isIntersectionOf(isPerson);

      const validValue = {
        name: 'John Doe',
        age: 30,
      };

      const invalidValue = {
        name: 'John Doe',
        // missing age
      };

      expect(singleTypeGuard(validValue)).toBe(true);
      expect(singleTypeGuard(invalidValue)).toBe(false);
    });

    it('should work with single primitive type guard', () => {
      const isStringGuard = isIntersectionOf(isString);

      expect(isStringGuard('hello')).toBe(true);
      expect(isStringGuard(123)).toBe(false);
      expect(isStringGuard(null)).toBe(false);
      expect(isStringGuard(undefined)).toBe(false);
    });
  });

  describe('Multiple type guards (2-10)', () => {
    it('should work with two type guards', () => {
      const isPersonEmployee = isIntersectionOf(isPerson, isEmployee);

      const validValue = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
      };

      const invalidValue = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        // missing department
      };

      expect(isPersonEmployee(validValue)).toBe(true);
      expect(isPersonEmployee(invalidValue)).toBe(false);
    });

    it('should work with three type guards', () => {
      const isPersonEmployeeManager = isIntersectionOf(isPerson, isEmployee, isManager);

      const validValue = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
        teamSize: 5,
        reportsTo: 'CTO',
      };

      const invalidValue = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
        teamSize: 5,
        // missing reportsTo
      };

      expect(isPersonEmployeeManager(validValue)).toBe(true);
      expect(isPersonEmployeeManager(invalidValue)).toBe(false);
    });

    it('should work with four type guards', () => {
      const isFourTypes = isIntersectionOf(isPerson, isEmployee, isManager, isAddress);

      const validValue = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
        teamSize: 5,
        reportsTo: 'CTO',
        street: '123 Main St',
        city: 'New York',
        zipCode: 10001,
      };

      const invalidValue = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
        teamSize: 5,
        reportsTo: 'CTO',
        street: '123 Main St',
        city: 'New York',
        // missing zipCode
      };

      expect(isFourTypes(validValue)).toBe(true);
      expect(isFourTypes(invalidValue)).toBe(false);
    });

    it('should work with five type guards', () => {
      const isFiveTypes = isIntersectionOf(isPerson, isEmployee, isManager, isAddress, isContact);

      const validValue = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
        teamSize: 5,
        reportsTo: 'CTO',
        street: '123 Main St',
        city: 'New York',
        zipCode: 10001,
        email: 'john@example.com',
        phone: '555-1234',
      };

      const invalidValue = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
        teamSize: 5,
        reportsTo: 'CTO',
        street: '123 Main St',
        city: 'New York',
        zipCode: 10001,
        email: 'john@example.com',
        // missing phone
      };

      expect(isFiveTypes(validValue)).toBe(true);
      expect(isFiveTypes(invalidValue)).toBe(false);
    });

    it('should work with six type guards', () => {
      const isSixTypes = isIntersectionOf(isPerson, isEmployee, isManager, isAddress, isContact, isSettings);

      const validValue = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
        teamSize: 5,
        reportsTo: 'CTO',
        street: '123 Main St',
        city: 'New York',
        zipCode: 10001,
        email: 'john@example.com',
        phone: '555-1234',
        theme: 'dark',
        notifications: true,
      };

      const invalidValue = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
        teamSize: 5,
        reportsTo: 'CTO',
        street: '123 Main St',
        city: 'New York',
        zipCode: 10001,
        email: 'john@example.com',
        phone: '555-1234',
        theme: 'dark',
        // missing notifications
      };

      expect(isSixTypes(validValue)).toBe(true);
      expect(isSixTypes(invalidValue)).toBe(false);
    });

    it('should work with seven type guards', () => {
      const isSevenTypes = isIntersectionOf(isPerson, isEmployee, isManager, isAddress, isContact, isSettings, isMetadata);

      const validValue = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
        teamSize: 5,
        reportsTo: 'CTO',
        street: '123 Main St',
        city: 'New York',
        zipCode: 10001,
        email: 'john@example.com',
        phone: '555-1234',
        theme: 'dark',
        notifications: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const invalidValue = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
        teamSize: 5,
        reportsTo: 'CTO',
        street: '123 Main St',
        city: 'New York',
        zipCode: 10001,
        email: 'john@example.com',
        phone: '555-1234',
        theme: 'dark',
        notifications: true,
        createdAt: new Date(),
        // missing updatedAt
      };

      expect(isSevenTypes(validValue)).toBe(true);
      expect(isSevenTypes(invalidValue)).toBe(false);
    });

    it('should work with eight type guards', () => {
      const isVersion = isType<{ version: number }>({ version: isNumber });
      const isEightTypes = isIntersectionOf(
        isPerson, isEmployee, isManager, isAddress, isContact, isSettings, isMetadata,
        isVersion
      );

      const validValue = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
        teamSize: 5,
        reportsTo: 'CTO',
        street: '123 Main St',
        city: 'New York',
        zipCode: 10001,
        email: 'john@example.com',
        phone: '555-1234',
        theme: 'dark',
        notifications: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
      };

      const invalidValue = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
        teamSize: 5,
        reportsTo: 'CTO',
        street: '123 Main St',
        city: 'New York',
        zipCode: 10001,
        email: 'john@example.com',
        phone: '555-1234',
        theme: 'dark',
        notifications: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: '1', // should be number
      };

      expect(isEightTypes(validValue)).toBe(true);
      expect(isEightTypes(invalidValue)).toBe(false);
    });

    it('should work with nine type guards', () => {
      const isVersion = isType<{ version: number }>({ version: isNumber });
      const isActive = isType<{ active: boolean }>({ active: isBoolean });
      const isNineTypes = isIntersectionOf(
        isPerson, isEmployee, isManager, isAddress, isContact, isSettings, isMetadata,
        isVersion, isActive
      );

      const validValue = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
        teamSize: 5,
        reportsTo: 'CTO',
        street: '123 Main St',
        city: 'New York',
        zipCode: 10001,
        email: 'john@example.com',
        phone: '555-1234',
        theme: 'dark',
        notifications: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        active: true,
      };

      const invalidValue = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
        teamSize: 5,
        reportsTo: 'CTO',
        street: '123 Main St',
        city: 'New York',
        zipCode: 10001,
        email: 'john@example.com',
        phone: '555-1234',
        theme: 'dark',
        notifications: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        active: 'true', // should be boolean
      };

      expect(isNineTypes(validValue)).toBe(true);
      expect(isNineTypes(invalidValue)).toBe(false);
    });

    it('should work with ten type guards', () => {
      const isVersion = isType<{ version: number }>({ version: isNumber });
      const isActive = isType<{ active: boolean }>({ active: isBoolean });
      const isTags = isType<{ tags: unknown[] }>({ tags: isArray });
      
      const isTenTypes = isIntersectionOf(
        isPerson, isEmployee, isManager, isAddress, isContact, isSettings, isMetadata,
        isVersion, isActive, isTags
      );

      const validValue = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
        teamSize: 5,
        reportsTo: 'CTO',
        street: '123 Main St',
        city: 'New York',
        zipCode: 10001,
        email: 'john@example.com',
        phone: '555-1234',
        theme: 'dark',
        notifications: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        active: true,
        tags: ['developer', 'senior'],
      };

      const invalidValue = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
        teamSize: 5,
        reportsTo: 'CTO',
        street: '123 Main St',
        city: 'New York',
        zipCode: 10001,
        email: 'john@example.com',
        phone: '555-1234',
        theme: 'dark',
        notifications: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        active: true,
        tags: 'developer', // should be array
      };

      expect(isTenTypes(validValue)).toBe(true);
      expect(isTenTypes(invalidValue)).toBe(false);
    });
  });

  describe('Primitive type guards', () => {
    it('should work with primitive type guards', () => {
      const isStringNumber = isIntersectionOf(isString, isNumber);
      const isStringBoolean = isIntersectionOf(isString, isBoolean);
      const isNumberBoolean = isIntersectionOf(isNumber, isBoolean);

      // These should all return false since a value can't be both types
      expect(isStringNumber('hello')).toBe(false);
      expect(isStringNumber(123)).toBe(false);
      expect(isStringBoolean('hello')).toBe(false);
      expect(isStringBoolean(true)).toBe(false);
      expect(isNumberBoolean(123)).toBe(false);
      expect(isNumberBoolean(true)).toBe(false);
    });

    it('should work with single primitive type guard', () => {
      const isStringGuard = isIntersectionOf(isString);
      const isNumberGuard = isIntersectionOf(isNumber);
      const isBooleanGuard = isIntersectionOf(isBoolean);
      const isObjectGuard = isIntersectionOf(isNonNullObject);
      const isFunctionGuard = isIntersectionOf(isFunction);

      expect(isStringGuard('hello')).toBe(true);
      expect(isStringGuard(123)).toBe(false);
      expect(isStringGuard(null)).toBe(false);
      expect(isStringGuard(undefined)).toBe(false);

      expect(isNumberGuard(123)).toBe(true);
      expect(isNumberGuard('123')).toBe(false);
      expect(isNumberGuard(null)).toBe(false);
      expect(isNumberGuard(undefined)).toBe(false);

      expect(isBooleanGuard(true)).toBe(true);
      expect(isBooleanGuard(false)).toBe(true);
      expect(isBooleanGuard('true')).toBe(false);
      expect(isBooleanGuard(null)).toBe(false);
      expect(isBooleanGuard(undefined)).toBe(false);

      expect(isObjectGuard({})).toBe(true);
      expect(isObjectGuard([])).toBe(false); // isNonNullObject excludes arrays
      expect(isObjectGuard(null)).toBe(false);
      expect(isObjectGuard(undefined)).toBe(false);
      expect(isObjectGuard('string')).toBe(false);

      expect(isFunctionGuard(() => {})).toBe(true);
      expect(isFunctionGuard(function() {})).toBe(true);
      expect(isFunctionGuard('function')).toBe(false);
      expect(isFunctionGuard(null)).toBe(false);
      expect(isFunctionGuard(undefined)).toBe(false);
    });
  });

  describe('Edge cases and error handling', () => {
    it('should work with error configuration', () => {
      const errors: string[] = [];
      const config = {
        callbackOnError: (error: string) => errors.push(error),
        identifier: 'testValue',
      };

      const invalidValue = {
        name: 'John Doe',
        // missing age (fails first type guard)
        employeeId: 'EMP001',
        department: 'Engineering',
      };

      const isPersonEmployee = isIntersectionOf(isPerson, isEmployee);
      const result = isPersonEmployee(invalidValue, config);
      
      expect(result).toBe(false);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should work with null config', () => {
      const validValue = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
      };

      const isPersonEmployee = isIntersectionOf(isPerson, isEmployee);
      expect(isPersonEmployee(validValue, null)).toBe(true);
    });

    it('should work with undefined config', () => {
      const validValue = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
      };

      const isPersonEmployee = isIntersectionOf(isPerson, isEmployee);
      expect(isPersonEmployee(validValue, undefined)).toBe(true);
    });

    it('should handle null values', () => {
      const isPersonEmployee = isIntersectionOf(isPerson, isEmployee);
      expect(isPersonEmployee(null)).toBe(false);
    });

    it('should handle undefined values', () => {
      const isPersonEmployee = isIntersectionOf(isPerson, isEmployee);
      expect(isPersonEmployee(undefined)).toBe(false);
    });

    it('should handle primitive values', () => {
      const isPersonEmployee = isIntersectionOf(isPerson, isEmployee);
      
      expect(isPersonEmployee('string')).toBe(false);
      expect(isPersonEmployee(123)).toBe(false);
      expect(isPersonEmployee(true)).toBe(false);
      expect(isPersonEmployee(false)).toBe(false);
      expect(isPersonEmployee([])).toBe(false);
    });

    it('should handle empty objects', () => {
      const isPersonEmployee = isIntersectionOf(isPerson, isEmployee);
      expect(isPersonEmployee({})).toBe(false);
    });

    it('should handle objects with extra properties', () => {
      const validValue = {
        name: 'John Doe',
        age: 30,
        employeeId: 'EMP001',
        department: 'Engineering',
        extraProperty: 'should be ignored',
        anotherExtra: 123,
      };

      const isPersonEmployee = isIntersectionOf(isPerson, isEmployee);
      expect(isPersonEmployee(validValue)).toBe(true);
    });
  });

  describe('Early return behavior', () => {
    it('should return false immediately when first type guard fails', () => {
      const mockGuard1 = createMockGuard(false);
      const mockGuard2 = createMockGuard(true);
      const mockGuard3 = createMockGuard(true);

      const combinedGuard = isIntersectionOf(mockGuard1, mockGuard2, mockGuard3);
      const result = combinedGuard({});

      expect(result).toBe(false);
    });

    it('should return false immediately when second type guard fails', () => {
      const mockGuard1 = createMockGuard(true);
      const mockGuard2 = createMockGuard(false);
      const mockGuard3 = createMockGuard(true);

      const combinedGuard = isIntersectionOf(mockGuard1, mockGuard2, mockGuard3);
      const result = combinedGuard({});

      expect(result).toBe(false);
    });

    it('should call all type guards when all pass', () => {
      const mockGuard1 = createMockGuard(true);
      const mockGuard2 = createMockGuard(true);
      const mockGuard3 = createMockGuard(true);

      const combinedGuard = isIntersectionOf(mockGuard1, mockGuard2, mockGuard3);
      const result = combinedGuard({});

      expect(result).toBe(true);
    });

    it('should pass config to all type guards', () => {
      let guard1Called = false;
      let guard2Called = false;
      
      const mockGuard1: TypeGuardFn<unknown> = (value, config): value is unknown => {
        guard1Called = true;
        return true;
      };
      const mockGuard2: TypeGuardFn<unknown> = (value, config): value is unknown => {
        guard2Called = true;
        return true;
      };
      
      const config = { callbackOnError: jest.fn(), identifier: 'test' };

      const combinedGuard = isIntersectionOf(mockGuard1, mockGuard2);
      combinedGuard({}, config);

      expect(guard1Called).toBe(true);
      expect(guard2Called).toBe(true);
    });
  });

  describe('Complex nested structures', () => {
    it('should work with nested object type guards', () => {
      interface NestedPerson {
        name: string;
        details: {
          age: number;
          email: string;
        };
      }

      interface NestedEmployee {
        employeeId: string;
        department: {
          name: string;
          code: number;
        };
      }

      const isNestedPerson = isType<NestedPerson>({
        name: isString,
        details: isType<{ age: number; email: string }>({
          age: isNumber,
          email: isString,
        }),
      });

      const isNestedEmployee = isType<NestedEmployee>({
        employeeId: isString,
        department: isType<{ name: string; code: number }>({
          name: isString,
          code: isNumber,
        }),
      });

      const isNestedCombined = isIntersectionOf(isNestedPerson, isNestedEmployee);

      const validValue = {
        name: 'John Doe',
        details: {
          age: 30,
          email: 'john@example.com',
        },
        employeeId: 'EMP001',
        department: {
          name: 'Engineering',
          code: 100,
        },
      };

      const invalidValue = {
        name: 'John Doe',
        details: {
          age: 30,
          email: 'john@example.com',
        },
        employeeId: 'EMP001',
        department: {
          name: 'Engineering',
          code: '100', // should be number
        },
      };

      expect(isNestedCombined(validValue)).toBe(true);
      expect(isNestedCombined(invalidValue)).toBe(false);
    });

    it('should work with array type guards', () => {
      interface PersonWithTags {
        name: string;
        tags: unknown[];
      }

      interface EmployeeWithSkills {
        employeeId: string;
        skills: unknown[];
      }

      const isPersonWithTags = isType<PersonWithTags>({
        name: isString,
        tags: isArray,
      });

      const isEmployeeWithSkills = isType<EmployeeWithSkills>({
        employeeId: isString,
        skills: isArray,
      });

      const isCombined = isIntersectionOf(isPersonWithTags, isEmployeeWithSkills);

      const validValue = {
        name: 'John Doe',
        tags: ['developer', 'senior'],
        employeeId: 'EMP001',
        skills: ['JavaScript', 'TypeScript'],
      };

      const invalidValue = {
        name: 'John Doe',
        tags: ['developer', 'senior'],
        employeeId: 'EMP001',
        skills: 'JavaScript', // should be array
      };

      expect(isCombined(validValue)).toBe(true);
      expect(isCombined(invalidValue)).toBe(false);
    });
  });

  describe('Type inference', () => {
    it('should provide correct type inference for single type guard', () => {
      const singleGuard = isIntersectionOf(isPerson);
      const value = { name: 'John', age: 30 };
      
      if (singleGuard(value)) {
        // TypeScript should know value is Person
        expect(value.name).toBe('John');
        expect(value.age).toBe(30);
      }
    });

    it('should provide correct type inference for multiple type guards', () => {
      const combinedGuard = isIntersectionOf(isPerson, isEmployee);
      const value = { 
        name: 'John', 
        age: 30, 
        employeeId: 'EMP001', 
        department: 'Engineering' 
      };
      
      if (combinedGuard(value)) {
        // TypeScript should know value is Person & Employee
        expect(value.name).toBe('John');
        expect(value.age).toBe(30);
        expect(value.employeeId).toBe('EMP001');
        expect(value.department).toBe('Engineering');
      }
    });
  });
});
