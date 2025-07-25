import { isSchema, isShape, isNestedType } from './isSchema';
import { isString } from './isString';
import { isNumber } from './isNumber';
import { isBoolean } from './isBoolean';
import { isArrayWithEachItem } from './isArrayWithEachItem';
import { isType } from './isType';
import { isUndefinedOr } from './isUndefinedOr';

import { isEnum } from './isEnum';
import { isDate } from './isDate';

import { isFunction } from './isFunction';

import { isPartialOf } from './isPartialOf';

describe('isSchema', () => {
  describe('basic nested object validation', () => {
    interface UserWithAddress {
      name: string;
      age: number;
      address: {
        street: string;
        city: string;
        zipCode: number;
      };
    }

    const isUserWithAddress = isSchema<UserWithAddress>({
      name: isString,
      age: isNumber,
      address: {
        street: isString,
        city: isString,
        zipCode: isNumber,
      },
    });

    it('should return true for valid nested objects', () => {
      const validUser: UserWithAddress = {
        name: 'John',
        age: 30,
        address: {
          street: '123 Main St',
          city: 'Springfield',
          zipCode: 12345,
        },
      };
      expect(isUserWithAddress(validUser)).toBe(true);
    });

    it('should return false for objects with invalid nested properties', () => {
      const invalidUser = {
        name: 'John',
        age: 30,
        address: {
          street: '123 Main St',
          city: 'Springfield',
          zipCode: '12345', // should be number
        },
      };
      expect(isUserWithAddress(invalidUser)).toBe(false);
    });

    it('should return false for objects with missing nested properties', () => {
      const invalidUser = {
        name: 'John',
        age: 30,
        address: {
          street: '123 Main St',
          city: 'Springfield',
          // missing zipCode
        },
      };
      expect(isUserWithAddress(invalidUser)).toBe(false);
    });

    it('should return false for null nested objects', () => {
      const invalidUser = {
        name: 'John',
        age: 30,
        address: null,
      };
      expect(isUserWithAddress(invalidUser)).toBe(false);
    });
  });

  describe('deeply nested object validation', () => {
    interface ComplexUser {
      id: number;
      profile: {
        name: string;
        email: string;
        preferences: {
          theme: string;
          notifications: {
            email: boolean;
            push: boolean;
          };
        };
      };
      settings: {
        language: string;
        timezone: string;
      };
    }

    const isComplexUser = isSchema<ComplexUser>({
      id: isNumber,
      profile: {
        name: isString,
        email: isString,
        preferences: {
          theme: isString,
          notifications: {
            email: isBoolean,
            push: isBoolean,
          },
        },
      },
      settings: {
        language: isString,
        timezone: isString,
      },
    });

    it('should validate deeply nested objects', () => {
      const validUser: ComplexUser = {
        id: 1,
        profile: {
          name: 'John Doe',
          email: 'john@example.com',
          preferences: {
            theme: 'dark',
            notifications: {
              email: true,
              push: false,
            },
          },
        },
        settings: {
          language: 'en',
          timezone: 'UTC',
        },
      };
      expect(isComplexUser(validUser)).toBe(true);
    });

    it('should return false for deeply nested validation failures', () => {
      const invalidUser = {
        id: 1,
        profile: {
          name: 'John Doe',
          email: 'john@example.com',
          preferences: {
            theme: 'dark',
            notifications: {
              email: 'yes', // should be boolean
              push: false,
            },
          },
        },
        settings: {
          language: 'en',
          timezone: 'UTC',
        },
      };
      expect(isComplexUser(invalidUser)).toBe(false);
    });
  });

  describe('mixed nested and type guard validation', () => {
    interface MixedUser {
      name: string;
      age: number;
      address: {
        street: string;
        city: string;
      };
      isActive: boolean;
    }

    const isAddress = isSchema({
      street: isString,
      city: isString,
    });

    const isMixedUser = isSchema<MixedUser>({
      name: isString,
      age: isNumber,
      address: isAddress, // Using existing type guard
      isActive: isBoolean,
    });

    it('should work with mixed nested objects and existing type guards', () => {
      const validUser: MixedUser = {
        name: 'John',
        age: 30,
        address: {
          street: '123 Main St',
          city: 'Springfield',
        },
        isActive: true,
      };
      expect(isMixedUser(validUser)).toBe(true);
    });

    it('should return false for invalid mixed validation', () => {
      const invalidUser = {
        name: 'John',
        age: '30', // should be number
        address: {
          street: '123 Main St',
          city: 'Springfield',
        },
        isActive: true,
      };
      expect(isMixedUser(invalidUser)).toBe(false);
    });
  });

  describe('array validation', () => {
    interface UserWithContacts {
      name: string;
      contacts: Array<{
        type: string;
        value: string;
      }>;
    }

    const isUserWithContacts = isSchema<UserWithContacts>({
      name: isString,
      contacts: [{
        type: isString,
        value: isString,
      }],
    });

    it('should validate arrays of objects', () => {
      const validUser: UserWithContacts = {
        name: 'John',
        contacts: [
          { type: 'email', value: 'john@example.com' },
          { type: 'phone', value: '555-1234' },
        ],
      };
      expect(isUserWithContacts(validUser)).toBe(true);
    });

    it('should return false for invalid array items', () => {
      const invalidUser = {
        name: 'John',
        contacts: [
          { type: 'email', value: 'john@example.com' },
          { type: 'phone', value: 5551234 }, // should be string
        ],
      };
      expect(isUserWithContacts(invalidUser)).toBe(false);
    });

    it('should return false for non-arrays', () => {
      const invalidUser = {
        name: 'John',
        contacts: 'not an array',
      };
      expect(isUserWithContacts(invalidUser)).toBe(false);
    });
  });

  describe('error handling', () => {
    interface TestUser {
      name: string;
      profile: {
        age: number;
        email: string;
      };
    }

    const isTestUser = isSchema<TestUser>({
      name: isString,
      profile: {
        age: isNumber,
        email: isString,
      },
    });

    it('should provide proper error messages for nested validation failures', () => {
      const errors: string[] = [];
      const config = {
        callbackOnError: (error: string) => errors.push(error),
        identifier: 'user',
      };

      const invalidUser = {
        name: 'John',
        profile: {
          age: '30', // should be number
          email: 'john@example.com',
        },
      };

      const result = isTestUser(invalidUser, config);

      expect(result).toBe(false);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('user.profile.age');
    });

    it('should handle multi error mode', () => {
      const errors: string[] = [];
      const config = {
        callbackOnError: (error: string) => errors.push(error),
        identifier: 'user',
        errorMode: 'multi' as const,
      };

      const invalidUser = {
        name: 123, // should be string
        profile: {
          age: '30', // should be number
          email: true, // should be string
        },
      };

      const result = isTestUser(invalidUser, config);

      expect(result).toBe(false);
      expect(errors.length).toBe(1);
      const combinedError = errors[0];
      expect(combinedError).toContain('Expected user.name (123) to be "string"');
      expect(combinedError).toContain('Expected user.profile ({"age":"30","email":true}) to be "object"');
      expect(combinedError).toMatch(/; /); // Should contain semicolon separators
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

      const isTestUser = isSchema<TestUser>({
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

      const isNestedUser = isSchema<NestedUser>({
        name: isString,
        profile: {
          age: isNumber,
          email: isString,
        },
        settings: {
          notifications: isBoolean,
        },
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
      expect(errors.length).toBeGreaterThan(0);
      
      // Find the JSON tree error (it will be the last one)
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
  });

  describe('edge cases', () => {
    it('should handle empty nested objects', () => {
      interface EmptyNested {
        data: {};
      }

      const isEmptyNested = isSchema<EmptyNested>({
        data: {},
      });

      expect(isEmptyNested({ data: {} })).toBe(true);
      expect(isEmptyNested({ data: { extra: 'property' } })).toBe(true); // Extra properties are allowed
    });

    it('should handle null and undefined values', () => {
      interface SimpleUser {
        name: string;
        age: number;
      }

      const isSimpleUser = isSchema<SimpleUser>({
        name: isString,
        age: isNumber,
      });

      expect(isSimpleUser(null)).toBe(false);
      expect(isSimpleUser(undefined)).toBe(false);
      expect(isSimpleUser('string')).toBe(false);
      expect(isSimpleUser(123)).toBe(false);
    });

    it('should handle objects with extra properties', () => {
      interface SimpleUser {
        name: string;
        age: number;
      }

      const isSimpleUser = isSchema<SimpleUser>({
        name: isString,
        age: isNumber,
      });

      const userWithExtra = {
        name: 'John',
        age: 30,
        extraProperty: 'value',
      };

      expect(isSimpleUser(userWithExtra)).toBe(true); // Extra properties should be allowed
    });
  });

  describe('backward compatibility', () => {
    it('should work with existing type guard patterns', () => {
      interface User {
        name: string;
        age: number;
      }

      // This should work the same as isType
      const isUser = isSchema<User>({
        name: isString,
        age: isNumber,
      });

      const validUser = { name: 'John', age: 30 };
      expect(isUser(validUser)).toBe(true);

      const invalidUser = { name: 'John', age: '30' };
      expect(isUser(invalidUser)).toBe(false);
    });

    it('should work with existing type guards', () => {
      interface User {
        name: string;
        age: number;
      }

      const isUser = isSchema<User>({
        name: isString,
        age: isNumber,
      });

      // Should work with existing type guards
      const isUserArray = isArrayWithEachItem(isUser);
      
      const validUsers = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 },
      ];
      
      expect(isUserArray(validUsers)).toBe(true);
    });
  });

  describe('integration with isType', () => {
    it('should work seamlessly with isType for nested structures', () => {
      interface ComplexUser {
        id: number;
        profile: {
          name: string;
          email: string;
        };
        settings: {
          theme: string;
          notifications: boolean;
        };
      }

      // Create nested type guards using isType
      const isProfile = isType({
        name: isString,
        email: isString,
      });

      const isSettings = isType({
        theme: isString,
        notifications: isBoolean,
      });

      // Use isSchema with isType-created guards
      const isComplexUser = isSchema<ComplexUser>({
        id: isNumber,
        profile: isProfile,
        settings: isSettings,
      });

      const validUser: ComplexUser = {
        id: 1,
        profile: {
          name: 'John Doe',
          email: 'john@example.com',
        },
        settings: {
          theme: 'dark',
          notifications: true,
        },
      };

      expect(isComplexUser(validUser)).toBe(true);
    });

    it('should work with isType for mixed inline and pre-defined guards', () => {
      interface MixedUser {
        id: number;
        profile: {
          name: string;
          email: string;
        };
        preferences: {
          theme: string;
          language: string;
        };
      }

      // Pre-defined guard using isType
      const isProfile = isType({
        name: isString,
        email: isString,
      });

      // Mixed approach: pre-defined + inline
      const isMixedUser = isSchema<MixedUser>({
        id: isNumber,
        profile: isProfile, // Pre-defined
        preferences: {      // Inline
          theme: isString,
          language: isString,
        },
      });

      const validUser: MixedUser = {
        id: 1,
        profile: {
          name: 'John Doe',
          email: 'john@example.com',
        },
        preferences: {
          theme: 'dark',
          language: 'en',
        },
      };

      expect(isMixedUser(validUser)).toBe(true);
    });

    it('should produce identical results to isType for simple objects', () => {
      interface SimpleUser {
        name: string;
        age: number;
        email: string;
      }

      const isUserSchema = isSchema<SimpleUser>({
        name: isString,
        age: isNumber,
        email: isString,
      });

      const isUserType = isType<SimpleUser>({
        name: isString,
        age: isNumber,
        email: isString,
      });

      const validUser = { name: 'John', age: 30, email: 'john@example.com' };
      const invalidUser = { name: 'John', age: '30', email: 'john@example.com' };

      expect(isUserSchema(validUser)).toBe(isUserType(validUser));
      expect(isUserSchema(invalidUser)).toBe(isUserType(invalidUser));
    });
  });

  describe('integration with other type guards', () => {
    it('should work with isUndefinedOr', () => {
      interface UserWithOptional {
        name: string;
        age: number;
        email?: string;
        phone?: string;
      }

      const isUserWithOptional = isSchema<UserWithOptional>({
        name: isString,
        age: isNumber,
        email: isUndefinedOr(isString),
        phone: isUndefinedOr(isString),
      });

      const userWithEmail = { name: 'John', age: 30, email: 'john@example.com' };
      const userWithoutEmail = { name: 'John', age: 30 };
      const userWithInvalidEmail = { name: 'John', age: 30, email: 123 };

      expect(isUserWithOptional(userWithEmail)).toBe(true);
      expect(isUserWithOptional(userWithoutEmail)).toBe(true);
      expect(isUserWithOptional(userWithInvalidEmail)).toBe(false);
    });



    it('should work with isEnum', () => {
      enum UserRole {
        ADMIN = 'admin',
        USER = 'user',
        MODERATOR = 'moderator',
      }

      interface UserWithEnum {
        name: string;
        role: UserRole;
      }

      const isUserWithEnum = isSchema<UserWithEnum>({
        name: isString,
        role: isEnum(UserRole),
      });

      const validUser = { name: 'John', role: UserRole.ADMIN };
      const invalidUser = { name: 'John', role: 'invalid' };

      expect(isUserWithEnum(validUser)).toBe(true);
      expect(isUserWithEnum(invalidUser)).toBe(false);
    });

    it('should work with isDate', () => {
      interface UserWithDate {
        name: string;
        createdAt: Date;
        updatedAt?: Date;
      }

      const isUserWithDate = isSchema<UserWithDate>({
        name: isString,
        createdAt: isDate,
        updatedAt: isUndefinedOr(isDate),
      });

      const validUser = { 
        name: 'John', 
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const userWithoutUpdate = { 
        name: 'John', 
        createdAt: new Date()
      };
      const invalidUser = { 
        name: 'John', 
        createdAt: '2023-01-01' // should be Date
      };

      expect(isUserWithDate(validUser)).toBe(true);
      expect(isUserWithDate(userWithoutUpdate)).toBe(true);
      expect(isUserWithDate(invalidUser)).toBe(false);
    });



    it('should work with isFunction', () => {
      interface UserWithFunction {
        name: string;
        validator: (value: any) => boolean;
      }

      const isUserWithFunction = isSchema<UserWithFunction>({
        name: isString,
        validator: isFunction,
      });

      const validUser = { 
        name: 'John', 
        validator: (value: any) => typeof value === 'string'
      };
      const invalidUser = { 
        name: 'John', 
        validator: 'not a function'
      };

      expect(isUserWithFunction(validUser)).toBe(true);
      expect(isUserWithFunction(invalidUser)).toBe(false);
    });



    it('should work with isPartialOf', () => {
      interface FullUser {
        name: string;
        age: number;
        email: string;
        phone: string;
      }

      interface PartialUser {
        name: string;
        age: number;
      }

      const isFullUser = isSchema<FullUser>({
        name: isString,
        age: isNumber,
        email: isString,
        phone: isString,
      });

      const isPartialUser = isSchema<PartialUser>({
        name: isString,
        age: isNumber,
      });

      const isPartialOfFull = isPartialOf(isFullUser);

      const partialUser = { name: 'John', age: 30 };
      const fullUser = { 
        name: 'John', 
        age: 30, 
        email: 'john@example.com', 
        phone: '555-1234' 
      };

      expect(isPartialUser(partialUser)).toBe(true);
      expect(isPartialOfFull(partialUser)).toBe(true);
      expect(isFullUser(fullUser)).toBe(true);
    });
  });


});

describe('isShape (alias)', () => {
  it('should be functionally equivalent to isSchema', () => {
    interface User {
      name: string;
      age: number;
    }

    const isUserSchema = isSchema<User>({
      name: isString,
      age: isNumber,
    });

    const isUserShape = isShape<User>({
      name: isString,
      age: isNumber,
    });

    const validUser = { name: 'John', age: 30 };
    const invalidUser = { name: 'John', age: '30' };

    expect(isUserSchema(validUser)).toBe(isUserShape(validUser));
    expect(isUserSchema(invalidUser)).toBe(isUserShape(invalidUser));
  });
});

describe('isNestedType (alias)', () => {
  it('should be functionally equivalent to isSchema', () => {
    interface User {
      name: string;
      age: number;
    }

    const isUserSchema = isSchema<User>({
      name: isString,
      age: isNumber,
    });

    const isUserNested = isNestedType<User>({
      name: isString,
      age: isNumber,
    });

    const validUser = { name: 'John', age: 30 };
    const invalidUser = { name: 'John', age: '30' };

    expect(isUserSchema(validUser)).toBe(isUserNested(validUser));
    expect(isUserSchema(invalidUser)).toBe(isUserNested(invalidUser));
  });
}); 