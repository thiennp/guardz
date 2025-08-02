import { isSymbol } from './isSymbol';
import { by } from '../utils/arrayUtils';

describe('isSymbol', () => {
  describe('basic functionality', () => {
    it('should return true for Symbol values', () => {
      const symbol1 = Symbol('test');
      const symbol2 = Symbol('unique');
      const symbol3 = Symbol();

      expect(isSymbol(symbol1)).toBe(true);
      expect(isSymbol(symbol2)).toBe(true);
      expect(isSymbol(symbol3)).toBe(true);
    });

    it('should return false for non-Symbol values', () => {
      expect(isSymbol('string')).toBe(false);
      expect(isSymbol(123)).toBe(false);
      expect(isSymbol(true)).toBe(false);
      expect(isSymbol(null)).toBe(false);
      expect(isSymbol(undefined)).toBe(false);
      expect(isSymbol({})).toBe(false);
      expect(isSymbol([])).toBe(false);
      expect(isSymbol(() => {})).toBe(false);
    });

    it('should provide proper type narrowing', () => {
      const data: unknown = Symbol('user');
      
      if (isSymbol(data)) {
        // data should be typed as symbol
        expect(typeof data).toBe('symbol');
        expect(data.toString()).toContain('Symbol(user)');
      } else {
        expect(true).toBe(false); // Type narrowing should work
      }
    });
  });

  describe('error handling', () => {
    it('should call error callback when validation fails', () => {
      const mockCallback = jest.fn();
      const config = {
        callbackOnError: mockCallback,
        identifier: 'test'
      };

      const result = isSymbol('not a symbol', config);

      expect(result).toBe(false);
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected test ("not a symbol") to be "symbol"'
      );
    });

    it('should not call error callback when validation passes', () => {
      const mockCallback = jest.fn();
      const config = {
        callbackOnError: mockCallback,
        identifier: 'test'
      };

      const result = isSymbol(Symbol('test'), config);

      expect(result).toBe(true);
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should work without config', () => {
      expect(isSymbol(Symbol('test'))).toBe(true);
      expect(isSymbol('not a symbol')).toBe(false);
    });

    it('should work with null config', () => {
      expect(isSymbol(Symbol('test'), null)).toBe(true);
      expect(isSymbol('not a symbol', null)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle Symbol.for() created symbols', () => {
      const globalSymbol = Symbol.for('global');
      expect(isSymbol(globalSymbol)).toBe(true);
    });

    it('should handle well-known symbols', () => {
      expect(isSymbol(Symbol.iterator)).toBe(true);
      expect(isSymbol(Symbol.toStringTag)).toBe(true);
      expect(isSymbol(Symbol.toPrimitive)).toBe(true);
    });

    it('should handle unique symbols', () => {
      const uniqueSymbol = Symbol('unique');
      expect(isSymbol(uniqueSymbol)).toBe(true);
    });

    it('should handle empty symbols', () => {
      const emptySymbol = Symbol();
      expect(isSymbol(emptySymbol)).toBe(true);
    });
  });

  describe('real-world use cases', () => {
    it('should work with branded types', () => {
      const UserIdBrand = Symbol('UserId');
      
      const userId: unknown = UserIdBrand;
      if (isSymbol(userId)) {
        expect(typeof userId).toBe('symbol');
        expect(userId.toString()).toContain('Symbol(UserId)');
      } else {
        expect(true).toBe(false); // Should validate symbol for branded type
      }
    });

    it('should work with array filtering', () => {
      const mixedData = [
        Symbol('a'),
        'string',
        123,
        Symbol('b'),
        Symbol('c')
      ];

      const symbols = mixedData.filter(by(isSymbol));
      
      expect(symbols).toHaveLength(3);
      expect(symbols.every(s => typeof s === 'symbol')).toBe(true);
    });

    it('should work with object property validation', () => {
      const obj = {
        id: Symbol('id'),
        name: 'John',
        age: 30
      };

      const isIdSymbol = isSymbol(obj.id);
      const isNameSymbol = isSymbol(obj.name);

      expect(isIdSymbol).toBe(true);
      expect(isNameSymbol).toBe(false);
    });
  });
}); 