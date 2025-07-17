import { generateTypeGuardError } from './generateTypeGuardError';

describe('generateTypeGuardError', () => {
  describe('short values (≤ 200 characters)', () => {
    it('should include value in error message for short strings', () => {
      const error = generateTypeGuardError('hello', 'myValue', 'number');
      expect(error).toBe('Expected myValue ("hello") to be "number"');
    });

    it('should include value in error message for numbers', () => {
      const error = generateTypeGuardError(123, 'count', 'string');
      expect(error).toBe('Expected count (123) to be "string"');
    });

    it('should include value in error message for booleans', () => {
      const error = generateTypeGuardError(true, 'flag', 'string');
      expect(error).toBe('Expected flag (true) to be "string"');
    });

    it('should include value in error message for null', () => {
      const error = generateTypeGuardError(null, 'data', 'string');
      expect(error).toBe('Expected data (null) to be "string"');
    });

    it('should include value in error message for undefined', () => {
      const error = generateTypeGuardError(undefined, 'data', 'string');
      expect(error).toBe('Expected data (undefined) to be "string"');
    });

    it('should include value in error message for arrays', () => {
      const error = generateTypeGuardError([1, 2, 3], 'items', 'string');
      expect(error).toContain('Expected items (');
      expect(error).toContain('[');
      expect(error).toContain('1');
      expect(error).toContain('2');
      expect(error).toContain('3');
      expect(error).toContain(') to be "string"');
    });

    it('should include value in error message for objects', () => {
      const error = generateTypeGuardError({ name: 'John' }, 'user', 'string');
      expect(error).toContain('Expected user (');
      expect(error).toContain('"name": "John"');
      expect(error).toContain(') to be "string"');
    });

    it('should include value in error message for nested objects', () => {
      const complexObj = { user: { name: 'John', age: 30 }, active: true };
      const error = generateTypeGuardError(complexObj, 'data', 'string');
      expect(error).toContain('Expected data (');
      expect(error).toContain('"name": "John"');
      expect(error).toContain('"age": 30');
      expect(error).toContain('"active": true');
      expect(error).toContain(') to be "string"');
    });

    it('should handle empty string', () => {
      const error = generateTypeGuardError('', 'text', 'number');
      expect(error).toBe('Expected text ("") to be "number"');
    });

    it('should handle empty array', () => {
      const error = generateTypeGuardError([], 'items', 'string');
      expect(error).toBe('Expected items ([]) to be "string"');
    });

    it('should handle empty object', () => {
      const error = generateTypeGuardError({}, 'data', 'string');
      expect(error).toBe('Expected data ({}) to be "string"');
    });
  });

  describe('long values (> 200 characters)', () => {
    it('should omit value for very long strings', () => {
      const longString = 'a'.repeat(250);
      const error = generateTypeGuardError(longString, 'text', 'number');
      expect(error).toBe('Expected text to be "number"');
      expect(error).not.toContain(longString);
    });

    it('should omit value for large objects', () => {
      const largeObject = {
        description: 'a'.repeat(200),
        moreData: 'b'.repeat(50),
      };
      const error = generateTypeGuardError(largeObject, 'config', 'string');
      expect(error).toBe('Expected config to be "string"');
      expect(error).not.toContain('description');
    });

    it('should omit value for large arrays', () => {
      const largeArray = Array.from({ length: 100 }, (_, i) => `item-${i}`);
      const error = generateTypeGuardError(largeArray, 'items', 'string');
      expect(error).toBe('Expected items to be "string"');
      expect(error).not.toContain('item-1');
    });

    it('should handle exactly 200 characters (boundary case)', () => {
      const exactString = 'a'.repeat(196); // 196 + quotes = 198, under 200
      const error = generateTypeGuardError(exactString, 'text', 'number');
      // Should still include the value since it's under the boundary
      expect(error).toContain(exactString);
    });

    it('should handle strings that result in over 200 characters when stringified', () => {
      const longString = 'a'.repeat(250); // This will definitely be over 200 chars when stringified
      const error = generateTypeGuardError(longString, 'text', 'number');
      // Should omit the value since it's over the boundary
      expect(error).toBe('Expected text to be "number"');
      expect(error).not.toContain('aaa');
    });
  });

  describe('special characters and edge cases', () => {
    it('should handle strings with quotes', () => {
      const error = generateTypeGuardError('say "hello"', 'message', 'number');
      expect(error).toBe('Expected message ("say \\"hello\\"") to be "number"');
    });

    it('should handle strings with newlines', () => {
      const error = generateTypeGuardError('line1\nline2', 'text', 'number');
      expect(error).toBe('Expected text ("line1\\nline2") to be "number"');
    });

    it('should handle objects with special characters', () => {
      const objWithSpecialChars = { message: 'hello\nworld', quote: 'say "hi"' };
      const error = generateTypeGuardError(objWithSpecialChars, 'data', 'string');
      expect(error).toContain('Expected data');
      expect(error).toContain('hello\\nworld');
      expect(error).toContain('\\"hi\\"');
    });

    it('should handle circular references by throwing an error (expected behavior)', () => {
      const circular: { name: string; self: unknown } = { name: 'test', self: null };
      circular.self = circular;
      
      // This will throw because JSON.stringify cannot handle circular references
      expect(() => {
        generateTypeGuardError(circular, 'data', 'string');
      }).toThrow('Converting circular structure to JSON');
    });

    it('should handle functions', () => {
      const fn = function testFunction() { return 'test'; };
      const error = generateTypeGuardError(fn, 'callback', 'string');
      expect(error).toContain('Expected callback');
      expect(error).toContain('to be "string"');
    });

    it('should handle symbols by causing an error (expected behavior)', () => {
      const sym = Symbol('test');
      // Symbols cause JSON.stringify to return undefined, which causes an error in generateTypeGuardError
      expect(() => {
        generateTypeGuardError(sym, 'key', 'string');
      }).toThrow();
    });
  });

  describe('identifier and expected type formatting', () => {
    it('should handle complex identifiers', () => {
      const error = generateTypeGuardError('test', 'user.profile.name', 'NonEmptyString');
      expect(error).toBe('Expected user.profile.name ("test") to be "NonEmptyString"');
    });

    it('should handle identifiers with array indices', () => {
      const error = generateTypeGuardError(123, 'users[0].age', 'string');
      expect(error).toBe('Expected users[0].age (123) to be "string"');
    });

    it('should handle complex expected types', () => {
      const error = generateTypeGuardError('test', 'value', 'one of ["a", "b", "c"]');
      expect(error).toBe('Expected value ("test") to be "one of ["a", "b", "c"]"');
    });

    it('should handle union type descriptions', () => {
      const error = generateTypeGuardError(null, 'data', 'string | number');
      expect(error).toBe('Expected data (null) to be "string | number"');
    });

    it('should handle custom type names', () => {
      const error = generateTypeGuardError({}, 'user', 'User');
      expect(error).toBe('Expected user ({}) to be "User"');
    });
  });

  describe('integration with real type guard scenarios', () => {
    it('should work with typical string validation errors', () => {
      const error = generateTypeGuardError(123, 'name', 'string');
      expect(error).toBe('Expected name (123) to be "string"');
    });

    it('should work with typical array validation errors', () => {
      const error = generateTypeGuardError('not-array', 'items', 'Array');
      expect(error).toBe('Expected items ("not-array") to be "Array"');
    });

    it('should work with enum validation errors', () => {
      const error = generateTypeGuardError('INVALID', 'status', 'one of ["PENDING", "APPROVED", "REJECTED"]');
      expect(error).toBe('Expected status ("INVALID") to be "one of ["PENDING", "APPROVED", "REJECTED"]"');
    });

    it('should work with object property validation errors', () => {
      const error = generateTypeGuardError('30', 'user.age', 'number');
      expect(error).toBe('Expected user.age ("30") to be "number"');
    });

    it('should work with nested array item validation errors', () => {
      const error = generateTypeGuardError(123, 'users[2].name', 'string');
      expect(error).toBe('Expected users[2].name (123) to be "string"');
    });
  });
}); 