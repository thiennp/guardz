import { isBigInt } from './isBigInt';

describe('isBigInt', () => {
  describe('valid BigInt values', () => {
    it('should return true for BigInt literals', () => {
      expect(isBigInt(BigInt(123))).toBe(true);
      expect(isBigInt(BigInt(0))).toBe(true);
      expect(isBigInt(BigInt(-123))).toBe(true);
    });

    it('should return true for BigInt created from strings', () => {
      expect(isBigInt(BigInt('123'))).toBe(true);
      expect(isBigInt(BigInt('9007199254740991'))).toBe(true); // larger than safe integer
      expect(isBigInt(BigInt('-456'))).toBe(true);
    });

    it('should return true for large BigInt values', () => {
      expect(isBigInt(BigInt('123456789012345678901234567890'))).toBe(true);
      expect(isBigInt(BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1))).toBe(true);
      expect(isBigInt(BigInt(Number.MIN_SAFE_INTEGER) - BigInt(1))).toBe(true);
    });
  });

  describe('invalid values', () => {
    it('should return false for regular numbers', () => {
      expect(isBigInt(123)).toBe(false);
      expect(isBigInt(0)).toBe(false);
      expect(isBigInt(-123)).toBe(false);
      expect(isBigInt(3.14)).toBe(false);
      expect(isBigInt(Number.MAX_SAFE_INTEGER)).toBe(false);
      expect(isBigInt(Infinity)).toBe(false);
      expect(isBigInt(NaN)).toBe(false);
    });

    it('should return false for strings', () => {
      expect(isBigInt('123')).toBe(false);
      expect(isBigInt('0')).toBe(false);
      expect(isBigInt('')).toBe(false);
      expect(isBigInt('hello')).toBe(false);
    });

    it('should return false for other types', () => {
      expect(isBigInt(null)).toBe(false);
      expect(isBigInt(undefined)).toBe(false);
      expect(isBigInt(true)).toBe(false);
      expect(isBigInt(false)).toBe(false);
      expect(isBigInt({})).toBe(false);
      expect(isBigInt([])).toBe(false);
      expect(isBigInt(() => {})).toBe(false);
      expect(isBigInt(Symbol('test'))).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should not call error callback for valid BigInt values', () => {
      const mockCallback = jest.fn();
      const config = { identifier: 'largeId', callbackOnError: mockCallback };

      isBigInt(BigInt(123), config);
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should call error callback for regular numbers', () => {
      const mockCallback = jest.fn();
      const config = { identifier: 'largeId', callbackOnError: mockCallback };

      isBigInt(123, config);
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected largeId (123) to be "bigint"'
      );
    });

    it('should call error callback for strings', () => {
      const mockCallback = jest.fn();
      const config = { identifier: 'largeId', callbackOnError: mockCallback };

      isBigInt('123', config);
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected largeId ("123") to be "bigint"'
      );
    });

    it('should call error callback for null and undefined', () => {
      const mockCallback = jest.fn();
      const config = { identifier: 'largeId', callbackOnError: mockCallback };

      isBigInt(null, config);
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected largeId (null) to be "bigint"'
      );

      mockCallback.mockClear();
      isBigInt(undefined, config);
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected largeId (undefined) to be "bigint"'
      );
    });

    it('should call error callback for objects', () => {
      const mockCallback = jest.fn();
      const config = { identifier: 'largeId', callbackOnError: mockCallback };

      isBigInt({}, config);
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected largeId ({}) to be "bigint"'
      );
    });
  });

  describe('edge cases', () => {
    it('should handle zero BigInt', () => {
      expect(isBigInt(BigInt(0))).toBe(true);
      expect(isBigInt(0)).toBe(false); // regular zero
    });

    it('should distinguish BigInt from regular numbers', () => {
      const regularNumber = 123;
      const bigIntNumber = BigInt(123);

      expect(isBigInt(regularNumber)).toBe(false);
      expect(isBigInt(bigIntNumber)).toBe(true);
      expect(regularNumber === Number(bigIntNumber)).toBe(true); // same value
      expect(typeof regularNumber === typeof bigIntNumber).toBe(false); // different types
    });

    it('should handle very large values that exceed Number.MAX_SAFE_INTEGER', () => {
      const veryLargeValue = BigInt('9007199254740992'); // MAX_SAFE_INTEGER + 1
      expect(isBigInt(veryLargeValue)).toBe(true);
      expect(isBigInt(9007199254740992)).toBe(false); // same value as regular number
    });
  });

  describe('real-world use cases', () => {
    it('should validate large database IDs', () => {
      // Database IDs that might exceed JavaScript's safe integer range
      const largeId1 = BigInt('9223372036854775807'); // Max 64-bit signed integer
      const largeId2 = BigInt('18446744073709551615'); // Max 64-bit unsigned integer

      expect(isBigInt(largeId1)).toBe(true);
      expect(isBigInt(largeId2)).toBe(true);
      expect(isBigInt('9223372036854775807')).toBe(false); // string version
      expect(isBigInt('9223372036854775807')).toBe(false); // regular number (likely imprecise)
    });

    it('should validate cryptocurrency amounts', () => {
      // Cryptocurrency amounts often use very large integers for precision
      const satoshiAmount = BigInt('2100000000000000'); // 21 million BTC in satoshis
      const weiAmount = BigInt('1000000000000000000'); // 1 ETH in wei

      expect(isBigInt(satoshiAmount)).toBe(true);
      expect(isBigInt(weiAmount)).toBe(true);
      expect(isBigInt(2100000000000000)).toBe(false); // regular number version
    });

    it('should validate high-precision timestamps', () => {
      // Nanosecond precision timestamps
      const nanosecondTimestamp = BigInt('1640995200000000000'); // 2022-01-01 in nanoseconds

      expect(isBigInt(nanosecondTimestamp)).toBe(true);
      expect(isBigInt(1640995200000)).toBe(false); // millisecond timestamp as regular number
      expect(isBigInt('1640995200000000000')).toBe(false); // string version
    });

    it('should validate mathematical calculations with large numbers', () => {
      // Large mathematical operations
      const largeFactorial = BigInt('12345678901234567890');
      const largePower = BigInt(2) ** BigInt(100);

      expect(isBigInt(largeFactorial)).toBe(true);
      expect(isBigInt(largePower)).toBe(true);
      expect(isBigInt(Math.pow(2, 100))).toBe(false); // regular Math.pow returns Infinity for large values
    });

    it('should validate financial data in smallest units', () => {
      // Financial amounts in smallest currency units to avoid floating point errors
      const priceInCents = BigInt('299'); // $2.99 in cents
      const largeTransactionInCents = BigInt('999999999999'); // Very large transaction

      expect(isBigInt(priceInCents)).toBe(true);
      expect(isBigInt(largeTransactionInCents)).toBe(true);
      expect(isBigInt(299)).toBe(false); // regular number
      expect(isBigInt(2.99)).toBe(false); // decimal amount
    });

    it('should handle data validation scenarios', () => {
      // Simulating API data validation
      const apiResponses = [
        BigInt('123456789012345678901234567890'), // valid BigInt
        '123456789012345678901234567890', // string (invalid)
        '123456789012345678901234567890', // number (likely imprecise, invalid)
        null, // null (invalid)
        undefined, // undefined (invalid)
        {}, // object (invalid)
      ];

      const validResponses = apiResponses.filter(value => isBigInt(value));
      expect(validResponses).toHaveLength(1);
      expect(validResponses[0]).toBe(apiResponses[0]);
    });
  });
});
