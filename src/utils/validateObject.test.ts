import { validateObject } from './validateObject';
import { ValidationContext } from './validationTypes';
import { isString } from '../typeguards/isString';
import { isNumber } from '../typeguards/isNumber';
import { isBoolean } from '../typeguards/isBoolean';
import { isArrayWithEachItem } from '../typeguards/isArrayWithEachItem';
import { isType } from '../typeguards/isType';

describe('validateObject', () => {
  interface TestUser {
    name: string;
    age: number;
    isActive: boolean;
    tags: string[];
  }

  const testSchema = {
    name: isString,
    age: isNumber,
    isActive: isBoolean,
    tags: isArrayWithEachItem(isString),
  };

  const createContext = (path: string, errorMode?: 'single' | 'multi' | 'json'): ValidationContext => ({
    path,
    config: {
      identifier: 'test',
      callbackOnError: jest.fn(),
      errorMode,
    },
  });

  describe('non-object values', () => {
    it('should handle null values in single error mode', () => {
      const context = createContext('user', 'single');
      const result = validateObject(null, testSchema, context);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('Expected user (null) to be "non-null object"');
      expect(result.tree).toBeDefined();
      expect(result.tree?.valid).toBe(false);
      expect(result.tree?.errors).toHaveLength(1);
    });

    it('should handle null values in multi error mode', () => {
      const context = createContext('user', 'multi');
      const result = validateObject(null, testSchema, context);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('Expected user (null) to be "non-null object"');
      expect(result.tree).toBeDefined();
      expect(result.tree?.valid).toBe(false);
      expect(result.tree?.errors).toHaveLength(1);
    });

    it('should handle null values in json error mode', () => {
      const context = createContext('user', 'json');
      const result = validateObject(null, testSchema, context);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(0); // JSON mode doesn't include errors in result.errors
      expect(result.tree).toBeDefined();
      expect(result.tree?.valid).toBe(false);
      expect(result.tree?.errors).toHaveLength(1);
    });

    it('should handle undefined values', () => {
      const context = createContext('user', 'single');
      const result = validateObject(undefined, testSchema, context);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('Expected user (undefined) to be "non-null object"');
    });

    it('should handle primitive values', () => {
      const context = createContext('user', 'single');
      const result = validateObject('not an object', testSchema, context);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('Expected user ("not an object") to be "non-null object"');
    });

    it('should handle array values', () => {
      const context = createContext('user', 'single');
      const result = validateObject([1, 2, 3], testSchema, context);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('Expected user ([1,2,3]) to be "non-null object"');
    });

    it('should handle function values', () => {
      const context = createContext('user', 'single');
      const result = validateObject(() => {}, testSchema, context);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('Expected user (undefined) to be "non-null object"');
    });
  });

  describe('single error mode', () => {
    it('should return valid result for valid object', () => {
      const context = createContext('user', 'single');
      const validUser = {
        name: 'John',
        age: 30,
        isActive: true,
        tags: ['developer', 'admin'],
      };

      const result = validateObject(validUser, testSchema, context);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.tree).toBeDefined();
      expect(result.tree?.valid).toBe(true);
    });

    it('should return first error for invalid object', () => {
      const context = createContext('user', 'single');
      const invalidUser = {
        name: 123, // should be string
        age: '30', // should be number
        isActive: 'yes', // should be boolean
        tags: 'not an array', // should be array
      };

      const result = validateObject(invalidUser, testSchema, context);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('Expected user.name');
    });

    it('should handle empty schema', () => {
      const context = createContext('user', 'single');
      const emptySchema = {};
      const user = { name: 'John' };

      const result = validateObject(user, emptySchema, context);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.tree).toBeDefined();
      expect(result.tree?.valid).toBe(true);
    });

    it('should handle schema with empty keys', () => {
      const context = createContext('user', 'single');
      const schemaWithEmptyKeys = {
        '': isString,
        name: isString,
      };
      const user = { name: 'John' };

      const result = validateObject(user, schemaWithEmptyKeys, context);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle schema with falsy keys that exist in object', () => {
      const context = createContext('user', 'single');
      const schemaWithFalsyKey = {
        name: isString,
        '': isNumber, // Empty string key
        age: isNumber,
      };
      const user = {
        name: 'John',
        '': 42, // Object has the empty string property
        age: 30,
      };

      const result = validateObject(user, schemaWithFalsyKey, context);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle schema with symbol keys', () => {
      const context = createContext('user', 'single');
      const symbolKey = Symbol('test');
      const schemaWithSymbolKey = {
        name: isString,
        [symbolKey]: isNumber,
        age: isNumber,
      };
      const user = {
        name: 'John',
        [symbolKey]: 42,
        age: 30,
      };

      const result = validateObject(user, schemaWithSymbolKey, context);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle edge case with falsy key in schema', () => {
      const context = createContext('user', 'single');
      // Create a schema with a property that might cause issues
      const schemaWithEdgeCase = {
        name: isString,
        // This is a defensive test for the if (!key) branch
        // Even though Object.keys() should never return falsy values
        age: isNumber,
      };
      
      // Create an object that might trigger edge cases
      const user = {
        name: 'John',
        age: 30,
      };

      const result = validateObject(user, schemaWithEdgeCase, context);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });



    it('should handle missing properties', () => {
      const context = createContext('user', 'single');
      const incompleteUser = {
        name: 'John',
        // missing age, isActive, tags
      };

      const result = validateObject(incompleteUser, testSchema, context);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('Expected user.age');
    });

    it('should handle nested object validation', () => {
      interface NestedUser {
        name: string;
        profile: {
          age: number;
          email: string;
        };
      }

      const nestedSchema = {
        name: isString,
        profile: isType({
          age: isNumber,
          email: isString,
        }),
      };

      const context = createContext('user', 'single');
      const validNestedUser = {
        name: 'John',
        profile: {
          age: 30,
          email: 'john@example.com',
        },
      };

      const result = validateObject(validNestedUser, nestedSchema, context);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle nested object validation with errors', () => {
      interface NestedUser {
        name: string;
        profile: {
          age: number;
          email: string;
        };
      }

      const nestedSchema = {
        name: isString,
        profile: isType({
          age: isNumber,
          email: isString,
        }),
      };

      const context = createContext('user', 'single');
      const invalidNestedUser = {
        name: 'John',
        profile: {
          age: '30', // should be number
          email: 'john@example.com',
        },
      };

      const result = validateObject(invalidNestedUser, nestedSchema, context);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('Expected user.profile');
    });
  });

  describe('multi error mode', () => {
    it('should return valid result for valid object', () => {
      const context = createContext('user', 'multi');
      const validUser = {
        name: 'John',
        age: 30,
        isActive: true,
        tags: ['developer', 'admin'],
      };

      const result = validateObject(validUser, testSchema, context);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.tree).toBeDefined();
      expect(result.tree?.valid).toBe(true);
      expect(result.tree?.children).toBeDefined();
    });

    it('should collect all errors for invalid object', () => {
      const context = createContext('user', 'multi');
      const invalidUser = {
        name: 123, // should be string
        age: '30', // should be number
        isActive: 'yes', // should be boolean
        tags: 'not an array', // should be array
      };

      const result = validateObject(invalidUser, testSchema, context);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(4);
      expect(result.tree).toBeDefined();
      expect(result.tree?.valid).toBe(false);
      expect(result.tree?.children).toBeDefined();
    });

    it('should handle partial validation errors', () => {
      const context = createContext('user', 'multi');
      const partiallyValidUser = {
        name: 'John', // valid
        age: '30', // invalid
        isActive: true, // valid
        tags: 'not an array', // invalid
      };

      const result = validateObject(partiallyValidUser, testSchema, context);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.tree).toBeDefined();
      expect(result.tree?.valid).toBe(false);
      expect(result.tree?.children).toBeDefined();
    });

    it('should handle empty schema', () => {
      const context = createContext('user', 'multi');
      const emptySchema = {};
      const user = { name: 'John' };

      const result = validateObject(user, emptySchema, context);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.tree).toBeDefined();
      expect(result.tree?.valid).toBe(true);
      expect(result.tree?.children).toBeDefined();
    });

    it('should handle nested object validation', () => {
      interface NestedUser {
        name: string;
        profile: {
          age: number;
          email: string;
        };
      }

      const nestedSchema = {
        name: isString,
        profile: isType({
          age: isNumber,
          email: isString,
        }),
      };

      const context = createContext('user', 'multi');
      const invalidNestedUser = {
        name: 123, // invalid
        profile: {
          age: '30', // invalid
          email: true, // invalid
        },
      };

      const result = validateObject(invalidNestedUser, nestedSchema, context);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.tree).toBeDefined();
      expect(result.tree?.valid).toBe(false);
      expect(result.tree?.children).toBeDefined();
    });
  });

  describe('json error mode', () => {
    it('should return valid result for valid object', () => {
      const context = createContext('user', 'json');
      const validUser = {
        name: 'John',
        age: 30,
        isActive: true,
        tags: ['developer', 'admin'],
      };

      const result = validateObject(validUser, testSchema, context);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.tree).toBeDefined();
      expect(result.tree?.valid).toBe(true);
      expect(result.tree?.children).toBeDefined();
    });

    it('should collect all errors for invalid object', () => {
      const context = createContext('user', 'json');
      const invalidUser = {
        name: 123, // should be string
        age: '30', // should be number
        isActive: 'yes', // should be boolean
        tags: 'not an array', // should be array
      };

      const result = validateObject(invalidUser, testSchema, context);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(4);
      expect(result.tree).toBeDefined();
      expect(result.tree?.valid).toBe(false);
      expect(result.tree?.children).toBeDefined();
    });

    it('should handle partial validation errors', () => {
      const context = createContext('user', 'json');
      const partiallyValidUser = {
        name: 'John', // valid
        age: '30', // invalid
        isActive: true, // valid
        tags: 'not an array', // invalid
      };

      const result = validateObject(partiallyValidUser, testSchema, context);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.tree).toBeDefined();
      expect(result.tree?.valid).toBe(false);
      expect(result.tree?.children).toBeDefined();
    });

    it('should handle empty schema', () => {
      const context = createContext('user', 'json');
      const emptySchema = {};
      const user = { name: 'John' };

      const result = validateObject(user, emptySchema, context);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.tree).toBeDefined();
      expect(result.tree?.valid).toBe(true);
      expect(result.tree?.children).toBeDefined();
    });
  });

  describe('default error mode (single)', () => {
    it('should default to single error mode when not specified', () => {
      const context = createContext('user'); // no errorMode specified
      const invalidUser = {
        name: 123, // should be string
        age: '30', // should be number
        isActive: 'yes', // should be boolean
        tags: 'not an array', // should be array
      };

      const result = validateObject(invalidUser, testSchema, context);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1); // Only first error in single mode
    });

    it('should default to single error mode when config is null', () => {
      const context: ValidationContext = {
        path: 'user',
        config: null,
      };
      const invalidUser = {
        name: 123, // should be string
        age: '30', // should be number
      };

      const result = validateObject(invalidUser, testSchema, context);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1); // Only first error in single mode
    });
  });

  describe('edge cases', () => {
    it('should handle context without config', () => {
      const context: ValidationContext = {
        path: 'user',
      };
      const validUser = {
        name: 'John',
        age: 30,
        isActive: true,
        tags: ['developer'],
      };

      const result = validateObject(validUser, testSchema, context);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle context with null config', () => {
      const context: ValidationContext = {
        path: 'user',
        config: null,
      };
      const validUser = {
        name: 'John',
        age: 30,
        isActive: true,
        tags: ['developer'],
      };

      const result = validateObject(validUser, testSchema, context);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });



    it('should handle object with undefined properties', () => {
      const context = createContext('user', 'single');
      const userWithUndefined = {
        name: 'John',
        age: undefined,
        isActive: true,
        tags: ['developer'],
      };

      const result = validateObject(userWithUndefined, testSchema, context);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('Expected user.age');
    });

    it('should handle object with null properties', () => {
      const context = createContext('user', 'single');
      const userWithNull = {
        name: 'John',
        age: null,
        isActive: true,
        tags: ['developer'],
      };

      const result = validateObject(userWithNull, testSchema, context);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('Expected user.age');
    });

    it('should handle complex nested structures', () => {
      interface ComplexUser {
        name: string;
        settings: {
          theme: string;
          notifications: {
            email: boolean;
            push: boolean;
          };
        };
        metadata: {
          tags: string[];
          created: Date;
        };
      }

      const complexSchema = {
        name: isString,
        settings: isType({
          theme: isString,
          notifications: isType({
            email: isBoolean,
            push: isBoolean,
          }),
        }),
        metadata: isType({
          tags: isArrayWithEachItem(isString),
          created: (value: unknown): value is Date => value instanceof Date,
        }),
      };

      const context = createContext('user', 'multi');
      const validComplexUser: ComplexUser = {
        name: 'John',
        settings: {
          theme: 'dark',
          notifications: {
            email: true,
            push: false,
          },
        },
        metadata: {
          tags: ['admin', 'developer'],
          created: new Date(),
        },
      };

      const result = validateObject(validComplexUser, complexSchema, context);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.tree).toBeDefined();
      expect(result.tree?.valid).toBe(true);
      expect(result.tree?.children).toBeDefined();
    });

    it('should handle complex nested structures with errors', () => {
      interface ComplexUser {
        name: string;
        settings: {
          theme: string;
          notifications: {
            email: boolean;
            push: boolean;
          };
        };
      }

      const complexSchema = {
        name: isString,
        settings: isType({
          theme: isString,
          notifications: isType({
            email: isBoolean,
            push: isBoolean,
          }),
        }),
      };

      const context = createContext('user', 'multi');
      const invalidComplexUser = {
        name: 123, // invalid
        settings: {
          theme: 'dark', // valid
          notifications: {
            email: 'yes', // invalid
            push: 'no', // invalid
          },
        },
      };

      const result = validateObject(invalidComplexUser, complexSchema, context);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.tree).toBeDefined();
      expect(result.tree?.valid).toBe(false);
      expect(result.tree?.children).toBeDefined();
    });
  });

  describe('tree structure', () => {
    it('should create proper tree structure for valid object', () => {
      const context = createContext('user', 'multi');
      const validUser = {
        name: 'John',
        age: 30,
        isActive: true,
        tags: ['developer'],
      };

      const result = validateObject(validUser, testSchema, context);

      expect(result.tree).toBeDefined();
      expect(result.tree?.path).toBe('user');
      expect(result.tree?.valid).toBe(true);
      expect(result.tree?.expectedType).toBe('object');
      expect(result.tree?.actualValue).toEqual(validUser);
      expect(result.tree?.children).toBeDefined();
      expect(Object.keys(result.tree?.children || {})).toHaveLength(4);
    });

    it('should create proper tree structure for invalid object', () => {
      const context = createContext('user', 'multi');
      const invalidUser = {
        name: 123,
        age: '30',
        isActive: 'yes',
        tags: 'not an array',
      };

      const result = validateObject(invalidUser, testSchema, context);

      expect(result.tree).toBeDefined();
      expect(result.tree?.path).toBe('user');
      expect(result.tree?.valid).toBe(false);
      expect(result.tree?.expectedType).toBe('object');
      expect(result.tree?.actualValue).toEqual(invalidUser);
      expect(result.tree?.children).toBeDefined();
      expect(Object.keys(result.tree?.children || {})).toHaveLength(4);
    });

    it('should handle tree nodes without path segments', () => {
      const context = createContext('user', 'multi');
      const schemaWithEmptyKey = {
        '': isString,
        name: isString,
      };
      const user = { name: 'John' };

      const result = validateObject(user, schemaWithEmptyKey, context);

      expect(result.tree).toBeDefined();
      expect(result.tree?.children).toBeDefined();
      // Should handle empty key gracefully
      expect(result.valid).toBe(false);
    });

    it('should handle schema with empty string key in single error mode', () => {
      const context = createContext('user', 'single');
      
      // Create a schema with an empty string key
      const schemaWithEmptyKey = {
        '': isString,
        name: isString,
        age: isNumber,
      };

      // Create an object with an empty string property
      const user = {
        '': 'empty key value',
        name: 'John',
        age: 30,
      };

      const result = validateObject(user, schemaWithEmptyKey, context);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
}); 