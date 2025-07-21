import { createValidationResult } from './createValidationResult';
import { ValidationResult, ValidationError, ValidationTree } from './validationTypes';

describe('createValidationResult', () => {
  describe('basic functionality', () => {
    it('should create a valid result with no errors', () => {
      const result = createValidationResult(true);
      
      expect(result).toEqual({
        valid: true,
        errors: []
      });
    });

    it('should create an invalid result with no errors', () => {
      const result = createValidationResult(false);
      
      expect(result).toEqual({
        valid: false,
        errors: []
      });
    });

    it('should create a result with custom errors', () => {
      const errors: ValidationError[] = [
        {
          path: 'user.name',
          expectedType: 'string',
          actualValue: 123,
          message: 'Expected user.name (123) to be "string"'
        }
      ];
      
      const result = createValidationResult(false, errors);
      
      expect(result).toEqual({
        valid: false,
        errors
      });
    });

    it('should create a result with tree', () => {
      const tree: ValidationTree = {
        valid: true,
        path: 'user',
        children: {},
        errors: []
      };
      
      const result = createValidationResult(true, [], tree);
      
      expect(result).toEqual({
        valid: true,
        errors: [],
        tree
      });
    });

    it('should create a complete result with all parameters', () => {
      const errors: ValidationError[] = [
        {
          path: 'user.age',
          expectedType: 'number',
          actualValue: '25',
          message: 'Expected user.age ("25") to be "number"'
        }
      ];
      
      const tree: ValidationTree = {
        valid: false,
        path: 'user',
        children: {},
        errors
      };
      
      const result = createValidationResult(false, errors, tree);
      
      expect(result).toEqual({
        valid: false,
        errors,
        tree
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty errors array', () => {
      const result = createValidationResult(true, []);
      
      expect(result.errors).toEqual([]);
      expect(result.valid).toBe(true);
    });

    it('should handle undefined errors parameter', () => {
      const result = createValidationResult(true, undefined as any);
      
      expect(result.errors).toEqual([]);
      expect(result.valid).toBe(true);
    });

    it('should handle null errors parameter', () => {
      const result = createValidationResult(true, null as any);
      
      expect(result.errors).toEqual([]);
      expect(result.valid).toBe(true);
    });

    it('should handle undefined tree parameter', () => {
      const result = createValidationResult(true, [], undefined);
      
      expect(result).toEqual({
        valid: true,
        errors: []
      });
      expect(result.tree).toBeUndefined();
    });

    it('should handle null tree parameter', () => {
      const result = createValidationResult(true, [], null as any);
      
      expect(result).toEqual({
        valid: true,
        errors: []
      });
      expect(result.tree).toBeUndefined();
    });
  });

  describe('immutability', () => {
    it('should not mutate input errors array', () => {
      const originalErrors: ValidationError[] = [
        {
          path: 'test',
          expectedType: 'string',
          actualValue: 123,
          message: 'test error'
        }
      ];
      
      const result = createValidationResult(false, originalErrors);
      
      // Modify the result errors
      result.errors.push({
        path: 'test2',
        expectedType: 'number',
        actualValue: 'abc',
        message: 'test error 2'
      });
      
      // Original array should remain unchanged
      expect(originalErrors).toHaveLength(1);
      expect(result.errors).toHaveLength(2);
    });

    it('should not mutate input tree object', () => {
      const originalTree: ValidationTree = {
        valid: true,
        path: 'test',
        children: {},
        errors: []
      };
      
      const result = createValidationResult(true, [], originalTree);
      
      // Modify the result tree
      result.tree!.valid = false;
      
      // Original tree should remain unchanged
      expect(originalTree.valid).toBe(true);
      expect(result.tree!.valid).toBe(false);
    });
  });

  describe('type safety', () => {
    it('should maintain correct types for valid result', () => {
      const result: ValidationResult = createValidationResult(true);
      
      expect(typeof result.valid).toBe('boolean');
      expect(Array.isArray(result.errors)).toBe(true);
      expect(result.valid).toBe(true);
    });

    it('should maintain correct types for invalid result', () => {
      const result: ValidationResult = createValidationResult(false);
      
      expect(typeof result.valid).toBe('boolean');
      expect(Array.isArray(result.errors)).toBe(true);
      expect(result.valid).toBe(false);
    });
  });

  describe('performance', () => {
    it('should handle large number of calls efficiently', () => {
      const start = performance.now();
      
      for (const i of Array.from({ length: 10000 }, (_, i) => i)) {
        createValidationResult(i % 2 === 0);
      }
      
      const end = performance.now();
      expect(end - start).toBeLessThan(100); // Should complete in less than 100ms
    });

    it('should handle large error arrays efficiently', () => {
      const largeErrors: ValidationError[] = Array.from({ length: 1000 }, (_, i) => ({
        path: `property.${i}`,
        expectedType: 'string',
        actualValue: i,
        message: `Error ${i}`
      }));
      
      const start = performance.now();
      const result = createValidationResult(false, largeErrors);
      const end = performance.now();
      
      expect(result.errors).toHaveLength(1000);
      expect(end - start).toBeLessThan(50); // Should complete in less than 50ms
    });
  });
}); 