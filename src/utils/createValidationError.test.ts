import { createValidationError } from './createValidationError';
import { ValidationError } from './validationTypes';

describe('createValidationError', () => {
  describe('basic functionality', () => {
    it('should create a validation error with all properties', () => {
      const error = createValidationError(
        'user.name',
        'string',
        123,
        'Expected user.name (123) to be "string"'
      );
      
      expect(error).toEqual({
        path: 'user.name',
        expectedType: 'string',
        actualValue: 123,
        message: 'Expected user.name (123) to be "string"'
      });
    });

    it('should create error with string value', () => {
      const error = createValidationError(
        'user.email',
        'string',
        'invalid-email',
        'Expected user.email ("invalid-email") to be "string"'
      );
      
      expect(error.path).toBe('user.email');
      expect(error.expectedType).toBe('string');
      expect(error.actualValue).toBe('invalid-email');
      expect(error.message).toBe('Expected user.email ("invalid-email") to be "string"');
    });

    it('should create error with number value', () => {
      const error = createValidationError(
        'user.age',
        'number',
        25,
        'Expected user.age (25) to be "number"'
      );
      
      expect(error.path).toBe('user.age');
      expect(error.expectedType).toBe('number');
      expect(error.actualValue).toBe(25);
      expect(error.message).toBe('Expected user.age (25) to be "number"');
    });

    it('should create error with boolean value', () => {
      const error = createValidationError(
        'user.isActive',
        'boolean',
        true,
        'Expected user.isActive (true) to be "boolean"'
      );
      
      expect(error.path).toBe('user.isActive');
      expect(error.expectedType).toBe('boolean');
      expect(error.actualValue).toBe(true);
      expect(error.message).toBe('Expected user.isActive (true) to be "boolean"');
    });

    it('should create error with null value', () => {
      const error = createValidationError(
        'user.name',
        'string',
        null,
        'Expected user.name (null) to be "string"'
      );
      
      expect(error.path).toBe('user.name');
      expect(error.expectedType).toBe('string');
      expect(error.actualValue).toBe(null);
      expect(error.message).toBe('Expected user.name (null) to be "string"');
    });

    it('should create error with undefined value', () => {
      const error = createValidationError(
        'user.name',
        'string',
        undefined,
        'Expected user.name (undefined) to be "string"'
      );
      
      expect(error.path).toBe('user.name');
      expect(error.expectedType).toBe('string');
      expect(error.actualValue).toBe(undefined);
      expect(error.message).toBe('Expected user.name (undefined) to be "string"');
    });
  });

  describe('complex values', () => {
    it('should create error with object value', () => {
      const objectValue = { id: 1, name: 'John' };
      const error = createValidationError(
        'user',
        'string',
        objectValue,
        'Expected user ([object Object]) to be "string"'
      );
      
      expect(error.path).toBe('user');
      expect(error.expectedType).toBe('string');
      expect(error.actualValue).toBe(objectValue);
      expect(error.message).toBe('Expected user ([object Object]) to be "string"');
    });

    it('should create error with array value', () => {
      const arrayValue = [1, 2, 3];
      const error = createValidationError(
        'user.tags',
        'string',
        arrayValue,
        'Expected user.tags (1,2,3) to be "string"'
      );
      
      expect(error.path).toBe('user.tags');
      expect(error.expectedType).toBe('string');
      expect(error.actualValue).toBe(arrayValue);
      expect(error.message).toBe('Expected user.tags (1,2,3) to be "string"');
    });

    it('should create error with function value', () => {
      const functionValue = () => 'test';
      const error = createValidationError(
        'user.handler',
        'string',
        functionValue,
        'Expected user.handler (function) to be "string"'
      );
      
      expect(error.path).toBe('user.handler');
      expect(error.expectedType).toBe('string');
      expect(error.actualValue).toBe(functionValue);
      expect(error.message).toBe('Expected user.handler (function) to be "string"');
    });
  });

  describe('path variations', () => {
    it('should handle simple property path', () => {
      const error = createValidationError('name', 'string', 123, 'test');
      expect(error.path).toBe('name');
    });

    it('should handle nested property path', () => {
      const error = createValidationError('user.profile.name', 'string', 123, 'test');
      expect(error.path).toBe('user.profile.name');
    });

    it('should handle array index path', () => {
      const error = createValidationError('users.0.name', 'string', 123, 'test');
      expect(error.path).toBe('users.0.name');
    });

    it('should handle deep nested path', () => {
      const error = createValidationError('a.b.c.d.e.f', 'string', 123, 'test');
      expect(error.path).toBe('a.b.c.d.e.f');
    });

    it('should handle empty path', () => {
      const error = createValidationError('', 'string', 123, 'test');
      expect(error.path).toBe('');
    });
  });

  describe('expected type variations', () => {
    it('should handle primitive types', () => {
      const types = ['string', 'number', 'boolean', 'object', 'array'];
      
      types.forEach(type => {
        const error = createValidationError('test', type, 123, 'test');
        expect(error.expectedType).toBe(type);
      });
    });

    it('should handle custom types', () => {
      const customTypes = ['User', 'Email', 'PhoneNumber', 'Date', 'UUID'];
      
      customTypes.forEach(type => {
        const error = createValidationError('test', type, 123, 'test');
        expect(error.expectedType).toBe(type);
      });
    });

    it('should handle complex type names', () => {
      const error = createValidationError('test', 'Array<string>', 123, 'test');
      expect(error.expectedType).toBe('Array<string>');
    });
  });

  describe('message variations', () => {
    it('should handle simple message', () => {
      const error = createValidationError('test', 'string', 123, 'Invalid type');
      expect(error.message).toBe('Invalid type');
    });

    it('should handle complex message with JSON', () => {
      const complexValue = { nested: { value: 'test' } };
      const error = createValidationError(
        'test',
        'string',
        complexValue,
        'Expected test ({"nested":{"value":"test"}}) to be "string"'
      );
      expect(error.message).toBe('Expected test ({"nested":{"value":"test"}}) to be "string"');
    });

    it('should handle message with special characters', () => {
      const error = createValidationError('test', 'string', 123, 'Error: "quoted" & <special> chars');
      expect(error.message).toBe('Error: "quoted" & <special> chars');
    });

    it('should handle empty message', () => {
      const error = createValidationError('test', 'string', 123, '');
      expect(error.message).toBe('');
    });
  });

  describe('type safety', () => {
    it('should maintain correct types for all properties', () => {
      const error: ValidationError = createValidationError('test', 'string', 123, 'test');
      
      expect(typeof error.path).toBe('string');
      expect(typeof error.expectedType).toBe('string');
      expect(typeof error.message).toBe('string');
      expect(error.actualValue).toBe(123);
    });

    it('should handle unknown actualValue type', () => {
      const symbolValue = Symbol('test');
      const error = createValidationError('test', 'string', symbolValue as unknown, 'test');
      expect(error.actualValue).toBe(symbolValue);
    });
  });

  describe('immutability', () => {
    it('should not mutate input parameters', () => {
      const originalPath = 'user.name';
      const originalType = 'string';
      const originalValue = 123;
      const originalMessage = 'test message';
      
      const error = createValidationError(originalPath, originalType, originalValue, originalMessage);
      
      // Modify the error object
      error.path = 'modified.path';
      error.expectedType = 'number';
      error.actualValue = 456;
      error.message = 'modified message';
      
      // Original values should remain unchanged
      expect(originalPath).toBe('user.name');
      expect(originalType).toBe('string');
      expect(originalValue).toBe(123);
      expect(originalMessage).toBe('test message');
    });
  });

  describe('performance', () => {
    it('should handle large number of calls efficiently', () => {
      const start = performance.now();
      
      for (const i of Array.from({ length: 10000 }, (_, i) => i)) {
        createValidationError(`property.${i}`, 'string', i, `Error ${i}`);
      }
      
      const end = performance.now();
      expect(end - start).toBeLessThan(100); // Should complete in less than 100ms
    });

    it('should handle complex values efficiently', () => {
      const complexValue = {
        nested: {
          deep: {
            array: [1, 2, 3, 4, 5],
            object: { a: 1, b: 2, c: 3 }
          }
        }
      };
      
      const start = performance.now();
      
      for (const i of Array.from({ length: 1000 }, (_, i) => i)) {
        createValidationError(`property.${i}`, 'string', complexValue, `Error ${i}`);
      }
      
      const end = performance.now();
      expect(end - start).toBeLessThan(50); // Should complete in less than 50ms
    });
  });
}); 