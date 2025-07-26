import { createTreeNode } from './createTreeNode';
import { ValidationTree } from './validationTypes';

describe('createTreeNode', () => {
  describe('basic functionality', () => {
    it('should create a valid tree node with minimal parameters', () => {
      const node = createTreeNode('user', true);
      
      expect(node).toEqual({
        valid: true,
        path: 'user',
        children: {},
        errors: []
      });
    });

    it('should create an invalid tree node with minimal parameters', () => {
      const node = createTreeNode('user', false);
      
      expect(node).toEqual({
        valid: false,
        path: 'user',
        children: {},
        errors: []
      });
    });

    it('should create a tree node with expected type', () => {
      const node = createTreeNode('user.name', false, 'string');
      
      expect(node).toEqual({
        valid: false,
        path: 'user.name',
        expectedType: 'string',
        children: {},
        errors: []
      });
    });

    it('should create a tree node with actual value', () => {
      const node = createTreeNode('user.age', false, 'number', 25);
      
      expect(node).toEqual({
        valid: false,
        path: 'user.age',
        expectedType: 'number',
        actualValue: 25,
        children: {},
        errors: []
      });
    });

    it('should create a complete tree node with all parameters', () => {
      const node = createTreeNode('user.email', false, 'string', 'invalid-email');
      
      expect(node).toEqual({
        valid: false,
        path: 'user.email',
        expectedType: 'string',
        actualValue: 'invalid-email',
        children: {},
        errors: []
      });
    });
  });

  describe('path variations', () => {
    it('should handle simple property path', () => {
      const node = createTreeNode('name', true);
      expect(node.path).toBe('name');
    });

    it('should handle nested property path', () => {
      const node = createTreeNode('user.profile.name', true);
      expect(node.path).toBe('user.profile.name');
    });

    it('should handle array index path', () => {
      const node = createTreeNode('users.0.name', true);
      expect(node.path).toBe('users.0.name');
    });

    it('should handle deep nested path', () => {
      const node = createTreeNode('a.b.c.d.e.f', true);
      expect(node.path).toBe('a.b.c.d.e.f');
    });

    it('should handle empty path', () => {
      const node = createTreeNode('', true);
      expect(node.path).toBe('');
    });

    it('should handle path with special characters', () => {
      const node = createTreeNode('user-name', true);
      expect(node.path).toBe('user-name');
    });
  });

  describe('expected type variations', () => {
    it('should handle primitive types', () => {
      const types = ['string', 'number', 'boolean', 'object', 'array'];
      
      types.forEach(type => {
        const node = createTreeNode('test', true, type);
        expect(node.expectedType).toBe(type);
      });
    });

    it('should handle custom types', () => {
      const customTypes = ['User', 'Email', 'PhoneNumber', 'Date', 'UUID'];
      
      customTypes.forEach(type => {
        const node = createTreeNode('test', true, type);
        expect(node.expectedType).toBe(type);
      });
    });

    it('should handle complex type names', () => {
      const node = createTreeNode('test', true, 'Array<string>');
      expect(node.expectedType).toBe('Array<string>');
    });

    it('should handle undefined expected type', () => {
      const node = createTreeNode('test', true, undefined);
      expect(node.expectedType).toBeUndefined();
    });
  });

  describe('actual value variations', () => {
    it('should handle string values', () => {
      const node = createTreeNode('test', true, 'string', 'hello');
      expect(node.actualValue).toBe('hello');
    });

    it('should handle number values', () => {
      const node = createTreeNode('test', true, 'number', 42);
      expect(node.actualValue).toBe(42);
    });

    it('should handle boolean values', () => {
      const node = createTreeNode('test', true, 'boolean', true);
      expect(node.actualValue).toBe(true);
    });

    it('should handle null values', () => {
      const node = createTreeNode('test', true, 'string', null);
      expect(node.actualValue).toBe(null);
    });

    it('should handle undefined values', () => {
      const node = createTreeNode('test', true, 'string', undefined);
      expect(node.actualValue).toBe(undefined);
    });

    it('should handle object values', () => {
      const objectValue = { id: 1, name: 'John' };
      const node = createTreeNode('test', true, 'object', objectValue);
      expect(node.actualValue).toBe(objectValue);
    });

    it('should handle array values', () => {
      const arrayValue = [1, 2, 3];
      const node = createTreeNode('test', true, 'array', arrayValue);
      expect(node.actualValue).toBe(arrayValue);
    });

    it('should handle function values', () => {
      const functionValue = () => 'test';
      const node = createTreeNode('test', true, 'function', functionValue);
      expect(node.actualValue).toBe(functionValue);
    });

    it('should handle undefined actual value parameter', () => {
      const node = createTreeNode('test', true, 'string', undefined);
      expect(node.actualValue).toBe(undefined);
    });
  });

  describe('valid state variations', () => {
    it('should handle true valid state', () => {
      const node = createTreeNode('test', true);
      expect(node.valid).toBe(true);
    });

    it('should handle false valid state', () => {
      const node = createTreeNode('test', false);
      expect(node.valid).toBe(false);
    });
  });

  describe('default properties', () => {
    it('should always have empty children object', () => {
      const node = createTreeNode('test', true);
      expect(node.children).toEqual({});
    });

    it('should always have empty errors array', () => {
      const node = createTreeNode('test', true);
      expect(node.errors).toEqual([]);
    });

    it('should maintain empty children and errors with all parameters', () => {
      const node = createTreeNode('test', false, 'string', 'value');
      expect(node.children).toEqual({});
      expect(node.errors).toEqual([]);
    });
  });

  describe('conditional properties', () => {
    it('should include expectedType when provided', () => {
      const node = createTreeNode('test', true, 'string');
      expect(node.expectedType).toBe('string');
    });

    it('should not include expectedType when undefined', () => {
      const node = createTreeNode('test', true, undefined);
      expect(node.expectedType).toBeUndefined();
    });

    it('should include actualValue when provided', () => {
      const node = createTreeNode('test', true, 'string', 'value');
      expect(node.actualValue).toBe('value');
    });

    it('should not include actualValue when undefined', () => {
      const node = createTreeNode('test', true, 'string', undefined);
      expect(node.actualValue).toBe(undefined);
    });

    it('should include actualValue when null', () => {
      const node = createTreeNode('test', true, 'string', null);
      expect(node.actualValue).toBe(null);
    });
  });

  describe('type safety', () => {
    it('should maintain correct types for all properties', () => {
      const node: ValidationTree = createTreeNode('test', true, 'string', 'value');
      
      expect(typeof node.valid).toBe('boolean');
      expect(typeof node.path).toBe('string');
      expect(typeof node.expectedType).toBe('string');
      expect(node.actualValue).toBe('value');
      expect(typeof node.children).toBe('object');
      expect(Array.isArray(node.errors)).toBe(true);
    });

    it('should handle unknown actualValue type', () => {
      const symbolValue = Symbol('test');
      const node = createTreeNode('test', true, 'symbol', symbolValue);
      expect(node.actualValue).toBe(symbolValue);
    });
  });

  describe('immutability', () => {
    it('should not mutate input parameters', () => {
      const originalPath = 'user.name';
      const originalValid = true;
      const originalType = 'string';
      const originalValue = 'test';
      
      const node = createTreeNode(originalPath, originalValid, originalType, originalValue);
      
      // Modify the node object
      node.path = 'modified.path';
      node.valid = false;
      node.expectedType = 'number';
      node.actualValue = 123;
      
      // Original values should remain unchanged
      expect(originalPath).toBe('user.name');
      expect(originalValid).toBe(true);
      expect(originalType).toBe('string');
      expect(originalValue).toBe('test');
    });
  });

  describe('performance', () => {
    it('should handle large number of calls efficiently', () => {
      const start = performance.now();
      
      for (const i of Array.from({ length: 10000 }, (_, i) => i)) {
        createTreeNode(`property.${i}`, i % 2 === 0, 'string', `value${i}`);
      }
      
      const end = performance.now();
      expect(end - start).toBeLessThan(300); // Should complete in less than 300ms
    });

    it('should handle complex values efficiently', () => {
      const complexValue = {
        nested: {
          deep: {
            array: [1, 2, 3, 4, 5],
            object: { a: 1, b: 2, c: 3 }
          }
        }
      };
      
      const start = performance.now();
      
      for (const i of Array.from({ length: 1000 }, (_, i) => i)) {
        createTreeNode(`property.${i}`, true, 'object', complexValue);
      }
      
      const end = performance.now();
      expect(end - start).toBeLessThan(50); // Should complete in less than 50ms
    });
  });
}); 