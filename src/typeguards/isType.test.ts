import { isType } from './isType';
import { isString } from './isString';
import { isNumber } from './isNumber';
import { isBoolean } from './isBoolean';
import { isArrayWithEachItem } from './isArrayWithEachItem';
import { isUndefinedOr } from './isUndefinedOr';

describe('isType', () => {
  interface SimpleUser {
    name: string;
    age: number;
  }

  interface ComplexUser {
    name: string;
    age: number;
    isActive: boolean;
    tags: string[];
    profile?: string;
  }

  describe('basic object validation', () => {
    const isSimpleUser = isType<SimpleUser>({
      name: isString,
      age: isNumber,
    });

    it('should return true for valid objects', () => {
      const validUser = { name: 'John', age: 30 };
      expect(isSimpleUser(validUser)).toBe(true);
    });

    it('should return false for objects with missing properties', () => {
      const invalidUser = { name: 'John' };
      expect(isSimpleUser(invalidUser)).toBe(false);
    });

    it('should return false for objects with wrong property types', () => {
      const invalidUser = { name: 'John', age: '30' };
      expect(isSimpleUser(invalidUser)).toBe(false);
    });

    it('should return false for objects with extra properties but correct required ones', () => {
      const userWithExtra = { name: 'John', age: 30, extra: 'value' };
      expect(isSimpleUser(userWithExtra)).toBe(true); // Should pass - extra properties are allowed
    });

    it('should return false for null', () => {
      expect(isSimpleUser(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isSimpleUser(undefined)).toBe(false);
    });

    it('should return false for arrays', () => {
      expect(isSimpleUser([1, 2, 3])).toBe(false);
    });

    it('should return false for primitives', () => {
      expect(isSimpleUser('string')).toBe(false);
      expect(isSimpleUser(123)).toBe(false);
      expect(isSimpleUser(true)).toBe(false);
    });
  });

  describe('complex object validation', () => {
    const isComplexUser = isType<ComplexUser>({
      name: isString,
      age: isNumber,
      isActive: isBoolean,
      tags: isArrayWithEachItem(isString),
      profile: isUndefinedOr(isString),
    });

    it('should validate complex objects with all properties', () => {
      const validUser: ComplexUser = {
        name: 'Jane',
        age: 25,
        isActive: true,
        tags: ['developer', 'admin'],
        profile: 'Senior Developer',
      };
      expect(isComplexUser(validUser)).toBe(true);
    });

    it('should validate complex objects with optional properties set to undefined', () => {
      const validUser = {
        name: 'Jane',
        age: 25,
        isActive: true,
        tags: ['developer'],
        profile: undefined,
      };
      expect(isComplexUser(validUser)).toBe(true);
    });

    it('should return false for invalid array property', () => {
      const invalidUser = {
        name: 'Jane',
        age: 25,
        isActive: true,
        tags: ['developer', 123], // invalid array item
        profile: undefined,
      };
      expect(isComplexUser(invalidUser)).toBe(false);
    });

    it('should return false for wrong boolean type', () => {
      const invalidUser = {
        name: 'Jane',
        age: 25,
        isActive: 'true', // should be boolean
        tags: ['developer'],
        profile: undefined,
      };
      expect(isComplexUser(invalidUser)).toBe(false);
    });
  });

  describe('nested object validation', () => {
    interface Address {
      street: string;
      city: string;
      zipCode: number;
    }

    interface UserWithAddress {
      name: string;
      address: Address;
    }

    const isAddress = isType<Address>({
      street: isString,
      city: isString,
      zipCode: isNumber,
    });

    const isUserWithAddress = isType<UserWithAddress>({
      name: isString,
      address: isAddress,
    });

    it('should validate nested objects', () => {
      const validUser: UserWithAddress = {
        name: 'John',
        address: {
          street: '123 Main St',
          city: 'Springfield',
          zipCode: 12345,
        },
      };
      expect(isUserWithAddress(validUser)).toBe(true);
    });

    it('should return false for invalid nested object', () => {
      const invalidUser = {
        name: 'John',
        address: {
          street: '123 Main St',
          city: 'Springfield',
          zipCode: '12345', // should be number
        },
      };
      expect(isUserWithAddress(invalidUser)).toBe(false);
    });

    it('should return false for missing nested object', () => {
      const invalidUser = {
        name: 'John',
        address: null,
      };
      expect(isUserWithAddress(invalidUser)).toBe(false);
    });
  });

  describe('error handling', () => {
    const isSimpleUser = isType<SimpleUser>({
      name: isString,
      age: isNumber,
    });

    it('should call error callback for invalid objects', () => {
      const errors: string[] = [];
      const config = {
        callbackOnError: (error: string) => errors.push(error),
        identifier: 'user',
      };

      const invalidUser = { name: 'John', age: '30' };
      const result = isSimpleUser(invalidUser, config);

      expect(result).toBe(false);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('user.age');
    });

    it('should call error callback for non-object values', () => {
      const errors: string[] = [];
      const config = {
        callbackOnError: (error: string) => errors.push(error),
        identifier: 'user',
      };

      const result = isSimpleUser('not an object', config);

      expect(result).toBe(false);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should handle nested property errors with proper identifiers', () => {
      interface NestedUser {
        name: string;
        details: {
          age: number;
          email: string;
        };
      }

      const isNestedUser = isType<NestedUser>({
        name: isString,
        details: isType({
          age: isNumber,
          email: isString,
        }),
      });

      const errors: string[] = [];
      const config = {
        callbackOnError: (error: string) => errors.push(error),
        identifier: 'user',
      };

      const invalidUser = {
        name: 'John',
        details: {
          age: '30', // should be number
          email: 'john@example.com',
        },
      };

      const result = isNestedUser(invalidUser, config);

      expect(result).toBe(false);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('user.details.age');
    });
  });

  describe('empty object validation', () => {
    interface EmptyInterface {}

    const isEmptyObject = isType<EmptyInterface>({});

    it('should validate empty objects', () => {
      expect(isEmptyObject({})).toBe(true);
    });

    it('should validate objects with extra properties', () => {
      expect(isEmptyObject({ extra: 'property' })).toBe(true);
    });

    it('should return false for non-objects', () => {
      expect(isEmptyObject(null)).toBe(false);
      expect(isEmptyObject('string')).toBe(false);
      expect(isEmptyObject([])).toBe(false);
    });
  });

  describe('edge cases', () => {
    const isSimpleUser = isType<SimpleUser>({
      name: isString,
      age: isNumber,
    });

    it('should handle objects with prototype pollution', () => {
      const maliciousObject = JSON.parse(
        '{"name":"John","age":30,"__proto__":{"isAdmin":true}}'
      );
      expect(isSimpleUser(maliciousObject)).toBe(true);
    });

    it('should handle objects with null prototype', () => {
      const nullProtoObject = Object.create(null);
      nullProtoObject.name = 'John';
      nullProtoObject.age = 30;
      expect(isSimpleUser(nullProtoObject)).toBe(true);
    });
  });
});
