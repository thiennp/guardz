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

      interface SimpleTestUser {
        name: string;
        age: number;
      }

      const isSimpleTestUser = isType<SimpleTestUser>({
        name: isString,
        age: isNumber,
      });

      const result = isSimpleTestUser('not an object', config);

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
      // In single error mode, we expect a simple error about the nested object
      expect(errors[0]).toContain('user.details');
    });

    it('should collect multiple errors instead of stopping at first failure', () => {
      const errors: string[] = [];
      const config = {
        callbackOnError: (error: string) => errors.push(error),
        identifier: 'user',
        errorMode: 'multi' as const,
      };

      interface TestUser {
        name: string;
        age: number;
        isActive: boolean;
        tags: string[];
        profile?: string;
      }

      const isTestUser = isType<TestUser>({
        name: isString,
        age: isNumber,
        isActive: isBoolean,
        tags: isArrayWithEachItem(isString),
        profile: isUndefinedOr(isString),
      });

      const invalidUser = {
        name: 123, // should be string
        age: '30', // should be number
        isActive: 'yes', // should be boolean
        tags: 'not an array', // should be array
        profile: 456, // should be string or undefined
      };

      const result = isTestUser(invalidUser, config);

      expect(result).toBe(false);
      // Should collect all errors in a single message separated by semicolons
      expect(errors.length).toBe(1);
      const combinedError = errors[0];
      expect(combinedError).toContain('Expected user.name (123) to be "string"');
      expect(combinedError).toContain('Expected user.age ("30") to be "number"');
      expect(combinedError).toContain('Expected user.isActive ("yes") to be "boolean"');
      expect(combinedError).toContain('Expected user.tags ("not an array") to be "Array"');
      expect(combinedError).toContain('Expected user.profile (456) to be "object"');
      expect(combinedError).toMatch(/; /); // Should contain semicolon separators
    });

    it('should collect multiple errors in nested objects', () => {
      const errors: string[] = [];
      const config = {
        callbackOnError: (error: string) => errors.push(error),
        identifier: 'user',
        errorMode: 'multi' as const,
      };

      interface NestedUser {
        name: string;
        details: {
          age: number;
          email: string;
          phone: string;
        };
        settings: {
          notifications: boolean;
          theme: string;
        };
      }

      const isNestedUser = isType<NestedUser>({
        name: isString,
        details: isType({
          age: isNumber,
          email: isString,
          phone: isString,
        }),
        settings: isType({
          notifications: isBoolean,
          theme: isString,
        }),
      });

      const invalidUser = {
        name: 123, // should be string
        details: {
          age: '30', // should be number
          email: true, // should be string
          phone: 456, // should be string
        },
        settings: {
          notifications: 'true', // should be boolean
          theme: 789, // should be string
        },
      };

      const result = isNestedUser(invalidUser, config);

      expect(result).toBe(false);
      // Should collect all errors in a single message separated by semicolons
      expect(errors.length).toBe(1);
      const combinedError = errors[0];
      expect(combinedError).toContain('Expected user.name (123) to be "string"');
      expect(combinedError).toContain('Expected user.details ({"age":"30","email":true,"phone":456}) to be "object"');
      expect(combinedError).toContain('Expected user.settings ({"notifications":"true","theme":789}) to be "object"');
      expect(combinedError).toMatch(/; /); // Should contain semicolon separators
    });

    it('should support JSON tree error format', () => {
      const errors: string[] = [];
      const config = {
        callbackOnError: (error: string) => errors.push(error),
        identifier: 'user',
        errorMode: 'json' as const,
      };

      interface TestUser {
        id: number;
        name: string;
        email: string;
        isActive: boolean;
      }

      const isTestUser = isType<TestUser>({
        id: isNumber,
        name: isString,
        email: isString,
        isActive: isBoolean,
      });

      const invalidUser = {
        id: '1', // should be number
        name: 123, // should be string
        email: true, // should be string
        isActive: 'yes', // should be boolean
      };

      const result = isTestUser(invalidUser, config);

      expect(result).toBe(false);
      // In JSON tree mode, we get both individual errors and the tree
      expect(errors.length).toBe(1);

      console.log(errors);
      
      // Find the JSON tree error (it will be the last one)
      const jsonTreeError = errors[0];
      const errorTree = JSON.parse(jsonTreeError);
      expect(errorTree).toMatchObject({
        user: {
          valid: false,
          value: {
            id: {
              valid: false,
              value: '1',
              expectedType: 'number'
            },
            name: {
              valid: false,
              value: 123,
              expectedType: 'string'
            },
            email: {
              valid: false,
              value: true,
              expectedType: 'string'
            },
            isActive: {
              valid: false,
              value: 'yes',
              expectedType: 'boolean'
            }
          }
        }
      });
    });

    it('should support JSON tree format for nested objects', () => {
      const errors: string[] = [];
      const config = {
        callbackOnError: (error: string) => errors.push(error),
        identifier: 'user',
        errorMode: 'json' as const,
      };

      interface NestedUser {
        name: string;
        profile: {
          age: number;
          email: string;
        };
        settings: {
          notifications: boolean;
        };
      }

      const isNestedUser = isType<NestedUser>({
        name: isString,
        profile: isType({
          age: isNumber,
          email: isString,
        }),
        settings: isType({
          notifications: isBoolean,
        }),
      });

      const invalidUser = {
        name: 123, // should be string
        profile: {
          age: '25', // should be number
          email: true, // should be string
        },
        settings: {
          notifications: 'yes', // should be boolean
        },
      };

      const result = isNestedUser(invalidUser, config);

      expect(result).toBe(false);
      // In JSON tree mode, we get both individual errors and the tree
      expect(errors.length).toBeGreaterThan(1);
      
      // Find the JSON tree error (it will be the last one)
      const jsonTreeError = errors[errors.length - 1];
      const errorTree = JSON.parse(jsonTreeError);
      expect(errorTree).toMatchObject({
        user: {
          valid: false,
          value: {
            name: {
              valid: false,
              value: 123,
              expectedType: 'string'
            },
            profile: {
              valid: false,
              value: {
                age: '25',
                email: true
              },
              expectedType: 'object'
            },
            settings: {
              valid: false,
              value: {
                notifications: 'yes'
              },
              expectedType: 'object'
            }
          }
        }
      });
    });

    it('should default to multi error mode when errorMode is not specified', () => {
      const errors: string[] = [];
      const config = {
        callbackOnError: (error: string) => errors.push(error),
        identifier: 'user',
        // errorMode not specified - should default to multi error mode
      };

      const invalidUser = {
        name: 123, // should be string
        age: '30', // should be number
      };

      const result = isSimpleUser(invalidUser, config);

      expect(result).toBe(false);
      // Should collect all errors in a single message (multi error mode)
      expect(errors.length).toBe(1);
      const combinedError = errors[0];
      expect(combinedError).toContain('Expected user.name (123) to be "string"');
      expect(combinedError).toContain('Expected user.age ("30") to be "number"');
      expect(combinedError).toMatch(/; /); // Should contain semicolon separators
    });

    it('should handle non-object values with JSON tree format', () => {
      const errors: string[] = [];
      const config = {
        callbackOnError: (error: string) => errors.push(error),
        identifier: 'user',
        errorMode: 'json' as const,
      };

      interface SimpleTestUser {
        name: string;
        age: number;
      }

      const isSimpleTestUser = isType<SimpleTestUser>({
        name: isString,
        age: isNumber,
      });

      const result = isSimpleTestUser('not an object', config);

      expect(result).toBe(false);
      expect(errors).toHaveLength(1);
      
      const errorTree = JSON.parse(errors[0]);
      expect(errorTree).toMatchObject({
        user: {
          valid: false,
          value: 'not an object',
          expectedType: 'non-null object'
        }
      });
    });

    it('should support JSON tree format for valid objects', () => {
      const errors: string[] = [];
      const config = {
        callbackOnError: (error: string) => errors.push(error),
        identifier: 'user',
        errorMode: 'json' as const,
      };

      interface ValidUser {
        id: number;
        name: string;
        email: string;
        isActive: boolean;
      }

      const isValidUser = isType<ValidUser>({
        id: isNumber,
        name: isString,
        email: isString,
        isActive: isBoolean,
      });

      const validUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        isActive: true,
      };

      const result = isValidUser(validUser, config);

      expect(result).toBe(true);
      // When validation passes, no errors should be collected
      expect(errors).toHaveLength(0);
    });

    it('should support JSON tree format for partially valid objects', () => {
      const errors: string[] = [];
      const config = {
        callbackOnError: (error: string) => errors.push(error),
        identifier: 'user',
        errorMode: 'json' as const,
      };

      interface MixedUser {
        id: number;
        name: string;
        email: string;
        isActive: boolean;
      }

      const isMixedUser = isType<MixedUser>({
        id: isNumber,
        name: isString,
        email: isString,
        isActive: isBoolean,
      });

      const mixedUser = {
        id: 1, // valid
        name: 'John Doe', // valid
        email: true, // invalid - should be string
        isActive: 'yes', // invalid - should be boolean
      };

      const result = isMixedUser(mixedUser, config);

      expect(result).toBe(false);
      expect(errors.length).toBeGreaterThan(0);
      
      const jsonTreeError = errors[errors.length - 1];
      const errorTree = JSON.parse(jsonTreeError);
      expect(errorTree).toMatchObject({
        user: {
          valid: false,
          value: {
            id: {
              valid: true,
              value: 1
            },
            name: {
              valid: true,
              value: 'John Doe'
            },
            email: {
              valid: false,
              value: true,
              expectedType: 'string'
            },
            isActive: {
              valid: false,
              value: 'yes',
              expectedType: 'boolean'
            }
          }
        }
      });
    });

    it('should provide JSON tree feedback in template literal format', () => {
      const errors: string[] = [];
      const config = {
        callbackOnError: (error: string) => errors.push(error),
        identifier: 'user',
        errorMode: 'json' as const,
      };

      interface TestUser {
        id: number;
        name: string;
        email: string;
        isActive: boolean;
      }

      const isTestUser = isType<TestUser>({
        id: isNumber,
        name: isString,
        email: isString,
        isActive: isBoolean,
      });

      const invalidUser = {
        id: '1', // should be number
        name: 123, // should be string
        email: true, // should be string
        isActive: 'yes', // should be boolean
      };

      const result = isTestUser(invalidUser, config);

      expect(result).toBe(false);
      expect(errors.length).toBe(1);

      const jsonTreeError = errors[0];
      
      // Test that the JSON tree is properly formatted as a template literal
      expect(jsonTreeError).toMatch(/^\{[\s\S]*\}$/); // Should be valid JSON
      
      // Test template literal formatting with proper indentation
      const expectedTemplateLiteral = `{
  "user": {
    "valid": false,
    "value": {
      "id": {
        "valid": false,
        "value": "1",
        "expectedType": "number"
      },
      "name": {
        "valid": false,
        "value": 123,
        "expectedType": "string"
      },
      "email": {
        "valid": false,
        "value": true,
        "expectedType": "string"
      },
      "isActive": {
        "valid": false,
        "value": "yes",
        "expectedType": "boolean"
      }
    }
  }
}`;

      const errorTree = JSON.parse(jsonTreeError);
      const formattedError = JSON.stringify(errorTree, null, 2);
      
      expect(formattedError).toBe(expectedTemplateLiteral);
    });

    it('should provide JSON tree feedback in template literal format for nested objects', () => {
      const errors: string[] = [];
      const config = {
        callbackOnError: (error: string) => errors.push(error),
        identifier: 'user',
        errorMode: 'json' as const,
      };

      interface NestedUser {
        name: string;
        profile: {
          age: number;
          email: string;
        };
        settings: {
          notifications: boolean;
        };
      }

      const isNestedUser = isType<NestedUser>({
        name: isString,
        profile: isType({
          age: isNumber,
          email: isString,
        }),
        settings: isType({
          notifications: isBoolean,
        }),
      });

      const invalidUser = {
        name: 123, // should be string
        profile: {
          age: '25', // should be number
          email: true, // should be string
        },
        settings: {
          notifications: 'yes', // should be boolean
        },
      };

      const result = isNestedUser(invalidUser, config);

      expect(result).toBe(false);
      expect(errors.length).toBeGreaterThan(1);
      
      const jsonTreeError = errors[errors.length - 1];
      
      // Test that the JSON tree is properly formatted as a template literal
      expect(jsonTreeError).toMatch(/^\{[\s\S]*\}$/); // Should be valid JSON
      
      // Test template literal formatting with proper indentation for nested objects
      const expectedTemplateLiteral = `{
  "user": {
    "valid": false,
    "value": {
      "name": {
        "valid": false,
        "value": 123,
        "expectedType": "string"
      },
      "profile": {
        "valid": false,
        "value": {
          "age": "25",
          "email": true
        },
        "expectedType": "object"
      },
      "settings": {
        "valid": false,
        "value": {
          "notifications": "yes"
        },
        "expectedType": "object"
      }
    }
  }
}`;

      const errorTree = JSON.parse(jsonTreeError);
      const formattedError = JSON.stringify(errorTree, null, 2);
      
      expect(formattedError).toBe(expectedTemplateLiteral);
    });

    it('should report only the first error in single error mode', () => {
      const errors: string[] = [];
      const config = {
        callbackOnError: (error: string) => errors.push(error),
        identifier: 'user',
        errorMode: 'single' as const,
      };

      interface TestUser {
        name: string;
        age: number;
        isActive: boolean;
      }

      const isTestUser = isType<TestUser>({
        name: isString,
        age: isNumber,
        isActive: isBoolean,
      });

      const invalidUser = {
        name: 123, // should be string
        age: '30', // should be number
        isActive: 'yes', // should be boolean
      };

      const result = isTestUser(invalidUser, config);

      expect(result).toBe(false);
      // Single mode should report only the first encountered error
      expect(errors.length).toBe(1);
      expect(errors[0]).toContain('Expected user.name (123) to be "string"');
    });

    it('should report nested path correctly in single error mode', () => {
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
        errorMode: 'single' as const,
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
      expect(errors.length).toBe(1);
      expect(errors[0]).toContain('user.details.age');
      expect(errors[0]).toContain('to be "number"');
    });

    it('should report non-object values properly in single error mode', () => {
      const errors: string[] = [];
      const config = {
        callbackOnError: (error: string) => errors.push(error),
        identifier: 'user',
        errorMode: 'single' as const,
      };

      interface SimpleTestUser {
        name: string;
        age: number;
      }

      const isSimpleTestUser = isType<SimpleTestUser>({
        name: isString,
        age: isNumber,
      });

      const result = isSimpleTestUser('not an object', config);

      expect(result).toBe(false);
      expect(errors.length).toBe(1);
      expect(errors[0]).toBe('Expected user ("not an object") to be "non-null object"');
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

  describe('config edge cases', () => {
    const isSimpleUser = isType<SimpleUser>({
      name: isString,
      age: isNumber,
    });

    it('should handle null config in multi error mode', () => {

      // Test with null config
      const result = isSimpleUser({ name: 'John', age: 30 }, null);
      expect(result).toBe(true);

      // Test with invalid object and null config
      const invalidResult = isSimpleUser({ name: 123, age: '30' }, null);
      expect(invalidResult).toBe(false);
    });

    it('should handle undefined config in multi error mode', () => {

      // Test with undefined config
      const result = isSimpleUser({ name: 'John', age: 30 }, undefined);
      expect(result).toBe(true);

      // Test with invalid object and undefined config
      const invalidResult = isSimpleUser({ name: 123, age: '30' }, undefined);
      expect(invalidResult).toBe(false);
    });

    it('should handle null config in json error mode', () => {

      // Test with null config
      const result = isSimpleUser({ name: 'John', age: 30 }, null);
      expect(result).toBe(true);

      // Test with invalid object and null config
      const invalidResult = isSimpleUser({ name: 123, age: '30' }, null);
      expect(invalidResult).toBe(false);
    });

    it('should handle undefined config in json error mode', () => {

      // Test with undefined config
      const result = isSimpleUser({ name: 'John', age: 30 }, undefined);
      expect(result).toBe(true);

      // Test with invalid object and undefined config
      const invalidResult = isSimpleUser({ name: 123, age: '30' }, undefined);
      expect(invalidResult).toBe(false);
    });

    it('should handle config without identifier in multi error mode', () => {
      const config = {
        callbackOnError: jest.fn(),
        identifier: 'test',
        errorMode: 'multi' as const,
      };

      const result = isSimpleUser({ name: 'John', age: 30 }, config);
      expect(result).toBe(true);

      const invalidResult = isSimpleUser({ name: 123, age: '30' }, config);
      expect(invalidResult).toBe(false);
    });

    it('should handle config without identifier in json error mode', () => {
      const config = {
        callbackOnError: jest.fn(),
        identifier: 'test',
        errorMode: 'json' as const,
      };

      const result = isSimpleUser({ name: 'John', age: 30 }, config);
      expect(result).toBe(true);

      const invalidResult = isSimpleUser({ name: 123, age: '30' }, config);
      expect(invalidResult).toBe(false);
    });

    it('should handle config with falsy identifier in multi error mode', () => {
      const config = {
        callbackOnError: jest.fn(),
        identifier: '',
        errorMode: 'multi' as const,
      };

      const result = isSimpleUser({ name: 'John', age: 30 }, config);
      expect(result).toBe(true);

      const invalidResult = isSimpleUser({ name: 123, age: '30' }, config);
      expect(invalidResult).toBe(false);
    });

    it('should handle config with falsy identifier in json error mode', () => {
      const config = {
        callbackOnError: jest.fn(),
        identifier: '',
        errorMode: 'json' as const,
      };

      const result = isSimpleUser({ name: 'John', age: 30 }, config);
      expect(result).toBe(true);

      const invalidResult = isSimpleUser({ name: 123, age: '30' }, config);
      expect(invalidResult).toBe(false);
    });



    it('should handle non-object values with null config in multi error mode', () => {

      const result = isSimpleUser('not an object', null);
      expect(result).toBe(false);
    });

    it('should handle non-object values with undefined config in json error mode', () => {

      const result = isSimpleUser('not an object', undefined);
      expect(result).toBe(false);
    });

    it('should handle nested objects with null config in multi error mode', () => {
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

      const validUser = {
        name: 'John',
        details: {
          age: 30,
          email: 'john@example.com',
        },
      };

      const result = isNestedUser(validUser, null);
      expect(result).toBe(true);

      const invalidUser = {
        name: 'John',
        details: {
          age: '30', // should be number
          email: 'john@example.com',
        },
      };

      const invalidResult = isNestedUser(invalidUser, null);
      expect(invalidResult).toBe(false);
    });

    it('should handle nested objects with undefined config in json error mode', () => {
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

      const validUser = {
        name: 'John',
        details: {
          age: 30,
          email: 'john@example.com',
        },
      };

      const result = isNestedUser(validUser, undefined);
      expect(result).toBe(true);

      const invalidUser = {
        name: 'John',
        details: {
          age: '30', // should be number
          email: 'john@example.com',
        },
      };

      const invalidResult = isNestedUser(invalidUser, undefined);
      expect(invalidResult).toBe(false);
    });
  });
});
