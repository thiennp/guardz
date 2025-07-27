import { toBoolean } from './toBoolean';
import { isBooleanLike } from '../typeguards/isBooleanLike';
import type { BooleanLike } from '../types/BooleanLike';

describe('toBoolean', () => {
  describe('conversion from booleans', () => {
    it('should return the same boolean for boolean inputs', () => {
      const testValues = [true, false];
      
      testValues.forEach(value => {
        if (isBooleanLike(value)) {
          expect(toBoolean(value)).toBe(value);
        }
      });
    });
  });

  describe('conversion from boolean strings', () => {
    it('should convert "true" and "false" strings', () => {
      const testValues = ['true', 'false'];
      
      testValues.forEach(value => {
        if (isBooleanLike(value)) {
          expect(toBoolean(value)).toBe(value === 'true');
        }
      });
    });

    it('should convert "1" and "0" strings', () => {
      const testValues = ['1', '0'];
      
      testValues.forEach(value => {
        if (isBooleanLike(value)) {
          expect(toBoolean(value)).toBe(value === '1');
        }
      });
    });

    it('should handle case insensitive strings', () => {
      const trueValues = ['TRUE', 'True', 'true'];
      const falseValues = ['FALSE', 'False', 'false'];
      
      trueValues.forEach(value => {
        if (isBooleanLike(value)) {
          expect(toBoolean(value)).toBe(true);
        }
      });
      
      falseValues.forEach(value => {
        if (isBooleanLike(value)) {
          expect(toBoolean(value)).toBe(false);
        }
      });
    });

    it('should handle whitespace in strings', () => {
      const testValues = [' true ', ' false ', ' 1 ', ' 0 '];
      
      testValues.forEach(value => {
        if (isBooleanLike(value)) {
          const expected = value.trim().toLowerCase() === 'true' || value.trim() === '1';
          expect(toBoolean(value)).toBe(expected);
        }
      });
    });
  });

  describe('conversion from numbers', () => {
    it('should convert 1 and 0 numbers', () => {
      expect(toBoolean(1 as BooleanLike)).toBe(true);
      expect(toBoolean(0 as BooleanLike)).toBe(false);
    });

    it('should handle special number values', () => {
      // Only 1 should be true, everything else should be false
      expect(toBoolean(1 as BooleanLike)).toBe(true);
      expect(toBoolean(0 as BooleanLike)).toBe(false);
      expect(toBoolean(-1 as BooleanLike)).toBe(false);
      expect(toBoolean(2 as BooleanLike)).toBe(false);
      expect(toBoolean(0.5 as BooleanLike)).toBe(false);
      expect(toBoolean(Infinity as BooleanLike)).toBe(false);
      expect(toBoolean(-Infinity as BooleanLike)).toBe(false);
    });
  });

  describe('type safety', () => {
    it('should maintain type safety with branded types', () => {
      const booleanLikeValue: BooleanLike = 'true';
      const result = toBoolean(booleanLikeValue);
      
      // TypeScript should know this is a boolean
      expect(typeof result).toBe('boolean');
      expect(result).toBe(true);
    });

    it('should work with type guards', () => {
      const data: unknown = '1';
      if (typeof data === 'string' && (data === 'true' || data === 'false' || data === '1' || data === '0')) {
        const booleanLikeData = data as BooleanLike;
        const result = toBoolean(booleanLikeData);
        
        expect(typeof result).toBe('boolean');
        expect(result).toBe(true);
      }
    });
  });

  describe('real-world scenarios', () => {
    it('should handle form input validation', () => {
      const formData = {
        isActive: 'true' as BooleanLike,
        isSubscribed: '1' as BooleanLike,
        isVerified: false as BooleanLike,
        isPremium: 0 as BooleanLike,
      };

      const processedData = {
        isActive: toBoolean(formData.isActive),
        isSubscribed: toBoolean(formData.isSubscribed),
        isVerified: toBoolean(formData.isVerified),
        isPremium: toBoolean(formData.isPremium),
      };

      expect(processedData.isActive).toBe(true);
      expect(processedData.isSubscribed).toBe(true);
      expect(processedData.isVerified).toBe(false);
      expect(processedData.isPremium).toBe(false);
    });

    it('should handle API response processing', () => {
      const apiResponse = {
        success: 'true' as BooleanLike,
        hasData: 1 as BooleanLike,
        isError: 'false' as BooleanLike,
        isPending: 0 as BooleanLike,
      };

      const processedResponse = {
        success: toBoolean(apiResponse.success),
        hasData: toBoolean(apiResponse.hasData),
        isError: toBoolean(apiResponse.isError),
        isPending: toBoolean(apiResponse.isPending),
      };

      expect(processedResponse.success).toBe(true);
      expect(processedResponse.hasData).toBe(true);
      expect(processedResponse.isError).toBe(false);
      expect(processedResponse.isPending).toBe(false);
    });

    it('should handle configuration parsing', () => {
      const config = {
        debug: 'true' as BooleanLike,
        verbose: 1 as BooleanLike,
        silent: 'false' as BooleanLike,
        quiet: 0 as BooleanLike,
      };

      const parsedConfig = {
        debug: toBoolean(config.debug),
        verbose: toBoolean(config.verbose),
        silent: toBoolean(config.silent),
        quiet: toBoolean(config.quiet),
      };

      expect(parsedConfig.debug).toBe(true);
      expect(parsedConfig.verbose).toBe(true);
      expect(parsedConfig.silent).toBe(false);
      expect(parsedConfig.quiet).toBe(false);
    });

    it('should handle database boolean fields', () => {
      const dbRecord = {
        isDeleted: '0' as BooleanLike,
        isArchived: 1 as BooleanLike,
        isPublic: 'true' as BooleanLike,
        isLocked: false as BooleanLike,
      };

      const processedRecord = {
        isDeleted: toBoolean(dbRecord.isDeleted),
        isArchived: toBoolean(dbRecord.isArchived),
        isPublic: toBoolean(dbRecord.isPublic),
        isLocked: toBoolean(dbRecord.isLocked),
      };

      expect(processedRecord.isDeleted).toBe(false);
      expect(processedRecord.isArchived).toBe(true);
      expect(processedRecord.isPublic).toBe(true);
      expect(processedRecord.isLocked).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings correctly', () => {
      // Note: Empty strings are not valid BooleanLike values,
      // but we test the function behavior for completeness
      expect(toBoolean('' as BooleanLike)).toBe(false);
    });

    it('should handle whitespace-only strings', () => {
      expect(toBoolean('   ' as BooleanLike)).toBe(false);
      expect(toBoolean('\t' as BooleanLike)).toBe(false);
      expect(toBoolean('\n' as BooleanLike)).toBe(false);
    });

    it('should handle mixed case variations', () => {
      const trueVariations = ['TRUE', 'True', 'true', 'TrUe'];
      const falseVariations = ['FALSE', 'False', 'false', 'FaLsE'];

      trueVariations.forEach(variation => {
        expect(toBoolean(variation as BooleanLike)).toBe(true);
      });

      falseVariations.forEach(variation => {
        expect(toBoolean(variation as BooleanLike)).toBe(false);
      });
    });

    it('should handle numeric edge cases', () => {
      expect(toBoolean(1 as BooleanLike)).toBe(true);
      expect(toBoolean(0 as BooleanLike)).toBe(false);
      expect(toBoolean(Number.MAX_SAFE_INTEGER as BooleanLike)).toBe(false);
      expect(toBoolean(Number.MIN_SAFE_INTEGER as BooleanLike)).toBe(false);
      expect(toBoolean(Number.MAX_VALUE as BooleanLike)).toBe(false);
      expect(toBoolean(Number.MIN_VALUE as BooleanLike)).toBe(false);
    });
  });

  describe('performance', () => {
    it('should handle large number of conversions efficiently', () => {
      const start = performance.now();
      
      for (let i = 0; i < 10000; i++) {
        toBoolean(true as BooleanLike);
        toBoolean(false as BooleanLike);
        toBoolean('true' as BooleanLike);
        toBoolean('false' as BooleanLike);
        toBoolean('1' as BooleanLike);
        toBoolean('0' as BooleanLike);
        toBoolean(1 as BooleanLike);
        toBoolean(0 as BooleanLike);
      }
      
      const end = performance.now();
      const duration = end - start;
      
      // Should complete in reasonable time (less than 100ms)
      expect(duration).toBeLessThan(100);
    });
  });

  describe('comprehensive conversion matrix', () => {
    it('should handle all valid BooleanLike inputs correctly', () => {
      const testCases = [
        // Boolean inputs
        { input: true as BooleanLike, expected: true },
        { input: false as BooleanLike, expected: false },
        
        // String inputs - true values
        { input: 'true' as BooleanLike, expected: true },
        { input: 'TRUE' as BooleanLike, expected: true },
        { input: 'True' as BooleanLike, expected: true },
        { input: '1' as BooleanLike, expected: true },
        
        // String inputs - false values
        { input: 'false' as BooleanLike, expected: false },
        { input: 'FALSE' as BooleanLike, expected: false },
        { input: 'False' as BooleanLike, expected: false },
        { input: '0' as BooleanLike, expected: false },
        
        // Number inputs
        { input: 1 as BooleanLike, expected: true },
        { input: 0 as BooleanLike, expected: false },
      ];

      testCases.forEach(({ input, expected }) => {
        expect(toBoolean(input)).toBe(expected);
      });
    });
  });
}); 