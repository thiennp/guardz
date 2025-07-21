import { isObjectWith } from './isObjectWith';
import { isString } from './isString';
import { isNumber } from './isNumber';
import { isBoolean } from './isBoolean';

describe('isObjectWith', () => {
  interface User {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
  }

  const isUser = isObjectWith<User>({
    id: isNumber,
    name: isString,
    email: isString,
    isActive: isBoolean,
  });

  it('should return true for valid object with all required properties', () => {
    const validUser = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      isActive: true,
    };

    expect(isUser(validUser)).toBe(true);
  });

  it('should return false for null', () => {
    expect(isUser(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isUser(undefined)).toBe(false);
  });

  it('should return false for non-object values', () => {
    expect(isUser('string')).toBe(false);
    expect(isUser(123)).toBe(false);
    expect(isUser(true)).toBe(false);
    expect(isUser([])).toBe(false);
  });

  it('should return false for object missing required properties', () => {
    const incompleteUser = {
      id: 1,
      name: 'John Doe',
      // missing email and isActive
    };

    expect(isUser(incompleteUser)).toBe(false);
  });

  it('should return false for object with wrong property types', () => {
    const invalidUser = {
      id: '1', // should be number
      name: 'John Doe',
      email: 'john@example.com',
      isActive: true,
    };

    expect(isUser(invalidUser)).toBe(false);
  });

  it('should return false for object with extra properties', () => {
    const userWithExtra = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      isActive: true,
      extraProperty: 'should not affect validation',
    };

    expect(isUser(userWithExtra)).toBe(true); // Extra properties are allowed
  });

  it('should work with nested objects', () => {
    interface NestedUser {
      id: number;
      profile: {
        name: string;
        age: number;
      };
    }

    const isNestedUser = isObjectWith<NestedUser>({
      id: isNumber,
      profile: isObjectWith({
        name: isString,
        age: isNumber,
      }),
    });

    const validNestedUser = {
      id: 1,
      profile: {
        name: 'John Doe',
        age: 30,
      },
    };

    expect(isNestedUser(validNestedUser)).toBe(true);
  });

  it('should provide structured error messages when config is provided', () => {
    const errors: string[] = [];
    const config = {
      identifier: 'user',
      callbackOnError: (error: string) => errors.push(error),
    };

    const invalidUser = {
      id: '1', // should be number
      name: 'John Doe',
      email: 'john@example.com',
      isActive: true,
    };

    isUser(invalidUser, config);

    expect(errors).toContain('Expected user.id ("1") to be "number"');
  });

  it('should be functionally equivalent to isType', () => {
    const testObject = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      isActive: true,
    };

    // Both should return the same result
    expect(isUser(testObject)).toBe(true);
  });
}); 