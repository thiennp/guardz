import { stringify } from './stringify';

describe('stringify', () => {
  describe('basic functionality', () => {
    it('should handle undefined values', () => {
      expect(stringify(undefined)).toBe('undefined');
    });

    it('should handle Date objects', () => {
      const validDate = new Date('2023-01-01T00:00:00.000Z');
      expect(stringify(validDate)).toBe('2023-01-01T00:00:00.000Z');
      
      const invalidDate = new Date('invalid');
      expect(stringify(invalidDate)).toBe('Invalid Date');
    });

    it('should handle functions', () => {
      const testFunction = () => 'test';
      expect(stringify(testFunction)).toBe('function');
      
      const asyncFunction = async () => 'test';
      expect(stringify(asyncFunction)).toBe('function');
      
      const arrowFunction = () => {};
      expect(stringify(arrowFunction)).toBe('function');
    });

    it('should handle Error objects', () => {
      const error = new Error('Test error');
      expect(stringify(error)).toBe('Error');
      
      const typeError = new TypeError('Type error');
      expect(stringify(typeError)).toBe('Error');
      
      const referenceError = new ReferenceError('Reference error');
      expect(stringify(referenceError)).toBe('Error');
    });

    it('should handle NaN', () => {
      expect(stringify(NaN)).toBe('NaN');
    });

    it('should handle Infinity', () => {
      expect(stringify(Infinity)).toBe('Infinity');
      expect(stringify(-Infinity)).toBe('-Infinity');
    });
  });

  describe('JSON serialization', () => {
    it('should handle primitive values', () => {
      expect(stringify('hello')).toBe('"hello"');
      expect(stringify(123)).toBe('123');
      expect(stringify(true)).toBe('true');
      expect(stringify(false)).toBe('false');
      expect(stringify(null)).toBe('null');
    });

    it('should handle arrays', () => {
      expect(stringify([1, 2, 3])).toBe('[\n  1,\n  2,\n  3\n]');
      expect(stringify(['a', 'b', 'c'])).toBe('[\n  "a",\n  "b",\n  "c"\n]');
      expect(stringify([])).toBe('[]');
    });

    it('should handle objects', () => {
      const obj = { name: 'John', age: 30 };
      expect(stringify(obj)).toBe('{\n  "name": "John",\n  "age": 30\n}');
      
      const emptyObj = {};
      expect(stringify(emptyObj)).toBe('{}');
    });

    it('should handle nested structures', () => {
      const nested = {
        user: {
          name: 'John',
          hobbies: ['reading', 'coding']
        }
      };
      expect(stringify(nested)).toBe('{\n  "user": {\n    "name": "John",\n    "hobbies": [\n      "reading",\n      "coding"\n    ]\n  }\n}');
    });

    it('should handle mixed types', () => {
      const mixed = {
        string: 'hello',
        number: 123,
        boolean: true,
        null: null,
        array: [1, 'two', false],
        object: { nested: true }
      };
      expect(stringify(mixed)).toBe('{\n  "string": "hello",\n  "number": 123,\n  "boolean": true,\n  "null": null,\n  "array": [\n    1,\n    "two",\n    false\n  ],\n  "object": {\n    "nested": true\n  }\n}');
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings', () => {
      expect(stringify('')).toBe('""');
    });

    it('should handle zero values', () => {
      expect(stringify(0)).toBe('0');
      expect(stringify(-0)).toBe('0');
    });

    it('should handle large numbers', () => {
      expect(stringify(Number.MAX_SAFE_INTEGER)).toBe('9007199254740991');
      expect(stringify(Number.MIN_SAFE_INTEGER)).toBe('-9007199254740991');
    });

    it('should handle special characters in strings', () => {
      expect(stringify('hello\nworld')).toBe('"hello\\nworld"');
      expect(stringify('hello\tworld')).toBe('"hello\\tworld"');
      expect(stringify('hello"world')).toBe('"hello\\"world"');
    });

    it('should handle objects with special keys', () => {
      const obj = {
        'special-key': 'value',
        'key with spaces': 'value',
        'key.with.dots': 'value'
      };
      expect(stringify(obj)).toBe('{\n  "special-key": "value",\n  "key with spaces": "value",\n  "key.with.dots": "value"\n}');
    });

    it('should handle arrays with mixed types', () => {
      const mixedArray = [1, 'string', true, null, { key: 'value' }, [1, 2, 3]];
      expect(stringify(mixedArray)).toBe('[\n  1,\n  "string",\n  true,\n  null,\n  {\n    "key": "value"\n  },\n  [\n    1,\n    2,\n    3\n  ]\n]');
    });
  });

  describe('real-world scenarios', () => {
    it('should handle API response objects', () => {
      const apiResponse = {
        success: true,
        data: {
          users: [
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' }
          ],
          total: 2
        },
        timestamp: new Date('2023-01-01T00:00:00.000Z')
      };
      
      const result = stringify(apiResponse);
      expect(result).toContain('"success": true');
      expect(result).toContain('"users":');
      expect(result).toContain('"id": 1');
      expect(result).toContain('"name": "John"');
    });

    it('should handle configuration objects', () => {
      const config = {
        database: {
          host: 'localhost',
          port: 5432,
          credentials: {
            username: 'admin',
            password: 'secret'
          }
        },
        features: {
          logging: true,
          caching: false
        }
      };
      
      const result = stringify(config);
      expect(result).toContain('"database":');
      expect(result).toContain('"host": "localhost"');
      expect(result).toContain('"port": 5432');
    });
  });

  describe('performance', () => {
    it('should handle large objects efficiently', () => {
      const largeObj: Record<string, any> = {};
      for (let i = 0; i < 1000; i++) {
        largeObj[`key${i}`] = `value${i}`;
      }
      
      const start = performance.now();
      const result = stringify(largeObj);
      const end = performance.now();
      
      expect(result).toContain('"key0": "value0"');
      expect(result).toContain('"key999": "value999"');
      expect(end - start).toBeLessThan(100); // Should complete in less than 100ms
    });
  });
}); 