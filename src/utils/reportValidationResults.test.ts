import { reportValidationResults } from './reportValidationResults';
import { ValidationResult, ValidationError, ValidationTree } from './validationTypes';
import { TypeGuardFnConfig } from '../typeguards/isType';

describe('reportValidationResults', () => {
  let mockCallback: jest.Mock;
  let config: TypeGuardFnConfig;

  beforeEach(() => {
    mockCallback = jest.fn();
    config = {
      callbackOnError: mockCallback,
      identifier: 'testValue',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Early return conditions', () => {
    it('should return early when result is valid', () => {
      const validResult: ValidationResult = {
        valid: true,
        errors: [],
      };

      reportValidationResults(validResult, config);

      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should return early when config is null', () => {
      const invalidResult: ValidationResult = {
        valid: false,
        errors: [{ path: 'test', expectedType: 'string', actualValue: 123, message: 'Invalid type' }],
      };

      reportValidationResults(invalidResult, null);

      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should return early when config is undefined', () => {
      const invalidResult: ValidationResult = {
        valid: false,
        errors: [{ path: 'test', expectedType: 'string', actualValue: 123, message: 'Invalid type' }],
      };

      reportValidationResults(invalidResult, undefined);

      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should return early when config is nil (null)', () => {
      const invalidResult: ValidationResult = {
        valid: false,
        errors: [{ path: 'test', expectedType: 'string', actualValue: 123, message: 'Invalid type' }],
      };

      reportValidationResults(invalidResult, null);

      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

  describe('Single error mode (default)', () => {
    it('should report only the first error in single mode', () => {
      const result: ValidationResult = {
        valid: false,
        errors: [
          { path: 'name', expectedType: 'string', actualValue: 123, message: 'Name must be a string' },
          { path: 'age', expectedType: 'number', actualValue: '25', message: 'Age must be a number' },
        ],
      };

      reportValidationResults(result, config);

      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith('Name must be a string');
    });

    it('should handle empty errors array in single mode', () => {
      const result: ValidationResult = {
        valid: false,
        errors: [],
      };

      reportValidationResults(result, config);

      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should use single mode when errorMode is not specified', () => {
      const result: ValidationResult = {
        valid: false,
        errors: [
          { path: 'test', expectedType: 'string', actualValue: 123, message: 'Test error' },
        ],
      };

      const configWithoutErrorMode: TypeGuardFnConfig = {
        callbackOnError: mockCallback,
        identifier: 'testValue',
      };

      reportValidationResults(result, configWithoutErrorMode);

      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith('Test error');
    });

    it('should explicitly use single mode', () => {
      const result: ValidationResult = {
        valid: false,
        errors: [
          { path: 'test', expectedType: 'string', actualValue: 123, message: 'Test error' },
        ],
      };

      const singleModeConfig: TypeGuardFnConfig = {
        callbackOnError: mockCallback,
        identifier: 'testValue',
        errorMode: 'single',
      };

      reportValidationResults(result, singleModeConfig);

      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith('Test error');
    });
  });

  describe('Multi error mode', () => {
    it('should report all errors in multi mode', () => {
      const result: ValidationResult = {
        valid: false,
        errors: [
          { path: 'name', expectedType: 'string', actualValue: 123, message: 'Name must be a string' },
          { path: 'age', expectedType: 'number', actualValue: '25', message: 'Age must be a number' },
          { path: 'email', expectedType: 'string', actualValue: null, message: 'Email is required' },
        ],
      };

      const multiModeConfig: TypeGuardFnConfig = {
        callbackOnError: mockCallback,
        identifier: 'testValue',
        errorMode: 'multi',
      };

      reportValidationResults(result, multiModeConfig);

      expect(mockCallback).toHaveBeenCalledTimes(3);
      expect(mockCallback).toHaveBeenNthCalledWith(1, 'Name must be a string');
      expect(mockCallback).toHaveBeenNthCalledWith(2, 'Age must be a number');
      expect(mockCallback).toHaveBeenNthCalledWith(3, 'Email is required');
    });

    it('should handle empty errors array in multi mode', () => {
      const result: ValidationResult = {
        valid: false,
        errors: [],
      };

      const multiModeConfig: TypeGuardFnConfig = {
        callbackOnError: mockCallback,
        identifier: 'testValue',
        errorMode: 'multi',
      };

      reportValidationResults(result, multiModeConfig);

      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should handle single error in multi mode', () => {
      const result: ValidationResult = {
        valid: false,
        errors: [
          { path: 'test', expectedType: 'string', actualValue: 123, message: 'Single error' },
        ],
      };

      const multiModeConfig: TypeGuardFnConfig = {
        callbackOnError: mockCallback,
        identifier: 'testValue',
        errorMode: 'multi',
      };

      reportValidationResults(result, multiModeConfig);

      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith('Single error');
    });
  });

  describe('JSON error mode', () => {
    it('should report JSON tree when tree is defined', () => {
      const tree: ValidationTree = {
        valid: false,
        path: 'root',
        expectedType: 'object',
        actualValue: { name: 123, age: '25' },
        children: {
          name: {
            valid: false,
            path: 'root.name',
            expectedType: 'string',
            actualValue: 123,
            errors: [{ path: 'root.name', expectedType: 'string', actualValue: 123, message: 'Name must be a string' }],
          },
          age: {
            valid: false,
            path: 'root.age',
            expectedType: 'number',
            actualValue: '25',
            errors: [{ path: 'root.age', expectedType: 'number', actualValue: '25', message: 'Age must be a number' }],
          },
        },
      };

      const result: ValidationResult = {
        valid: false,
        errors: [
          { path: 'name', expectedType: 'string', actualValue: 123, message: 'Name must be a string' },
          { path: 'age', expectedType: 'number', actualValue: '25', message: 'Age must be a number' },
        ],
        tree,
      };

      const jsonModeConfig: TypeGuardFnConfig = {
        callbackOnError: mockCallback,
        identifier: 'testValue',
        errorMode: 'json',
      };

      reportValidationResults(result, jsonModeConfig);

      expect(mockCallback).toHaveBeenCalledTimes(1);
      const jsonCall = mockCallback.mock.calls[0][0];
      expect(typeof jsonCall).toBe('string');
      
      const parsedJson = JSON.parse(jsonCall);
      expect(parsedJson).toHaveProperty('root');
      expect(parsedJson.root).toHaveProperty('valid', false);
      expect(parsedJson.root).toHaveProperty('value');
      expect(parsedJson.root.value).toHaveProperty('name');
      expect(parsedJson.root.value).toHaveProperty('age');
    });

    it('should not report JSON when tree is undefined', () => {
      const result: ValidationResult = {
        valid: false,
        errors: [
          { path: 'test', expectedType: 'string', actualValue: 123, message: 'Test error' },
        ],
        // tree is undefined
      };

      const jsonModeConfig: TypeGuardFnConfig = {
        callbackOnError: mockCallback,
        identifier: 'testValue',
        errorMode: 'json',
      };

      reportValidationResults(result, jsonModeConfig);

      // Should fall back to single mode when tree is undefined
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith('Test error');
    });

    it('should not report JSON when tree is null', () => {
      const result: ValidationResult = {
        valid: false,
        errors: [
          { path: 'test', expectedType: 'string', actualValue: 123, message: 'Test error' },
        ],
        tree: null as any,
      };

      const jsonModeConfig: TypeGuardFnConfig = {
        callbackOnError: mockCallback,
        identifier: 'testValue',
        errorMode: 'json',
      };

      reportValidationResults(result, jsonModeConfig);

      // Should fall back to single mode when tree is null
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith('Test error');
    });

    it('should handle primitive value tree in JSON mode', () => {
      const tree: ValidationTree = {
        valid: false,
        path: 'root',
        expectedType: 'string',
        actualValue: 123,
        errors: [{ path: 'root', expectedType: 'string', actualValue: 123, message: 'Must be a string' }],
      };

      const result: ValidationResult = {
        valid: false,
        errors: [
          { path: 'root', expectedType: 'string', actualValue: 123, message: 'Must be a string' },
        ],
        tree,
      };

      const jsonModeConfig: TypeGuardFnConfig = {
        callbackOnError: mockCallback,
        identifier: 'testValue',
        errorMode: 'json',
      };

      reportValidationResults(result, jsonModeConfig);

      expect(mockCallback).toHaveBeenCalledTimes(1);
      const jsonCall = mockCallback.mock.calls[0][0];
      expect(typeof jsonCall).toBe('string');
      
      const parsedJson = JSON.parse(jsonCall);
      expect(parsedJson).toHaveProperty('root');
      expect(parsedJson.root).toHaveProperty('valid', false);
      expect(parsedJson.root).toHaveProperty('value', 123);
      expect(parsedJson.root).toHaveProperty('expectedType', 'string');
    });

    it('should handle tree with empty children in JSON mode', () => {
      const tree: ValidationTree = {
        valid: false,
        path: 'root',
        expectedType: 'object',
        actualValue: {},
        children: {},
        errors: [{ path: 'root', expectedType: 'object', actualValue: {}, message: 'Invalid object' }],
      };

      const result: ValidationResult = {
        valid: false,
        errors: [
          { path: 'root', expectedType: 'object', actualValue: {}, message: 'Invalid object' },
        ],
        tree,
      };

      const jsonModeConfig: TypeGuardFnConfig = {
        callbackOnError: mockCallback,
        identifier: 'testValue',
        errorMode: 'json',
      };

      reportValidationResults(result, jsonModeConfig);

      expect(mockCallback).toHaveBeenCalledTimes(1);
      const jsonCall = mockCallback.mock.calls[0][0];
      expect(typeof jsonCall).toBe('string');
      
      const parsedJson = JSON.parse(jsonCall);
      expect(parsedJson).toHaveProperty('root');
      expect(parsedJson.root).toHaveProperty('valid', false);
      expect(parsedJson.root).toHaveProperty('value');
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle result with valid: false but no errors', () => {
      const result: ValidationResult = {
        valid: false,
        errors: [],
      };

      reportValidationResults(result, config);

      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should handle result with valid: false and undefined errors', () => {
      const result: ValidationResult = {
        valid: false,
        errors: undefined as any,
      };

      reportValidationResults(result, config);

      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should handle result with valid: false and null errors', () => {
      const result: ValidationResult = {
        valid: false,
        errors: null as any,
      };

      reportValidationResults(result, config);

      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should handle error with empty message', () => {
      const result: ValidationResult = {
        valid: false,
        errors: [
          { path: 'test', expectedType: 'string', actualValue: 123, message: '' },
        ],
      };

      reportValidationResults(result, config);

      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith('');
    });

    it('should handle error with undefined message', () => {
      const result: ValidationResult = {
        valid: false,
        errors: [
          { path: 'test', expectedType: 'string', actualValue: 123, message: undefined as any },
        ],
      };

      reportValidationResults(result, config);

      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith(undefined);
    });

    it('should handle complex nested tree structure in JSON mode', () => {
      const tree: ValidationTree = {
        valid: false,
        path: 'root',
        expectedType: 'object',
        actualValue: { user: { name: 123, profile: { age: '25' } } },
        children: {
          user: {
            valid: false,
            path: 'root.user',
            expectedType: 'object',
            actualValue: { name: 123, profile: { age: '25' } },
            children: {
              name: {
                valid: false,
                path: 'root.user.name',
                expectedType: 'string',
                actualValue: 123,
                errors: [{ path: 'root.user.name', expectedType: 'string', actualValue: 123, message: 'Name must be a string' }],
              },
              profile: {
                valid: false,
                path: 'root.user.profile',
                expectedType: 'object',
                actualValue: { age: '25' },
                children: {
                  age: {
                    valid: false,
                    path: 'root.user.profile.age',
                    expectedType: 'number',
                    actualValue: '25',
                    errors: [{ path: 'root.user.profile.age', expectedType: 'number', actualValue: '25', message: 'Age must be a number' }],
                  },
                },
              },
            },
          },
        },
      };

      const result: ValidationResult = {
        valid: false,
        errors: [
          { path: 'user.name', expectedType: 'string', actualValue: 123, message: 'Name must be a string' },
          { path: 'user.profile.age', expectedType: 'number', actualValue: '25', message: 'Age must be a number' },
        ],
        tree,
      };

      const jsonModeConfig: TypeGuardFnConfig = {
        callbackOnError: mockCallback,
        identifier: 'testValue',
        errorMode: 'json',
      };

      reportValidationResults(result, jsonModeConfig);

      expect(mockCallback).toHaveBeenCalledTimes(1);
      const jsonCall = mockCallback.mock.calls[0][0];
      expect(typeof jsonCall).toBe('string');
      
      const parsedJson = JSON.parse(jsonCall);
      expect(parsedJson).toHaveProperty('root');
      expect(parsedJson.root).toHaveProperty('valid', false);
      expect(parsedJson.root).toHaveProperty('value');
      expect(parsedJson.root.value).toHaveProperty('user');
      expect(parsedJson.root.value.user).toHaveProperty('valid', false);
      expect(parsedJson.root.value.user).toHaveProperty('value');
      expect(parsedJson.root.value.user.value).toHaveProperty('name');
      expect(parsedJson.root.value.user.value).toHaveProperty('profile');
    });
  });

  describe('Integration scenarios', () => {
    it('should handle real-world validation scenario with multiple error modes', () => {
      const userValidationTree: ValidationTree = {
        valid: false,
        path: 'user',
        expectedType: 'object',
        actualValue: { id: '123', name: 456, email: 'invalid-email', age: '25' },
        children: {
          id: {
            valid: false,
            path: 'user.id',
            expectedType: 'number',
            actualValue: '123',
            errors: [{ path: 'user.id', expectedType: 'number', actualValue: '123', message: 'ID must be a number' }],
          },
          name: {
            valid: false,
            path: 'user.name',
            expectedType: 'string',
            actualValue: 456,
            errors: [{ path: 'user.name', expectedType: 'string', actualValue: 456, message: 'Name must be a string' }],
          },
          email: {
            valid: false,
            path: 'user.email',
            expectedType: 'email',
            actualValue: 'invalid-email',
            errors: [{ path: 'user.email', expectedType: 'email', actualValue: 'invalid-email', message: 'Invalid email format' }],
          },
          age: {
            valid: false,
            path: 'user.age',
            expectedType: 'number',
            actualValue: '25',
            errors: [{ path: 'user.age', expectedType: 'number', actualValue: '25', message: 'Age must be a number' }],
          },
        },
      };

      const result: ValidationResult = {
        valid: false,
        errors: [
          { path: 'user.id', expectedType: 'number', actualValue: '123', message: 'ID must be a number' },
          { path: 'user.name', expectedType: 'string', actualValue: 456, message: 'Name must be a string' },
          { path: 'user.email', expectedType: 'email', actualValue: 'invalid-email', message: 'Invalid email format' },
          { path: 'user.age', expectedType: 'number', actualValue: '25', message: 'Age must be a number' },
        ],
        tree: userValidationTree,
      };

      // Test single mode
      const singleCallback = jest.fn();
      const singleConfig: TypeGuardFnConfig = {
        callbackOnError: singleCallback,
        identifier: 'user',
        errorMode: 'single',
      };

      reportValidationResults(result, singleConfig);
      expect(singleCallback).toHaveBeenCalledTimes(1);
      expect(singleCallback).toHaveBeenCalledWith('ID must be a number');

      // Test multi mode
      const multiCallback = jest.fn();
      const multiConfig: TypeGuardFnConfig = {
        callbackOnError: multiCallback,
        identifier: 'user',
        errorMode: 'multi',
      };

      reportValidationResults(result, multiConfig);
      expect(multiCallback).toHaveBeenCalledTimes(4);
      expect(multiCallback).toHaveBeenNthCalledWith(1, 'ID must be a number');
      expect(multiCallback).toHaveBeenNthCalledWith(2, 'Name must be a string');
      expect(multiCallback).toHaveBeenNthCalledWith(3, 'Invalid email format');
      expect(multiCallback).toHaveBeenNthCalledWith(4, 'Age must be a number');

      // Test JSON mode
      const jsonCallback = jest.fn();
      const jsonConfig: TypeGuardFnConfig = {
        callbackOnError: jsonCallback,
        identifier: 'user',
        errorMode: 'json',
      };

      reportValidationResults(result, jsonConfig);
      expect(jsonCallback).toHaveBeenCalledTimes(1);
      const jsonCall = jsonCallback.mock.calls[0][0];
      const parsedJson = JSON.parse(jsonCall);
      expect(parsedJson).toHaveProperty('user');
      expect(parsedJson.user).toHaveProperty('valid', false);
      expect(parsedJson.user).toHaveProperty('value');
      expect(parsedJson.user.value).toHaveProperty('id');
      expect(parsedJson.user.value).toHaveProperty('name');
      expect(parsedJson.user.value).toHaveProperty('email');
      expect(parsedJson.user.value).toHaveProperty('age');
    });
  });
}); 