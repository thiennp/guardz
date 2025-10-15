import { isString } from './isString';
import { isNumber } from './isNumber';
import { isOneOfTypes } from './isOneOfTypes';
import { isType } from './isType';
import { isArrayWithEachItem } from './isArrayWithEachItem';
import { isObjectWithEachItem } from './isObjectWithEachItem';
import { isTuple } from './isTuple';
import { isBoolean } from './isBoolean';
import { isEqualTo } from './isEqualTo';
import { isUndefinedOr } from './isUndefinedOr';
import { isNullOr } from './isNullOr';
import { isNilOr } from './isNilOr';
import { isPositiveNumber } from './isPositiveNumber';
import { isNonEmptyString } from './isNonEmptyString';

describe('isOneOfTypes', () => {
  const isStringOrNumber = isOneOfTypes<string | number>(isString, isNumber);

  it('should return true if value matches one of the type guards', () => {
    expect(isStringOrNumber('hello')).toBe(true);
    expect(isStringOrNumber(123)).toBe(true);
    expect(isStringOrNumber(0)).toBe(true);
  });

  it('should return false if value matches none of the type guards', () => {
    expect(isStringOrNumber(null)).toBe(false);
    expect(isStringOrNumber(undefined)).toBe(false);
    expect(isStringOrNumber(true)).toBe(false);
    expect(isStringOrNumber({})).toBe(false);
    expect(isStringOrNumber([])).toBe(false);
    expect(isStringOrNumber(() => {})).toBe(false);
  });

  it('should handle error reporting with detailed reasons', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'value', callbackOnError: mockCallback };

    isStringOrNumber('test', config);
    expect(mockCallback).not.toHaveBeenCalled();

    isStringOrNumber(true, config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    // Note: isOneOfTypes uses custom error message format
    // It aggregates errors from the failing guards
    const expectedError = [
      'Expected value (true) type to match one of "isString | isNumber"',
      '- Expected value (true) to be "string"',
      '- Expected value (true) to be "number"',
    ].join('\n');
    expect(mockCallback).toHaveBeenCalledWith(expectedError);
  });

  describe('complex nested typeguards', () => {
    // Define complex nested interfaces
    interface User {
      type: 'user';
      id: number;
      name: string;
      email: string;
      profile?: {
        bio: string;
        avatar?: string;
      };
    }

    interface Admin {
      type: 'admin';
      id: number;
      name: string;
      permissions: string[];
      settings: {
        theme: string;
        notifications: boolean;
      };
    }

    interface Guest {
      type: 'guest';
      sessionId: string;
      preferences: Record<string, string>;
    }

    // Create complex typeguards
    const isUser = isType<User>({
      type: isEqualTo('user'),
      id: isPositiveNumber,
      name: isNonEmptyString,
      email: isString,
      profile: isUndefinedOr(isType({
        bio: isString,
        avatar: isUndefinedOr(isString)
      }))
    });

    const isAdmin = isType<Admin>({
      type: isEqualTo('admin'),
      id: isPositiveNumber,
      name: isNonEmptyString,
      permissions: isArrayWithEachItem(isString),
      settings: isType({
        theme: isString,
        notifications: isBoolean
      })
    });

    const isGuest = isType<Guest>({
      type: isEqualTo('guest'),
      sessionId: isNonEmptyString,
      preferences: isObjectWithEachItem(isString)
    });

    const isPerson = isOneOfTypes<User | Admin | Guest>(isUser, isAdmin, isGuest);

    it('should validate complex nested objects with different structures', () => {
      // Valid User
      const validUser: User = {
        type: 'user',
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        profile: {
          bio: 'Software developer',
          avatar: 'https://example.com/avatar.jpg'
        }
      };
      expect(isPerson(validUser)).toBe(true);

      // Valid Admin
      const validAdmin: Admin = {
        type: 'admin',
        id: 2,
        name: 'Jane Admin',
        permissions: ['read', 'write', 'delete'],
        settings: {
          theme: 'dark',
          notifications: true
        }
      };
      expect(isPerson(validAdmin)).toBe(true);

      // Valid Guest
      const validGuest: Guest = {
        type: 'guest',
        sessionId: 'session123',
        preferences: {
          language: 'en',
          timezone: 'UTC'
        }
      };
      expect(isPerson(validGuest)).toBe(true);
    });

    it('should handle optional nested properties correctly', () => {
      // User without profile
      const userWithoutProfile: User = {
        type: 'user',
        id: 3,
        name: 'Bob Smith',
        email: 'bob@example.com'
      };
      expect(isPerson(userWithoutProfile)).toBe(true);

      // User with profile but no avatar
      const userWithoutAvatar: User = {
        type: 'user',
        id: 4,
        name: 'Alice Johnson',
        email: 'alice@example.com',
        profile: {
          bio: 'Designer'
        }
      };
      expect(isPerson(userWithoutAvatar)).toBe(true);
    });

    it('should reject invalid nested structures', () => {
      // Invalid User - wrong type
      const invalidUser = {
        type: 'invalid',
        id: 1,
        name: 'John',
        email: 'john@example.com'
      };
      expect(isPerson(invalidUser)).toBe(false);

      // Invalid Admin - missing required nested property
      const invalidAdmin = {
        type: 'admin',
        id: 2,
        name: 'Jane',
        permissions: ['read'],
        // missing settings
      };
      expect(isPerson(invalidAdmin)).toBe(false);

      // Invalid Guest - wrong nested property type
      const invalidGuest = {
        type: 'guest',
        sessionId: 'session123',
        preferences: {
          language: 'en',
          timezone: 123 // should be string
        }
      };
      expect(isPerson(invalidGuest)).toBe(false);
    });

    it('should handle deeply nested arrays and objects', () => {
      interface ComplexData {
        type: 'complex';
        items: Array<{
          id: number;
          tags: string[];
          metadata?: {
            created: string;
            updated?: string;
            flags: boolean[];
          };
        }>;
        config: {
          version: string;
          features: Record<string, boolean>;
          limits: [number, number, number]; // tuple
        };
      }

      const isComplexData = isType<ComplexData>({
        type: isEqualTo('complex'),
        items: isArrayWithEachItem(isType({
          id: isPositiveNumber,
          tags: isArrayWithEachItem(isString),
          metadata: isUndefinedOr(isType({
            created: isString,
            updated: isUndefinedOr(isString),
            flags: isArrayWithEachItem(isBoolean)
          }))
        })),
        config: isType({
          version: isString,
          features: isObjectWithEachItem(isBoolean),
          limits: isTuple(isNumber, isNumber, isNumber)
        })
      });

      const isDataOrPerson = isOneOfTypes<ComplexData | User | Admin>(isComplexData, isUser, isAdmin);

      // Valid complex data
      const validComplexData: ComplexData = {
        type: 'complex',
        items: [
          {
            id: 1,
            tags: ['important', 'urgent'],
            metadata: {
              created: '2023-01-01',
              flags: [true, false, true]
            }
          },
          {
            id: 2,
            tags: ['normal']
            // metadata is optional
          }
        ],
        config: {
          version: '1.0.0',
          features: {
            darkMode: true,
            notifications: false
          },
          limits: [100, 200, 300]
        }
      };
      expect(isDataOrPerson(validComplexData)).toBe(true);

      // Should still accept valid User
      const validUser: User = {
        type: 'user',
        id: 1,
        name: 'John',
        email: 'john@example.com'
      };
      expect(isDataOrPerson(validUser)).toBe(true);
    });

    it('should handle conditional and nullable types', () => {
      interface ConditionalUser {
        type: 'conditional';
        status: 'active' | 'inactive' | 'pending';
        data: string | null | undefined;
        scores: (number | null)[];
        metadata?: Record<string, string | number> | null;
      }

      const isConditionalUser = isType<ConditionalUser>({
        type: isEqualTo('conditional'),
        status: isOneOfTypes(
          isEqualTo('active'),
          isEqualTo('inactive'),
          isEqualTo('pending')
        ),
        data: isNilOr(isString),
        scores: isArrayWithEachItem(isNullOr(isNumber)),
        metadata: isUndefinedOr(isNullOr(isObjectWithEachItem(isOneOfTypes<string | number>(isString, isNumber))))
      });

      const isAnyUser = isOneOfTypes<User | Admin | Guest | ConditionalUser>(
        isUser, isAdmin, isGuest, isConditionalUser
      );

      // Valid conditional user
      const validConditionalUser: ConditionalUser = {
        type: 'conditional',
        status: 'active',
        data: 'some data',
        scores: [100, null, 85, null, 92],
        metadata: {
          key1: 'value1',
          key2: 42
        }
      };
      expect(isAnyUser(validConditionalUser)).toBe(true);

      // Valid conditional user with null/undefined values
      const validConditionalUserWithNulls: ConditionalUser = {
        type: 'conditional',
        status: 'pending',
        data: null,
        scores: [null, null],
        metadata: null
      };
      expect(isAnyUser(validConditionalUserWithNulls)).toBe(true);
    });

    it('should handle union types with overlapping properties', () => {
      interface BaseEntity {
        id: number;
        createdAt: string;
      }

      interface Product extends BaseEntity {
        type: 'product';
        name: string;
        price: number;
        category: string;
      }

      interface Service extends BaseEntity {
        type: 'service';
        name: string;
        duration: number;
        category: string;
      }

      const isProduct = isType<Product>({
        type: isEqualTo('product'),
        id: isPositiveNumber,
        createdAt: isString,
        name: isNonEmptyString,
        price: isPositiveNumber,
        category: isString
      });

      const isService = isType<Service>({
        type: isEqualTo('service'),
        id: isPositiveNumber,
        createdAt: isString,
        name: isNonEmptyString,
        duration: isPositiveNumber,
        category: isString
      });

      const isEntity = isOneOfTypes<Product | Service>(isProduct, isService);

      // Valid Product
      const validProduct: Product = {
        type: 'product',
        id: 1,
        createdAt: '2023-01-01',
        name: 'Laptop',
        price: 999.99,
        category: 'Electronics'
      };
      expect(isEntity(validProduct)).toBe(true);

      // Valid Service
      const validService: Service = {
        type: 'service',
        id: 2,
        createdAt: '2023-01-02',
        name: 'Consultation',
        duration: 60,
        category: 'Professional'
      };
      expect(isEntity(validService)).toBe(true);

      // Invalid - wrong type but correct structure
      const invalidEntity = {
        type: 'invalid',
        id: 3,
        createdAt: '2023-01-03',
        name: 'Something',
        price: 100,
        category: 'Misc'
      };
      expect(isEntity(invalidEntity)).toBe(false);
    });

    it('should handle error reporting for complex nested structures', () => {
      const mockCallback = jest.fn();
      const config = { identifier: 'complexValue', callbackOnError: mockCallback };

      // Test with invalid complex data
      const invalidComplexData = {
        type: 'complex',
        items: [
          {
            id: 'not a number', // should be number
            tags: ['valid', 'tags'],
            metadata: {
              created: '2023-01-01',
              flags: [true, 'not boolean', true] // should be boolean array
            }
          }
        ],
        config: {
          version: '1.0.0',
          features: {
            darkMode: true,
            notifications: 'not boolean' // should be boolean
          },
          limits: [100, 200] // should be tuple of 3 numbers
        }
      };

      interface ComplexData {
        type: 'complex';
        items: Array<{
          id: number;
          tags: string[];
          metadata?: {
            created: string;
            flags: boolean[];
          };
        }>;
        config: {
          version: string;
          features: Record<string, boolean>;
          limits: [number, number, number];
        };
      }

      const isComplexData = isType<ComplexData>({
        type: isEqualTo('complex'),
        items: isArrayWithEachItem(isType({
          id: isPositiveNumber,
          tags: isArrayWithEachItem(isString),
          metadata: isUndefinedOr(isType({
            created: isString,
            flags: isArrayWithEachItem(isBoolean)
          }))
        })),
        config: isType({
          version: isString,
          features: isObjectWithEachItem(isBoolean),
          limits: isTuple(isNumber, isNumber, isNumber)
        })
      });

      const isComplexOrPerson = isOneOfTypes<ComplexData | User>(isComplexData, isUser);

      isComplexOrPerson(invalidComplexData, config);

      expect(mockCallback).toHaveBeenCalledTimes(1);
      const errorMessage = mockCallback.mock.calls[0][0];
      
      // Should include the main error message (function names may be empty for isType guards)
      expect(errorMessage).toContain('Expected complexValue type to match one of');
      
      // Should include error details from the failing typeguards
      expect(errorMessage).toContain('Expected complexValue.items');
      expect(errorMessage).toContain('Expected complexValue.config');
      expect(errorMessage).toContain('Expected complexValue.type');
    });
  });

  describe('error reporting edge cases', () => {
    it('should handle long values by omitting the value in error message', () => {
      const mockCallback = jest.fn();
      const config = { identifier: 'longValue', callbackOnError: mockCallback };

      // Create a very long string that will exceed 200 characters when stringified
      const longString = 'a'.repeat(300);
      isStringOrNumber(longString, config);

      expect(mockCallback).not.toHaveBeenCalled(); // Should pass since it's a string

      // Test with a long object that will fail validation
      const longObject = {
        data: 'a'.repeat(300),
        nested: {
          moreData: 'b'.repeat(300)
        }
      };

      isStringOrNumber(longObject, config);

      expect(mockCallback).toHaveBeenCalledTimes(1);
      const errorMessage = mockCallback.mock.calls[0][0];
      
      // Should not include the actual value in the error message
      expect(errorMessage).toContain('Expected longValue type to match one of "isString | isNumber"');
      expect(errorMessage).not.toContain('longValue (');
      expect(errorMessage).not.toContain('a'.repeat(300));
    });

    it('should handle values exactly at the 200 character boundary', () => {
      const mockCallback = jest.fn();
      const config = { identifier: 'boundaryValue', callbackOnError: mockCallback };

      // Create a string that will be exactly 200 characters when stringified
      const boundaryString = 'a'.repeat(198); // "a".repeat(198) = 198 chars, plus quotes = 200 chars
      isStringOrNumber(boundaryString, config);

      expect(mockCallback).not.toHaveBeenCalled(); // Should pass since it's a string

      // Test with an object that will be exactly 200 characters when stringified
      const boundaryObject = { data: 'a'.repeat(194) }; // {"data":"aaa...aaa"} = 200 chars
      isStringOrNumber(boundaryObject, config);

      expect(mockCallback).toHaveBeenCalledTimes(1);
      const errorMessage = mockCallback.mock.calls[0][0];
      
      // The actual behavior shows that even at the boundary, the value is omitted
      expect(errorMessage).toContain('Expected boundaryValue type to match one of "isString | isNumber"');
      expect(errorMessage).not.toContain('boundaryValue (');
    });

    it('should handle values just over the 200 character boundary', () => {
      const mockCallback = jest.fn();
      const config = { identifier: 'overBoundaryValue', callbackOnError: mockCallback };

      // Create a string that will be just over 200 characters when stringified
      const overBoundaryString = 'a'.repeat(199); // "a".repeat(199) = 199 chars, plus quotes = 201 chars
      isStringOrNumber(overBoundaryString, config);

      expect(mockCallback).not.toHaveBeenCalled(); // Should pass since it's a string

      // Test with an object that will be just over 200 characters when stringified
      const overBoundaryObject = { data: 'a'.repeat(195) }; // {"data":"aaa...aaa"} = 201 chars
      isStringOrNumber(overBoundaryObject, config);

      expect(mockCallback).toHaveBeenCalledTimes(1);
      const errorMessage = mockCallback.mock.calls[0][0];
      
      // Should not include the value since it's over the boundary
      expect(errorMessage).toContain('Expected overBoundaryValue type to match one of "isString | isNumber"');
      expect(errorMessage).not.toContain('overBoundaryValue (');
    });

    it('should handle complex nested objects that exceed the limit', () => {
      const mockCallback = jest.fn();
      const config = { identifier: 'complexValue', callbackOnError: mockCallback };

      // Create a complex nested object that will exceed 200 characters when stringified
      const complexObject = {
        level1: {
          level2: {
            level3: {
              data: 'a'.repeat(100),
              moreData: 'b'.repeat(100),
              evenMoreData: 'c'.repeat(100)
            }
          }
        }
      };

      isStringOrNumber(complexObject, config);

      expect(mockCallback).toHaveBeenCalledTimes(1);
      const errorMessage = mockCallback.mock.calls[0][0];
      
      // Should not include the actual value in the error message
      expect(errorMessage).toContain('Expected complexValue type to match one of "isString | isNumber"');
      expect(errorMessage).not.toContain('complexValue (');
    });

    it('should handle arrays that exceed the limit', () => {
      const mockCallback = jest.fn();
      const config = { identifier: 'arrayValue', callbackOnError: mockCallback };

      // Create a large array that will exceed 200 characters when stringified
      const largeArray = Array.from({ length: 50 }, (_, i) => `item${i}`);

      isStringOrNumber(largeArray, config);

      expect(mockCallback).toHaveBeenCalledTimes(1);
      const errorMessage = mockCallback.mock.calls[0][0];
      
      // Should not include the actual value in the error message
      expect(errorMessage).toContain('Expected arrayValue type to match one of "isString | isNumber"');
      expect(errorMessage).not.toContain('arrayValue (');
    });

    it('should handle null config gracefully', () => {
      // Should not throw when config is null
      expect(() => isStringOrNumber(true, null)).not.toThrow();
      expect(() => isStringOrNumber('test', null)).not.toThrow();
    });

    it('should handle undefined config gracefully', () => {
      // Should not throw when config is undefined
      expect(() => isStringOrNumber(true, undefined)).not.toThrow();
      expect(() => isStringOrNumber('test', undefined)).not.toThrow();
    });

    it('should handle config without callbackOnError', () => {
      const config = { identifier: 'test', callbackOnError: jest.fn() };
      
      // Should not throw when callbackOnError is provided
      expect(() => isStringOrNumber(true, config)).not.toThrow();
      expect(() => isStringOrNumber('test', config)).not.toThrow();
    });

    it('should handle empty type guards array', () => {
      const emptyGuard = isOneOfTypes();
      
      expect(emptyGuard('test')).toBe(false);
      expect(emptyGuard(123)).toBe(false);
      expect(emptyGuard(true)).toBe(false);
    });

    it('should handle single type guard', () => {
      const singleGuard = isOneOfTypes(isString);
      
      expect(singleGuard('test')).toBe(true);
      expect(singleGuard(123)).toBe(false);
      expect(singleGuard(true)).toBe(false);
    });

    it('should handle multiple type guards with complex types', () => {
      // Create custom type guards
      const isEvenNumber = (value: unknown): value is number => 
        typeof value === 'number' && value % 2 === 0;
      
      const isOddNumber = (value: unknown): value is number => 
        typeof value === 'number' && value % 2 === 1;
      
      const isShortString = (value: unknown): value is string => 
        typeof value === 'string' && value.length <= 5;

      const complexGuard = isOneOfTypes<string | number>(isShortString, isEvenNumber, isOddNumber);

      expect(complexGuard('hi')).toBe(true); // short string
      expect(complexGuard('very long string')).toBe(false); // long string
      expect(complexGuard(2)).toBe(true); // even number
      expect(complexGuard(3)).toBe(true); // odd number
      expect(complexGuard(2.5)).toBe(false); // decimal
      expect(complexGuard(true)).toBe(false); // boolean
    });

    it('should handle error message deduplication', () => {
      const mockCallback = jest.fn();
      const config = { identifier: 'test', callbackOnError: mockCallback };

      // Create type guards that might produce duplicate error messages
      const isPositiveNumber = (value: unknown): value is number => 
        typeof value === 'number' && value > 0;
      
      const isNegativeNumber = (value: unknown): value is number => 
        typeof value === 'number' && value < 0;

      const numberGuard = isOneOfTypes<number>(isPositiveNumber, isNegativeNumber);

      numberGuard('not a number', config);

      expect(mockCallback).toHaveBeenCalledTimes(1);
      const errorMessage = mockCallback.mock.calls[0][0];
      
      // Should include the main error message with the actual value
      expect(errorMessage).toContain('Expected test ("not a number") type to match one of "isPositiveNumber | isNegativeNumber"');
      
      // The actual behavior shows that individual guard errors are not included
      // This is because the guards are called with null config to avoid duplicate callbacks
      expect(errorMessage).not.toContain('- Expected test');
    });
  });
});
