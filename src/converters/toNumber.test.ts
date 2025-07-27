import { toNumber } from './toNumber';
import { isNumeric } from '../typeguards/isNumeric';
import type { Numeric } from '../types/Numeric';

describe('toNumber', () => {
  describe('conversion from numbers', () => {
    it('should return the same number for numeric inputs', () => {
      const testValues = [42, 0, -123, 3.14, Infinity, -Infinity];
      
      testValues.forEach(value => {
        if (isNumeric(value)) {
          expect(toNumber(value)).toBe(value);
        }
      });
    });

    it('should handle very large and small numbers', () => {
      const testValues = [
        Number.MAX_SAFE_INTEGER,
        Number.MIN_SAFE_INTEGER,
        Number.MAX_VALUE,
        Number.MIN_VALUE
      ];
      
      testValues.forEach(value => {
        if (isNumeric(value)) {
          expect(toNumber(value)).toBe(value);
        }
      });
    });
  });

  describe('conversion from strings', () => {
    it('should convert integer strings to numbers', () => {
      const testValues = ['42', '0', '-123', '1000'];
      
      testValues.forEach(value => {
        if (isNumeric(value)) {
          expect(toNumber(value)).toBe(Number(value));
        }
      });
    });

    it('should convert decimal strings to numbers', () => {
      const testValues = ['3.14', '0.5', '-2.718', '123.456'];
      
      testValues.forEach(value => {
        if (isNumeric(value)) {
          expect(toNumber(value)).toBe(Number(value));
        }
      });
    });

    it('should convert scientific notation strings', () => {
      const testValues = ['1e3', '1.5e2', '1e-3', '-2.5e-1'];
      
      testValues.forEach(value => {
        if (isNumeric(value)) {
          expect(toNumber(value)).toBe(Number(value));
        }
      });
    });

    it('should convert hexadecimal strings', () => {
      const testValues = ['0xFF', '0x1A', '0x0'];
      
      testValues.forEach(value => {
        if (isNumeric(value)) {
          expect(toNumber(value)).toBe(Number(value));
        }
      });
    });

    it('should handle edge case strings', () => {
      const testValues = ['0', '+0', '-0', '0.0'];
      
      testValues.forEach(value => {
        if (isNumeric(value)) {
          expect(toNumber(value)).toBe(Number(value));
        }
      });
    });
  });

  describe('type safety', () => {
    it('should maintain type safety with branded types', () => {
      const data: unknown = '42.5';
      if (isNumeric(data)) {
        const result = toNumber(data);
        
        // TypeScript should know this is a number
        expect(typeof result).toBe('number');
        expect(result.toFixed(2)).toBe('42.50');
      }
    });

    it('should work with type guards', () => {
      const data: unknown = '123';
      if (isNumeric(data)) {
        const result = toNumber(data);
        
        expect(typeof result).toBe('number');
        expect(result).toBe(123);
      }
    });
  });

  describe('real-world scenarios', () => {
    it('should handle form input validation', () => {
      const formData = {
        age: '25',
        price: '19.99',
        quantity: 5,
      };

      const processedData: Record<string, number> = {};
      
      if (isNumeric(formData.age)) {
        processedData.age = toNumber(formData.age);
      }
      if (isNumeric(formData.price)) {
        processedData.price = toNumber(formData.price);
      }
      if (isNumeric(formData.quantity)) {
        processedData.quantity = toNumber(formData.quantity);
      }

      expect(processedData.age).toBe(25);
      expect(processedData.price).toBe(19.99);
      expect(processedData.quantity).toBe(5);
    });

    it('should handle API response processing', () => {
      const apiResponse = {
        id: '123',
        score: 95.5,
        count: '42',
      };

      const processedResponse: Record<string, number> = {};
      
      if (isNumeric(apiResponse.id)) {
        processedResponse.id = toNumber(apiResponse.id);
      }
      if (isNumeric(apiResponse.score)) {
        processedResponse.score = toNumber(apiResponse.score);
      }
      if (isNumeric(apiResponse.count)) {
        processedResponse.count = toNumber(apiResponse.count);
      }

      expect(processedResponse.id).toBe(123);
      expect(processedResponse.score).toBe(95.5);
      expect(processedResponse.count).toBe(42);
    });

    it('should handle configuration parsing', () => {
      const config = {
        timeout: '5000',
        retries: 3,
        threshold: '0.95',
      };

      const parsedConfig: Record<string, number> = {};
      
      if (isNumeric(config.timeout)) {
        parsedConfig.timeout = toNumber(config.timeout);
      }
      if (isNumeric(config.retries)) {
        parsedConfig.retries = toNumber(config.retries);
      }
      if (isNumeric(config.threshold)) {
        parsedConfig.threshold = toNumber(config.threshold);
      }

      expect(parsedConfig.timeout).toBe(5000);
      expect(parsedConfig.retries).toBe(3);
      expect(parsedConfig.threshold).toBe(0.95);
    });
  });

  describe('performance', () => {
    it('should handle large number of conversions efficiently', () => {
      const start = performance.now();
      
      for (let i = 0; i < 10000; i++) {
        if (isNumeric(i)) {
          toNumber(i);
        }
        if (isNumeric(i.toString())) {
          toNumber(i.toString());
        }
      }
      
      const end = performance.now();
      const duration = end - start;
      
      // Should complete in reasonable time (less than 100ms)
      expect(duration).toBeLessThan(100);
    });
  });
}); 