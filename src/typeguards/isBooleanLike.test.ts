import { isBooleanLike } from './isBooleanLike';

describe('isBooleanLike', () => {
  describe('valid boolean-like values', () => {
    it('should accept boolean values', () => {
      expect(isBooleanLike(true)).toBe(true);
      expect(isBooleanLike(false)).toBe(true);
    });

    it('should accept string representations of booleans', () => {
      expect(isBooleanLike("true")).toBe(true);
      expect(isBooleanLike("false")).toBe(true);
      expect(isBooleanLike("TRUE")).toBe(true);
      expect(isBooleanLike("FALSE")).toBe(true);
      expect(isBooleanLike("True")).toBe(true);
      expect(isBooleanLike("False")).toBe(true);
    });

    it('should accept numeric string representations', () => {
      expect(isBooleanLike("1")).toBe(true);
      expect(isBooleanLike("0")).toBe(true);
    });

    it('should accept numeric representations', () => {
      expect(isBooleanLike(1)).toBe(true);
      expect(isBooleanLike(0)).toBe(true);
    });
  });

  describe('invalid boolean-like values', () => {
    it('should reject other string values', () => {
      expect(isBooleanLike("yes")).toBe(false);
      expect(isBooleanLike("no")).toBe(false);
      expect(isBooleanLike("on")).toBe(false);
      expect(isBooleanLike("off")).toBe(false);
      expect(isBooleanLike("enabled")).toBe(false);
      expect(isBooleanLike("disabled")).toBe(false);
      expect(isBooleanLike("")).toBe(false);
      expect(isBooleanLike(" ")).toBe(false);
      expect(isBooleanLike("2")).toBe(false);
      expect(isBooleanLike("-1")).toBe(false);
    });

    it('should reject other numbers', () => {
      expect(isBooleanLike(2)).toBe(false);
      expect(isBooleanLike(-1)).toBe(false);
      expect(isBooleanLike(0.5)).toBe(false);
      expect(isBooleanLike(Infinity)).toBe(false);
      expect(isBooleanLike(-Infinity)).toBe(false);
      expect(isBooleanLike(NaN)).toBe(false);
    });

    it('should reject other types', () => {
      expect(isBooleanLike(null)).toBe(false);
      expect(isBooleanLike(undefined)).toBe(false);
      expect(isBooleanLike([])).toBe(false);
      expect(isBooleanLike({})).toBe(false);
      expect(isBooleanLike(() => {})).toBe(false);
      expect(isBooleanLike(Symbol('test'))).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle case insensitive strings', () => {
      expect(isBooleanLike("TRUE")).toBe(true);
      expect(isBooleanLike("True")).toBe(true);
      expect(isBooleanLike("tRuE")).toBe(true);
      expect(isBooleanLike("FALSE")).toBe(true);
      expect(isBooleanLike("False")).toBe(true);
      expect(isBooleanLike("fAlSe")).toBe(true);
    });

    it('should handle whitespace in strings', () => {
      expect(isBooleanLike(" true ")).toBe(false); // No trimming
      expect(isBooleanLike(" false ")).toBe(false); // No trimming
      expect(isBooleanLike(" 1 ")).toBe(false); // No trimming
      expect(isBooleanLike(" 0 ")).toBe(false); // No trimming
    });

    it('should handle special number values', () => {
      expect(isBooleanLike(Number.MAX_SAFE_INTEGER)).toBe(false);
      expect(isBooleanLike(Number.MIN_SAFE_INTEGER)).toBe(false);
      expect(isBooleanLike(Number.EPSILON)).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should provide meaningful error messages for invalid strings', () => {
      const errors: string[] = [];
      const config = {
        identifier: 'testValue',
        callbackOnError: (error: string) => errors.push(error)
      };

      isBooleanLike("yes", config);
      expect(errors.length).toBe(1);
      expect(errors[0]).toContain('testValue');
      expect(errors[0]).toContain('boolean-like');
    });

    it('should provide meaningful error messages for invalid numbers', () => {
      const errors: string[] = [];
      const config = {
        identifier: 'testValue',
        callbackOnError: (error: string) => errors.push(error)
      };

      isBooleanLike(2, config);
      expect(errors.length).toBe(1);
      expect(errors[0]).toContain('testValue');
      expect(errors[0]).toContain('boolean-like');
    });

    it('should provide meaningful error messages for other types', () => {
      const errors: string[] = [];
      const config = {
        identifier: 'testValue',
        callbackOnError: (error: string) => errors.push(error)
      };

      isBooleanLike(null, config);
      expect(errors.length).toBe(1);
      expect(errors[0]).toContain('testValue');
      expect(errors[0]).toContain('boolean-like');
    });

    it('should not call error callback for valid values', () => {
      const errors: string[] = [];
      const config = {
        identifier: 'testValue',
        callbackOnError: (error: string) => errors.push(error)
      };

      isBooleanLike(true, config);
      isBooleanLike("true", config);
      isBooleanLike(1, config);
      expect(errors.length).toBe(0);
    });
  });

  describe('type narrowing', () => {
    it('should provide proper type narrowing for boolean values', () => {
      const data: unknown = true;
      
      if (isBooleanLike(data)) {
        // TypeScript should know data is boolean
        expect(typeof data).toBe('boolean');
        expect(data).toBe(true);
      }
    });

    it('should provide proper type narrowing for string values', () => {
      const data: unknown = "true";
      
      if (isBooleanLike(data)) {
        // TypeScript should know data is boolean (after conversion)
        expect(typeof data).toBe('string'); // Actually string, but can be converted to boolean
        expect(Boolean(data)).toBe(true);
      }
    });

    it('should provide proper type narrowing for number values', () => {
      const data: unknown = 1;
      
      if (isBooleanLike(data)) {
        // TypeScript should know data is boolean (after conversion)
        expect(typeof data).toBe('number');
        expect(Boolean(data)).toBe(true);
      }
    });
  });

  describe('integration with isIndexSignature', () => {
    it('should work with isIndexSignature for boolean-like values', () => {
      const { isIndexSignature } = require('./isIndexSignature');
      const { isString } = require('./isString');

      const isStringBooleanLikeMap = isIndexSignature(isString, isBooleanLike);

      expect(isStringBooleanLikeMap({ 
        enabled: "true", 
        active: "1", 
        visible: true 
      })).toBe(true);
      
      expect(isStringBooleanLikeMap({ 
        enabled: "yes", 
        active: "1" 
      })).toBe(false); // "yes" is not boolean-like
    });
  });

  describe('real-world use cases', () => {
    it('should handle form input validation', () => {
      // Simulate form data
      const formData = {
        newsletter: "true",
        notifications: "1",
        marketing: "false",
        terms: "0"
      };

      const isFormBoolean = (value: unknown): value is boolean => isBooleanLike(value);
      
      expect(isFormBoolean(formData.newsletter)).toBe(true);
      expect(isFormBoolean(formData.notifications)).toBe(true);
      expect(isFormBoolean(formData.marketing)).toBe(true);
      expect(isFormBoolean(formData.terms)).toBe(true);
    });

    it('should handle API response validation', () => {
      // Simulate API response
      const apiResponse = {
        success: true,
        cached: "false",
        debug: 1,
        verbose: 0
      };

      const isApiBoolean = (value: unknown): value is boolean => isBooleanLike(value);
      
      expect(isApiBoolean(apiResponse.success)).toBe(true);
      expect(isApiBoolean(apiResponse.cached)).toBe(true);
      expect(isApiBoolean(apiResponse.debug)).toBe(true);
      expect(isApiBoolean(apiResponse.verbose)).toBe(true);
    });

    it('should handle configuration file validation', () => {
      // Simulate config file
      const config = {
        development: "true",
        production: "false",
        logging: 1,
        analytics: 0
      };

      const isConfigBoolean = (value: unknown): value is boolean => isBooleanLike(value);
      
      expect(isConfigBoolean(config.development)).toBe(true);
      expect(isConfigBoolean(config.production)).toBe(true);
      expect(isConfigBoolean(config.logging)).toBe(true);
      expect(isConfigBoolean(config.analytics)).toBe(true);
    });
  });
}); 