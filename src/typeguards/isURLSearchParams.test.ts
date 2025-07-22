import { isURLSearchParams } from './isURLSearchParams';

describe('isURLSearchParams', () => {
  describe('browser environment', () => {
    it('should return true for URLSearchParams objects in browser environment', () => {
      const params = new URLSearchParams('name=john&age=30');
      expect(isURLSearchParams(params)).toBe(true);
    });

    it('should return false for non-URLSearchParams objects', () => {
      expect(isURLSearchParams('name=john&age=30')).toBe(false);
      expect(isURLSearchParams({ name: 'john' })).toBe(false);
      expect(isURLSearchParams(123)).toBe(false);
      expect(isURLSearchParams([])).toBe(false);
      expect(isURLSearchParams(null)).toBe(false);
      expect(isURLSearchParams(undefined)).toBe(false);
    });

    it('should handle error reporting', () => {
      const errorCallback = jest.fn();
      const config = {
        callbackOnError: errorCallback,
        identifier: 'testParams'
      };

      isURLSearchParams('name=john', config);
      expect(errorCallback).toHaveBeenCalledWith(
        expect.stringContaining('Expected testParams ("name=john") to be "URLSearchParams"')
      );
    });

    it('should not call error callback for valid URLSearchParams objects', () => {
      const errorCallback = jest.fn();
      const config = {
        callbackOnError: errorCallback,
        identifier: 'testParams'
      };

      const params = new URLSearchParams('name=john');
      isURLSearchParams(params, config);
      expect(errorCallback).not.toHaveBeenCalled();
    });

    it('should handle environment detection correctly', () => {
      const params = new URLSearchParams();
      expect(isURLSearchParams(params)).toBe(true);
    });

    it('should work with URLSearchParams created from different sources', () => {
      expect(isURLSearchParams(new URLSearchParams())).toBe(true);
      expect(isURLSearchParams(new URLSearchParams('?name=john&age=30'))).toBe(true);
      expect(isURLSearchParams(new URLSearchParams({ name: 'john', age: '30' }))).toBe(true);
    });

    it('should work with URLSearchParams that have multiple values for same key', () => {
      const params = new URLSearchParams();
      params.append('tag', 'javascript');
      params.append('tag', 'typescript');
      expect(isURLSearchParams(params)).toBe(true);
    });

    it('should work with empty URLSearchParams', () => {
      const params = new URLSearchParams();
      expect(isURLSearchParams(params)).toBe(true);
    });
  });

  describe('environment detection', () => {
    let originalURLSearchParams: typeof URLSearchParams | undefined;

    beforeEach(() => {
      originalURLSearchParams = global.URLSearchParams;
    });

    afterEach(() => {
      if (originalURLSearchParams) {
        global.URLSearchParams = originalURLSearchParams;
      } else {
        delete (global as any).URLSearchParams;
      }
    });

    it('should handle URLSearchParams not available in environment', () => {
      delete (global as any).URLSearchParams;
      expect(isURLSearchParams('test')).toBe(false);
    });

    it('should handle URLSearchParams not available with error config', () => {
      delete (global as any).URLSearchParams;
      const errorCallback = jest.fn();
      const config = {
        callbackOnError: errorCallback,
        identifier: 'testParams'
      };

      isURLSearchParams('test', config);
      expect(errorCallback).toHaveBeenCalledWith(
        expect.stringContaining('Expected testParams ("test") to be "URLSearchParams (not available in this environment)"')
      );
    });

    it('should handle non-URLSearchParams values with error config', () => {
      const errorCallback = jest.fn();
      const config = {
        callbackOnError: errorCallback,
        identifier: 'testParams'
      };

      isURLSearchParams('name=john', config);
      expect(errorCallback).toHaveBeenCalledWith(
        expect.stringContaining('Expected testParams ("name=john") to be "URLSearchParams"')
      );
    });

    it('should work without config', () => {
      const params = new URLSearchParams('name=john');
      expect(isURLSearchParams(params)).toBe(true);
      expect(isURLSearchParams('name=john')).toBe(false);
    });

    it('should work with null config', () => {
      const params = new URLSearchParams('name=john');
      expect(isURLSearchParams(params, null)).toBe(true);
      expect(isURLSearchParams('name=john', null)).toBe(false);
    });
  });

  describe('type narrowing', () => {
    it('should narrow type correctly', () => {
      const data: unknown = new URLSearchParams('name=john&age=30');
      if (isURLSearchParams(data)) {
        expect(data.get('name')).toBe('john');
        expect(data.get('age')).toBe('30');
        expect(data.has('name')).toBe(true);
      }
    });

    it('should work with union types', () => {
      const data: string | URLSearchParams = new URLSearchParams('name=john');
      if (isURLSearchParams(data)) {
        expect(data.get('name')).toBe('john');
      }
    });
  });

  describe('real-world scenarios', () => {
    it('should validate query parameters', () => {
      const params = new URLSearchParams('page=1&limit=10&sort=name');
      expect(isURLSearchParams(params)).toBe(true);
    });

    it('should validate form data parameters', () => {
      const params = new URLSearchParams();
      params.append('username', 'john_doe');
      params.append('email', 'john@example.com');
      expect(isURLSearchParams(params)).toBe(true);
    });

    it('should validate API request parameters', () => {
      const params = new URLSearchParams({
        api_key: 'secret123',
        version: 'v1',
        format: 'json'
      });
      expect(isURLSearchParams(params)).toBe(true);
    });
  });
});
