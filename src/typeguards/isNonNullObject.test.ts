import { isNonNullObject } from './isNonNullObject';

describe('isNonNullObject', () => {
  describe('basic validation', () => {
    it('should return true for non-null objects', () => {
      expect(isNonNullObject({})).toBe(true);
      expect(isNonNullObject({ key: 'value' })).toBe(true);
      expect(isNonNullObject({ nested: { prop: 123 } })).toBe(true);
      expect(isNonNullObject(new Date())).toBe(true);
      expect(isNonNullObject(new Error('test'))).toBe(true);
    });

    it('should return false for null and non-objects', () => {
      expect(isNonNullObject(null)).toBe(false);
      expect(isNonNullObject(undefined)).toBe(false);
      expect(isNonNullObject('string')).toBe(false);
      expect(isNonNullObject(123)).toBe(false);
      expect(isNonNullObject(true)).toBe(false);
      expect(isNonNullObject(false)).toBe(false);
      expect(isNonNullObject([])).toBe(false);
      expect(isNonNullObject(() => {})).toBe(false);
      expect(isNonNullObject(Symbol('test'))).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should handle TypeGuardFn config for error reporting', () => {
      const errors: string[] = [];
      const config = {
        callbackOnError: (error: string) => errors.push(error),
        identifier: 'testObject',
      };

      const result = isNonNullObject('not an object', config);

      expect(result).toBe(false);
      expect(errors.length).toBe(1);
      expect(errors[0]).toBe('Expected testObject ("not an object") to be "non-null object"');
    });

    it('should not call error callback for valid objects', () => {
      const errors: string[] = [];
      const config = {
        callbackOnError: (error: string) => errors.push(error),
        identifier: 'testObject',
      };

      const result = isNonNullObject({ valid: true }, config);

      expect(result).toBe(true);
      expect(errors.length).toBe(0);
    });

    it('should handle null values with proper error message', () => {
      const errors: string[] = [];
      const config = {
        callbackOnError: (error: string) => errors.push(error),
        identifier: 'user',
      };

      const result = isNonNullObject(null, config);

      expect(result).toBe(false);
      expect(errors.length).toBe(1);
      expect(errors[0]).toBe('Expected user (null) to be "non-null object"');
    });

    it('should handle undefined values with proper error message', () => {
      const errors: string[] = [];
      const config = {
        callbackOnError: (error: string) => errors.push(error),
        identifier: 'config',
      };

      const result = isNonNullObject(undefined, config);

      expect(result).toBe(false);
      expect(errors.length).toBe(1);
      expect(errors[0]).toBe('Expected config (undefined) to be "non-null object"');
    });

    it('should handle primitive values with proper error message', () => {
      const errors: string[] = [];
      const config = {
        callbackOnError: (error: string) => errors.push(error),
        identifier: 'data',
      };

      const result = isNonNullObject(42, config);

      expect(result).toBe(false);
      expect(errors.length).toBe(1);
      expect(errors[0]).toBe('Expected data (42) to be "non-null object"');
    });

    it('should handle arrays with proper error message', () => {
      const errors: string[] = [];
      const config = {
        callbackOnError: (error: string) => errors.push(error),
        identifier: 'items',
      };

      const result = isNonNullObject([1, 2, 3], config);

      expect(result).toBe(false);
      expect(errors.length).toBe(1);
      expect(errors[0]).toContain('Expected items');
      expect(errors[0]).toContain('to be "non-null object"');
    });

    it('should work without config', () => {
      const result = isNonNullObject('test');
      expect(result).toBe(false);
    });

    it('should work with null config', () => {
      const result = isNonNullObject('test', null);
      expect(result).toBe(false);
    });
  });

  describe('real-world use cases', () => {
    it('should validate API response objects', () => {
      const errors: string[] = [];
      const config = {
        callbackOnError: (error: string) => errors.push(error),
        identifier: 'apiResponse',
      };

      // Valid API response
      expect(isNonNullObject({ data: [], status: 200 }, config)).toBe(true);
      expect(errors.length).toBe(0);

      // Invalid API response (string instead of object)
      expect(isNonNullObject('error message', config)).toBe(false);
      expect(errors.length).toBe(1);
      expect(errors[0]).toContain('Expected apiResponse');
    });

    it('should validate user profile objects', () => {
      const errors: string[] = [];
      const config = {
        callbackOnError: (error: string) => errors.push(error),
        identifier: 'userProfile',
      };

      // Valid user profile
      expect(isNonNullObject({ name: 'John', age: 30 }, config)).toBe(true);
      expect(errors.length).toBe(0);

      // Invalid user profile (null)
      expect(isNonNullObject(null, config)).toBe(false);
      expect(errors.length).toBe(1);
      expect(errors[0]).toContain('Expected userProfile');
    });

    it('should validate configuration objects', () => {
      const errors: string[] = [];
      const config = {
        callbackOnError: (error: string) => errors.push(error),
        identifier: 'appConfig',
      };

      // Valid config
      expect(isNonNullObject({ port: 3000, debug: true }, config)).toBe(true);
      expect(errors.length).toBe(0);

      // Invalid config (undefined)
      expect(isNonNullObject(undefined, config)).toBe(false);
      expect(errors.length).toBe(1);
      expect(errors[0]).toContain('Expected appConfig');
    });
  });

  describe('edge cases', () => {
    it('should handle objects with null prototype', () => {
      const obj = Object.create(null);
      obj.prop = 'value';
      
      expect(isNonNullObject(obj)).toBe(true);
    });

    it('should handle objects with custom prototype', () => {
      class CustomClass {
        constructor(public value: string) {}
      }
      
      const customObj = new CustomClass('test');
      expect(isNonNullObject(customObj)).toBe(true);
    });

    it('should handle Date objects', () => {
      expect(isNonNullObject(new Date())).toBe(true);
    });

    it('should handle Error objects', () => {
      expect(isNonNullObject(new Error('test'))).toBe(true);
    });

    it('should handle RegExp objects', () => {
      expect(isNonNullObject(/test/)).toBe(true);
    });

    it('should handle Function objects (which are objects)', () => {
      const func = function() {};
      // Functions are objects in JavaScript, but isNonNullObject excludes them
      // This is the intended behavior to distinguish between plain objects and functions
      expect(isNonNullObject(func)).toBe(false);
    });

    it('should handle empty objects', () => {
      expect(isNonNullObject({})).toBe(true);
    });

    it('should handle objects with only undefined properties', () => {
      const obj = { prop: undefined };
      expect(isNonNullObject(obj)).toBe(true);
    });
  });

  describe('type narrowing', () => {
    it('should narrow type correctly', () => {
      const value: unknown = { name: 'John', age: 30 };
      
      if (isNonNullObject(value)) {
        // TypeScript should know that value is a non-null object here
        expect(typeof value).toBe('object');
        expect(value.name).toBe('John');
        expect(value.age).toBe(30);
      } else {
        fail('Should not reach here');
      }
    });

    it('should work with union types', () => {
      const value: string | { name: string } | null = { name: 'John' };
      
      if (isNonNullObject(value)) {
        // TypeScript should know that value is { name: string }
        expect(value.name).toBe('John');
      } else {
        fail('Should not reach here');
      }
    });
  });
});
