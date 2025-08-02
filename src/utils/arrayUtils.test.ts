import { by } from './arrayUtils';
import { isType } from '../typeguards/isType';
import { isString } from '../typeguards/isString';
import { isNumber } from '../typeguards/isNumber';

describe('arrayUtils', () => {
  describe('by', () => {
    it('should create array-compatible type guards', () => {
      const arrayGuard = by(isString);
      const strings = ['hello', 'world', 123, 'test'];
      
      const result = strings.filter(arrayGuard);
      
      expect(result).toEqual(['hello', 'world', 'test']);
      expect(result.every(by(isString))).toBe(true);
    });

    it('should work with complex type guards', () => {
      const isUser = isType({ name: isString, age: isNumber });
      const arrayGuard = by(isUser);
      
      const users = [
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: '30' }, // invalid
        { name: 'Charlie', age: 35 },
        { name: 123, age: 40 }, // invalid
      ];
      
      const result = users.filter(arrayGuard);
      
      expect(result).toEqual([
        { name: 'Alice', age: 25 },
        { name: 'Charlie', age: 35 },
      ]);
    });

    it('should work with array methods that pass index and array', () => {
      const arrayGuard = by(isString);
      const strings = ['hello', 'world', 123, 'test'];
      
      // Test that the wrapper handles the extra parameters correctly
      const result = strings.filter((value, index, array) => {
        expect(array).toBe(strings);
        expect(typeof index).toBe('number');
        return arrayGuard(value);
      });
      
      expect(result).toEqual(['hello', 'world', 'test']);
    });
  });

  describe('integration with array methods', () => {
    it('should work with find', () => {
      const arrayGuard = by(isString);
      const items = ['hello', 123, 'world', 456, 'test'];
      
      const result = items.find(arrayGuard);
      
      expect(result).toBe('hello');
    });

    it('should work with findIndex', () => {
      const arrayGuard = by(isString);
      const items = [123, 'hello', 456, 'world'];
      
      const result = items.findIndex(arrayGuard);
      
      expect(result).toBe(1);
    });

    it('should work with some', () => {
      const arrayGuard = by(isString);
      const items = [123, 456, 789];
      
      const result = items.some(arrayGuard);
      
      expect(result).toBe(false);
    });

    it('should work with every', () => {
      const arrayGuard = by(isString);
      const items = ['hello', 'world', 'test'];
      
      const result = items.every(arrayGuard);
      
      expect(result).toBe(true);
    });

    it('should work with map', () => {
      const isUser = isType({ name: isString, age: isNumber });
      const arrayGuard = by(isUser);
      const users = [
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
        { name: 'Charlie', age: 35 },
      ];
      
      const result = users.map((user) => {
        if (arrayGuard(user)) {
          return `${user.name} (${user.age})`;
        }
        return 'Invalid user';
      });
      
      expect(result).toEqual([
        'Alice (25)',
        'Bob (30)',
        'Charlie (35)',
      ]);
    });
  });
}); 