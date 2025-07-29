import { isBranded, type Branded } from './isBranded';

// Test branded types
type UserId = Branded<number, 'UserId'>;
type Email = Branded<string, 'Email'>;
type Age = Branded<number, 'Age'>;
type PositiveNumber = Branded<number, 'PositiveNumber'>;
type NonEmptyString = Branded<string, 'NonEmptyString'>;

describe('isBranded', () => {
  describe('Branded type helper', () => {
    it('should create branded types correctly', () => {
      // This is a compile-time test
      const userId: UserId = 123 as UserId;
      const email: Email = 'test@example.com' as Email;
      
      expect(typeof userId).toBe('number');
      expect(typeof email).toBe('string');
    });
  });

  describe('isBranded function', () => {
    describe('basic functionality', () => {
      const isUserId = isBranded<UserId>((value) => {
        if (typeof value !== 'number' || value <= 0 || !Number.isInteger(value)) {
          throw new Error('UserId must be a positive integer');
        }
      });

      it('should return true for valid branded values', () => {
        expect(isUserId(123)).toBe(true);
        expect(isUserId(1)).toBe(true);
        expect(isUserId(999999)).toBe(true);
      });

      it('should return false for invalid values', () => {
        expect(isUserId(-1)).toBe(false);
        expect(isUserId(0)).toBe(false);
        expect(isUserId(1.5)).toBe(false);
        expect(isUserId('123')).toBe(false);
        expect(isUserId(null)).toBe(false);
        expect(isUserId(undefined)).toBe(false);
        expect(isUserId({})).toBe(false);
      });

      it('should provide proper type narrowing', () => {
        const data: unknown = 123;
        if (isUserId(data)) {
          // data should be typed as UserId
          expect(typeof data).toBe('number');
        }
      });
    });

    describe('string validation', () => {
      const isEmail = isBranded<Email>((value) => {
        if (typeof value !== 'string') {
          throw new Error('Email must be a string');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          throw new Error('Invalid email format');
        }
      });

      it('should validate email format correctly', () => {
        expect(isEmail('user@example.com')).toBe(true);
        expect(isEmail('test.email@domain.co.uk')).toBe(true);
        expect(isEmail('simple@test.org')).toBe(true);
      });

      it('should reject invalid email formats', () => {
        expect(isEmail('invalid-email')).toBe(false);
        expect(isEmail('user@')).toBe(false);
        expect(isEmail('@domain.com')).toBe(false);
        expect(isEmail('user.domain.com')).toBe(false);
        expect(isEmail('')).toBe(false);
      });

      it('should reject non-string values', () => {
        expect(isEmail(123)).toBe(false);
        expect(isEmail(null)).toBe(false);
        expect(isEmail(undefined)).toBe(false);
        expect(isEmail({})).toBe(false);
      });
    });

    describe('complex validation', () => {
      const isAge = isBranded<Age>((value) => {
        if (typeof value !== 'number') {
          throw new Error('Age must be a number');
        }
        if (!Number.isInteger(value)) {
          throw new Error('Age must be an integer');
        }
        if (value < 0) {
          throw new Error('Age cannot be negative');
        }
        if (value > 150) {
          throw new Error('Age cannot exceed 150');
        }
      });

      it('should validate age correctly', () => {
        expect(isAge(0)).toBe(true);
        expect(isAge(25)).toBe(true);
        expect(isAge(100)).toBe(true);
        expect(isAge(150)).toBe(true);
      });

      it('should reject invalid ages', () => {
        expect(isAge(-1)).toBe(false);
        expect(isAge(151)).toBe(false);
        expect(isAge(25.5)).toBe(false);
        expect(isAge('25')).toBe(false);
        expect(isAge(null)).toBe(false);
      });
    });

    describe('error handling', () => {
      const isPositiveNumber = isBranded<PositiveNumber>((value) => {
        if (typeof value !== 'number') {
          throw new Error('Value must be a number');
        }
        if (value <= 0) {
          throw new Error('Value must be positive');
        }
      });

      it('should call error callback when validation fails', () => {
        const errorCallback = jest.fn();
        const config = {
          callbackOnError: errorCallback,
          identifier: 'test'
        };

        expect(isPositiveNumber(-1, config)).toBe(false);
        expect(errorCallback).toHaveBeenCalledWith(
          expect.stringContaining('Value must be positive')
        );
      });

      it('should not call error callback when validation passes', () => {
        const errorCallback = jest.fn();
        const config = {
          callbackOnError: errorCallback,
          identifier: 'test'
        };

        expect(isPositiveNumber(5, config)).toBe(true);
        expect(errorCallback).not.toHaveBeenCalled();
      });

      it('should work without config', () => {
        expect(isPositiveNumber(5)).toBe(true);
        expect(isPositiveNumber(-1)).toBe(false);
      });

      it('should work with null config', () => {
        expect(isPositiveNumber(5, null)).toBe(true);
        expect(isPositiveNumber(-1, null)).toBe(false);
      });
    });

    describe('string validation with empty check', () => {
      const isNonEmptyString = isBranded<NonEmptyString>((value) => {
        if (typeof value !== 'string') {
          throw new Error('Value must be a string');
        }
        if (value.length === 0) {
          throw new Error('String cannot be empty');
        }
      });

      it('should validate non-empty strings', () => {
        expect(isNonEmptyString('hello')).toBe(true);
        expect(isNonEmptyString(' ')).toBe(true);
        expect(isNonEmptyString('123')).toBe(true);
      });

      it('should reject empty strings', () => {
        expect(isNonEmptyString('')).toBe(false);
      });

      it('should reject non-string values', () => {
        expect(isNonEmptyString(123)).toBe(false);
        expect(isNonEmptyString(null)).toBe(false);
        expect(isNonEmptyString(undefined)).toBe(false);
      });
    });

    describe('edge cases', () => {
      it('should handle validation functions that throw different error types', () => {
        const isCustom = isBranded<PositiveNumber>((value) => {
          if (typeof value !== 'number') {
            throw 'Custom error string';
          }
          if (value <= 0) {
            throw new TypeError('Custom TypeError');
          }
        });

        const errorCallback = jest.fn();
        const config = { callbackOnError: errorCallback, identifier: 'test' };

        expect(isCustom('not a number', config)).toBe(false);
        expect(errorCallback).toHaveBeenCalledWith(
          expect.stringContaining('Custom error string')
        );

        expect(isCustom(-1, config)).toBe(false);
        expect(errorCallback).toHaveBeenCalledWith(
          expect.stringContaining('Custom TypeError')
        );
      });

      it('should handle validation functions that never throw', () => {
        const isAlwaysValid = isBranded<PositiveNumber>((value) => {
          // This function never throws, so it always validates successfully
        });

        expect(isAlwaysValid(123)).toBe(true);
        expect(isAlwaysValid('string')).toBe(true);
        expect(isAlwaysValid(null)).toBe(true);
        expect(isAlwaysValid(undefined)).toBe(true);
      });
    });

    describe('real-world use cases', () => {
      it('should work with API response validation', () => {
        type ApiResponse<T> = Branded<T, 'ApiResponse'>;
        
        const isValidApiResponse = isBranded<ApiResponse<any>>((value) => {
          if (typeof value !== 'object' || value === null) {
            throw new Error('API response must be an object');
          }
          if (!('status' in value) || typeof value.status !== 'number') {
            throw new Error('API response must have a numeric status');
          }
          if (!('data' in value)) {
            throw new Error('API response must have data property');
          }
        });

        const validResponse = { status: 200, data: { id: 1 } };
        const invalidResponse = { status: '200', data: { id: 1 } };

        expect(isValidApiResponse(validResponse)).toBe(true);
        expect(isValidApiResponse(invalidResponse)).toBe(false);
      });

      it('should work with form validation', () => {
        type Password = Branded<string, 'Password'>;
        
        const isPassword = isBranded<Password>((value) => {
          if (typeof value !== 'string') {
            throw new Error('Password must be a string');
          }
          if (value.length < 8) {
            throw new Error('Password must be at least 8 characters');
          }
          if (!/[A-Z]/.test(value)) {
            throw new Error('Password must contain at least one uppercase letter');
          }
          if (!/[a-z]/.test(value)) {
            throw new Error('Password must contain at least one lowercase letter');
          }
          if (!/\d/.test(value)) {
            throw new Error('Password must contain at least one digit');
          }
        });

        expect(isPassword('ValidPass123')).toBe(true);
        expect(isPassword('short')).toBe(false);
        expect(isPassword('nouppercase123')).toBe(false);
        expect(isPassword('NOLOWERCASE123')).toBe(false);
        expect(isPassword('NoDigits')).toBe(false);
      });
    });
  });
});