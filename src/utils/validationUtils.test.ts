import { Validation } from './validationUtils';
import { 
  getExpectedTypeName, 
  createValidationResult, 
  createValidationError, 
  createTreeNode, 
  combineResults, 
  createSimplifiedTree, 
  validateProperty, 
  validateObject, 
  reportValidationResults 
} from './validationUtils';
import { ValidationResult, ValidationError, ValidationTree, ValidationContext } from './validationUtils';

describe('validationUtils', () => {
  describe('Validation object', () => {
    it('should export all validation functions', () => {
      expect(Validation.result).toBe(createValidationResult);
      expect(Validation.combine).toBe(combineResults);
      expect(Validation.error).toBe(createValidationError);
      expect(Validation.treeNode).toBe(createTreeNode);
      expect(Validation.property).toBe(validateProperty);
      expect(Validation.object).toBe(validateObject);
      expect(Validation.report).toBe(reportValidationResults);
      expect(Validation.createSimplifiedTree).toBe(createSimplifiedTree);
    });

    it('should create validation result using Validation.result', () => {
      const result = Validation.result(true, []);
      expect(result).toEqual({
        valid: true,
        errors: []
      });
    });

    it('should combine results using Validation.combine', () => {
      const result1 = Validation.result(true, []);
      const result2 = Validation.result(false, [{ path: 'test', expectedType: 'string', actualValue: 123, message: 'Invalid' }]);
      
      const combined = Validation.combine([result1, result2]);
      expect(combined.valid).toBe(false);
      expect(combined.errors).toHaveLength(1);
    });

    it('should create validation error using Validation.error', () => {
      const error = Validation.error('test', 'string', 123, 'Invalid type');
      expect(error).toEqual({
        path: 'test',
        expectedType: 'string',
        actualValue: 123,
        message: 'Invalid type'
      });
    });

    it('should create tree node using Validation.treeNode', () => {
      const node = Validation.treeNode('test', false);
      expect(node).toEqual({
        valid: false,
        path: 'test',
        children: {},
        errors: []
      });
    });

    it('should validate property using Validation.property', () => {
      const mockTypeGuard = jest.fn().mockReturnValue(true) as any;
      const context = { 
        path: 'root', 
        config: { identifier: 'test', callbackOnError: jest.fn() } 
      };
      
      const result = Validation.property('test', 'hello', mockTypeGuard, context);
      
      expect(mockTypeGuard).toHaveBeenCalledWith('hello', null);
      expect(result.valid).toBe(true);
    });

    it('should validate object using Validation.object', () => {
      const mockTypeGuard = jest.fn().mockReturnValue(true) as any;
      const context = { 
        path: 'root', 
        config: { identifier: 'test', callbackOnError: jest.fn() } 
      };
      
      const result = Validation.object({ name: 'test' }, { name: mockTypeGuard }, context);
      
      expect(mockTypeGuard).toHaveBeenCalledWith('test', null);
      expect(result.valid).toBe(true);
    });

    it('should report validation results using Validation.report', () => {
      const mockCallback = jest.fn();
      const config = { identifier: 'test', callbackOnError: mockCallback };
      const result = Validation.result(false, [{ path: 'test', expectedType: 'string', actualValue: 123, message: 'Invalid' }]);
      
      Validation.report(result, config);
      
      expect(mockCallback).toHaveBeenCalledWith('Invalid');
    });

    it('should create simplified tree using Validation.createSimplifiedTree', () => {
      const tree: ValidationTree = {
        valid: false,
        path: 'root',
        children: {
          name: {
            valid: false,
            path: 'root.name',
            expectedType: 'string',
            actualValue: 123
          }
        }
      };
      
      const simplified = Validation.createSimplifiedTree(tree);
      expect(simplified).toHaveProperty('root');
      expect(simplified.root).toHaveProperty('valid', false);
    });
  });

  describe('Direct exports', () => {
    it('should export getExpectedTypeName function', () => {
      expect(typeof getExpectedTypeName).toBe('function');
      
      const mockGuard = function isString(value: unknown): value is string { return typeof value === 'string'; };
      const result = getExpectedTypeName(mockGuard);
      expect(result).toBe('string');
    });

    it('should export createValidationResult function', () => {
      expect(typeof createValidationResult).toBe('function');
      
      const result = createValidationResult(true, []);
      expect(result).toEqual({
        valid: true,
        errors: []
      });
    });

    it('should export createValidationError function', () => {
      expect(typeof createValidationError).toBe('function');
      
      const error = createValidationError('test', 'string', 123, 'Invalid type');
      expect(error).toEqual({
        path: 'test',
        expectedType: 'string',
        actualValue: 123,
        message: 'Invalid type'
      });
    });

    it('should export createTreeNode function', () => {
      expect(typeof createTreeNode).toBe('function');
      
      const node = createTreeNode('test', false);
      expect(node).toEqual({
        valid: false,
        path: 'test',
        children: {},
        errors: []
      });
    });

    it('should export combineResults function', () => {
      expect(typeof combineResults).toBe('function');
      
      const result1 = createValidationResult(true, []);
      const result2 = createValidationResult(false, [{ path: 'test', expectedType: 'string', actualValue: 123, message: 'Invalid' }]);
      
      const combined = combineResults([result1, result2]);
      expect(combined.valid).toBe(false);
      expect(combined.errors).toHaveLength(1);
    });

    it('should export createSimplifiedTree function', () => {
      expect(typeof createSimplifiedTree).toBe('function');
      
      const tree: ValidationTree = {
        valid: false,
        path: 'root',
        children: {
          name: {
            valid: false,
            path: 'root.name',
            expectedType: 'string',
            actualValue: 123
          }
        }
      };
      
      const simplified = createSimplifiedTree(tree);
      expect(simplified).toHaveProperty('root');
      expect(simplified.root).toHaveProperty('valid', false);
    });

    it('should export validateProperty function', () => {
      expect(typeof validateProperty).toBe('function');
      
      const mockTypeGuard = jest.fn().mockReturnValue(true) as any;
      const context = { 
        path: 'root', 
        config: { identifier: 'test', callbackOnError: jest.fn() } 
      };
      
      const result = validateProperty('test', 'hello', mockTypeGuard, context);
      
      expect(mockTypeGuard).toHaveBeenCalledWith('hello', null);
      expect(result.valid).toBe(true);
    });

    it('should export validateObject function', () => {
      expect(typeof validateObject).toBe('function');
      
      const mockTypeGuard = jest.fn().mockReturnValue(true) as any;
      const context = { 
        path: 'root', 
        config: { identifier: 'test', callbackOnError: jest.fn() } 
      };
      
      const result = validateObject({ name: 'test' }, { name: mockTypeGuard }, context);
      
      expect(mockTypeGuard).toHaveBeenCalledWith('test', null);
      expect(result.valid).toBe(true);
    });

    it('should export reportValidationResults function', () => {
      expect(typeof reportValidationResults).toBe('function');
      
      const mockCallback = jest.fn();
      const config = { identifier: 'test', callbackOnError: mockCallback };
      const result = createValidationResult(false, [{ path: 'test', expectedType: 'string', actualValue: 123, message: 'Invalid' }]);
      
      reportValidationResults(result, config);
      
      expect(mockCallback).toHaveBeenCalledWith('Invalid');
    });
  });

  describe('Type exports', () => {
    it('should export ValidationError type', () => {
      const error: ValidationError = {
        path: 'test',
        expectedType: 'string',
        actualValue: 123,
        message: 'Invalid type'
      };
      expect(error.path).toBe('test');
      expect(error.expectedType).toBe('string');
      expect(error.actualValue).toBe(123);
      expect(error.message).toBe('Invalid type');
    });

    it('should export ValidationTree type', () => {
      const tree: ValidationTree = {
        valid: false,
        path: 'root',
        children: {},
        errors: []
      };
      expect(tree.valid).toBe(false);
      expect(tree.path).toBe('root');
      expect(tree.children).toEqual({});
      expect(tree.errors).toEqual([]);
    });

    it('should export ValidationResult type', () => {
      const result: ValidationResult = {
        valid: true,
        errors: []
      };
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should export ValidationContext type', () => {
      const context: ValidationContext = {
        path: 'test',
        config: { identifier: 'test', callbackOnError: jest.fn() }
      };
      expect(context.path).toBe('test');
      expect(context.config).toEqual({ identifier: 'test', callbackOnError: expect.any(Function) });
    });
  });

  describe('Integration tests', () => {
    it('should work together in a complete validation flow', () => {
      // Create a mock type guard
      const isString = jest.fn().mockImplementation((value) => typeof value === 'string') as any;
      
      // Validate an object
      const object = { name: 'John', age: 30 };
      const schema = { 
        name: isString,
        age: (value: unknown): value is number => typeof value === 'number'
      };
      
      const context = { 
        path: 'user', 
        config: { identifier: 'user', callbackOnError: jest.fn() } 
      };
      
      const result = Validation.object(object, schema, context);
      
      expect(result.valid).toBe(true);
      expect(isString).toHaveBeenCalledWith('John', null);
    });

    it('should handle validation errors in a complete flow', () => {
      // Create a mock type guard that fails
      const isString = jest.fn().mockImplementation((value) => typeof value === 'string') as any;
      
      // Validate an object with invalid data
      const object = { name: 123, age: '30' };
      const schema = { 
        name: isString,
        age: (value: unknown): value is number => typeof value === 'number'
      };
      
      const context = { 
        path: 'user', 
        config: { identifier: 'user', callbackOnError: jest.fn() } 
      };
      
      const result = Validation.object(object, schema, context);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('should create and report validation results', () => {
      const mockCallback = jest.fn();
      const config = { identifier: 'test', callbackOnError: mockCallback };
      
      // Create a validation result with errors
      const error = Validation.error('name', 'string', 123, 'Name must be a string');
      const result = Validation.result(false, [error]);
      
      // Report the results
      Validation.report(result, config);
      
      expect(mockCallback).toHaveBeenCalledWith('Name must be a string');
    });

    it('should create tree nodes and simplified trees', () => {
      // Create a tree node
      const node = Validation.treeNode('user', false);
      node.children = {
        name: Validation.treeNode('user.name', false)
      };
      
      // Create simplified tree
      const simplified = Validation.createSimplifiedTree(node);
      
      expect(simplified).toHaveProperty('user');
      expect(simplified.user).toHaveProperty('valid', false);
    });
  });
}); 