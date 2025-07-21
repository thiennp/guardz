import { guardWithTolerance } from './guardWithTolerance';
import { isString } from './isString';
import { isNumber } from './isNumber';
import { isType } from './isType';
import { isBoolean } from './isBoolean';

describe('guardWithTolerance', () => {
  interface User {
    name: string;
    age: number;
    isActive: boolean;
  }

  const isUser = isType<User>({
    name: isString,
    age: isNumber,
    isActive: isBoolean,
  });

  describe('valid data', () => {
    it('should return data when validation passes', () => {
      const validData = { name: 'John', age: 30, isActive: true };
      const result = guardWithTolerance(validData, isUser);

      expect(result).toBe(validData);
      expect(result.name).toBe('John');
      expect(result.age).toBe(30);
      expect(result.isActive).toBe(true);
    });

    it('should not call error callback when validation passes', () => {
      const mockCallback = jest.fn();
      const config = {
        callbackOnError: mockCallback,
        identifier: 'userData',
      };

      const validData = { name: 'John', age: 30, isActive: true };
      const result = guardWithTolerance(validData, isUser, config);

      expect(result).toBe(validData);
      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

  describe('invalid data', () => {
    it('should return data even when validation fails', () => {
      const invalidData = { name: 'John', age: '30', isActive: true }; // age is string, not number
      const result = guardWithTolerance(invalidData, isUser);

      expect(result).toBe(invalidData);
      // TypeScript types it as User, even though it's actually invalid
      expect((result as any).age).toBe('30'); // Still the original invalid value
    });

    it('should call error callback when validation fails', () => {
      const mockCallback = jest.fn();
      const config = {
        callbackOnError: mockCallback,
        identifier: 'userData',
      };

      const invalidData = { name: 'John', age: '30', isActive: true };
      const result = guardWithTolerance(invalidData, isUser, config);

      expect(result).toBe(invalidData);
      expect(mockCallback).toHaveBeenCalled();
      expect(mockCallback.mock.calls[0][0]).toContain('userData.age');
    });

    it('should handle completely invalid data types', () => {
      const mockCallback = jest.fn();
      const config = {
        callbackOnError: mockCallback,
        identifier: 'userData',
      };

      const invalidData = 'not an object';
      const result = guardWithTolerance(invalidData, isUser, config);

      expect(result).toBe(invalidData);
      expect(mockCallback).toHaveBeenCalled();
    });

    it('should handle null data', () => {
      const mockCallback = jest.fn();
      const config = {
        callbackOnError: mockCallback,
        identifier: 'userData',
      };

      const result = guardWithTolerance(null, isUser, config);

      expect(result).toBe(null);
      expect(mockCallback).toHaveBeenCalled();
    });

    it('should handle undefined data', () => {
      const mockCallback = jest.fn();
      const config = {
        callbackOnError: mockCallback,
        identifier: 'userData',
      };

      const result = guardWithTolerance(undefined, isUser, config);

      expect(result).toBe(undefined);
      expect(mockCallback).toHaveBeenCalled();
    });
  });

  describe('error callback behavior', () => {
    it('should work without config', () => {
      const invalidData = { name: 'John', age: '30', isActive: true };
      const result = guardWithTolerance(invalidData, isUser);

      expect(result).toBe(invalidData);
    });

    it('should work with null config', () => {
      const invalidData = { name: 'John', age: '30', isActive: true };
      const result = guardWithTolerance(invalidData, isUser, null);

      expect(result).toBe(invalidData);
    });

    it('should collect multiple validation errors', () => {
      const errors: string[] = [];
      const config = {
        callbackOnError: (error: string) => errors.push(error),
        identifier: 'userData',
      };

      const invalidData = { name: 123, age: '30', isActive: 'true' }; // All wrong types
      const result = guardWithTolerance(invalidData, isUser, config);

      expect(result).toBe(invalidData);
      expect(errors.length).toBeGreaterThan(0);
      // Should have collected errors for multiple fields
    });
  });

  describe('primitive type guards', () => {
    it('should work with string type guard', () => {
      const invalidData = 123;
      const result = guardWithTolerance(invalidData, isString);

      expect(result).toBe(invalidData);
    });

    it('should work with number type guard', () => {
      const validData = 42;
      const result = guardWithTolerance(validData, isNumber);

      expect(result).toBe(validData);
    });

    it('should handle primitive validation errors', () => {
      const mockCallback = jest.fn();
      const config = {
        callbackOnError: mockCallback,
        identifier: 'value',
      };

      const invalidData = 123;
      const result = guardWithTolerance(invalidData, isString, config);

      expect(result).toBe(invalidData);
      expect(mockCallback).toHaveBeenCalled();
      expect(mockCallback.mock.calls[0][0]).toContain('value');
    });
  });

  describe('nested object validation', () => {
    interface NestedUser {
      name: string;
      profile: {
        bio: string;
        age: number;
      };
    }

    const isNestedUser = isType<NestedUser>({
      name: isString,
      profile: isType({
        bio: isString,
        age: isNumber,
      }),
    });

    it('should handle nested validation errors', () => {
      const errors: string[] = [];
      const config = {
        callbackOnError: (error: string) => errors.push(error),
        identifier: 'user',
        errorMode: 'multi' as const, // Use multi mode to get detailed nested errors
      };

      const invalidData = {
        name: 'John',
        profile: {
          bio: 'Developer',
          age: '30', // Should be number
        },
      };

      const result = guardWithTolerance(invalidData, isNestedUser, config);

      expect(result).toBe(invalidData);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('user.profile.age');
    });

    it('should return nested data even when validation fails', () => {
      const invalidData = {
        name: 'John',
        profile: {
          bio: 123, // Should be string
          age: '30', // Should be number
        },
      };

      const result = guardWithTolerance(invalidData, isNestedUser);

      expect(result).toBe(invalidData);
      expect((result as any).profile.bio).toBe(123);
      expect((result as any).profile.age).toBe('30');
    });
  });

  describe('use case scenarios', () => {
    it('should demonstrate logging validation errors while proceeding', () => {
      const validationErrors: string[] = [];

      // Simulate data from an unreliable API
      const apiData = {
        name: 'John Doe',
        age: '30', // API returned string instead of number
        isActive: 1, // API returned number instead of boolean
      };

      const user = guardWithTolerance(apiData, isUser, {
        identifier: 'apiResponse',
        callbackOnError: error => {
          validationErrors.push(error);
          // In real world, you might log to monitoring service
          console.warn('Validation warning:', error);
        },
      });

      // You can still access the data (with caution)
      expect(user.name).toBe('John Doe'); // This works fine
      expect((user as any).age).toBe('30'); // Need to handle potential string
      expect((user as any).isActive).toBe(1); // Need to handle potential number

      // But you have awareness of the issues
      expect(validationErrors.length).toBeGreaterThan(0);
    });

    it('should work for gradual migration scenarios', () => {
      // When migrating from untyped to typed code, you can use guardWithTolerance
      // to start logging validation issues while maintaining existing behavior

      const legacyData = {
        name: 'Legacy User',
        age: '25', // Legacy system uses strings for numbers
        isActive: 'true', // Legacy system uses strings for booleans
      };

      const migrationLogs: string[] = [];
      const user = guardWithTolerance(legacyData, isUser, {
        identifier: 'legacyData',
        callbackOnError: error => migrationLogs.push(error),
      });

      // System continues to work with legacy data
      expect(user).toBe(legacyData);

      // But you're aware of what needs to be fixed
      expect(migrationLogs.length).toBeGreaterThan(0);
    });
  });
});
