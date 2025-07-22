import { isURL } from './isURL';

describe('isURL', () => {
  describe('browser environment', () => {
    it('should return true for URL objects in browser environment', () => {
      const url = new URL('https://example.com');
      expect(isURL(url)).toBe(true);
    });

    it('should return false for non-URL objects', () => {
      expect(isURL('https://example.com')).toBe(false);
      expect(isURL(123)).toBe(false);
      expect(isURL({})).toBe(false);
      expect(isURL([])).toBe(false);
      expect(isURL(null)).toBe(false);
      expect(isURL(undefined)).toBe(false);
    });

    it('should handle error reporting', () => {
      const errorCallback = jest.fn();
      const config = {
        callbackOnError: errorCallback,
        identifier: 'testURL'
      };

      isURL('https://example.com', config);
      expect(errorCallback).toHaveBeenCalledWith(
        expect.stringContaining('Expected testURL ("https://example.com") to be "URL"')
      );
    });

    it('should not call error callback for valid URL objects', () => {
      const errorCallback = jest.fn();
      const config = {
        callbackOnError: errorCallback,
        identifier: 'testURL'
      };

      const url = new URL('https://example.com');
      isURL(url, config);
      expect(errorCallback).not.toHaveBeenCalled();
    });

    it('should handle environment detection correctly', () => {
      const url = new URL('https://example.com');
      expect(isURL(url)).toBe(true);
    });

    it('should work with URLs that have different protocols', () => {
      expect(isURL(new URL('http://localhost:3000'))).toBe(true);
      expect(isURL(new URL('https://api.example.com'))).toBe(true);
      expect(isURL(new URL('ftp://ftp.example.com'))).toBe(true);
      expect(isURL(new URL('file:///path/to/file'))).toBe(true);
    });

    it('should work with URLs that have query parameters', () => {
      const url = new URL('https://example.com?name=john&age=30');
      expect(isURL(url)).toBe(true);
    });

    it('should work with URLs that have fragments', () => {
      const url = new URL('https://example.com/page#section1');
      expect(isURL(url)).toBe(true);
    });
  });

  describe('environment detection', () => {
    let originalURL: typeof URL | undefined;

    beforeEach(() => {
      originalURL = global.URL;
    });

    afterEach(() => {
      if (originalURL) {
        global.URL = originalURL;
      } else {
        delete (global as any).URL;
      }
    });

    it('should handle URL not available in environment', () => {
      delete (global as any).URL;
      expect(isURL('test')).toBe(false);
    });

    it('should handle URL not available with error config', () => {
      delete (global as any).URL;
      const errorCallback = jest.fn();
      const config = {
        callbackOnError: errorCallback,
        identifier: 'testURL'
      };

      isURL('test', config);
      expect(errorCallback).toHaveBeenCalledWith(
        expect.stringContaining('Expected testURL ("test") to be "URL (not available in this environment)"')
      );
    });

    it('should handle non-URL values with error config', () => {
      const errorCallback = jest.fn();
      const config = {
        callbackOnError: errorCallback,
        identifier: 'testURL'
      };

      isURL('https://example.com', config);
      expect(errorCallback).toHaveBeenCalledWith(
        expect.stringContaining('Expected testURL ("https://example.com") to be "URL"')
      );
    });

    it('should work without config', () => {
      const url = new URL('https://example.com');
      expect(isURL(url)).toBe(true);
      expect(isURL('https://example.com')).toBe(false);
    });

    it('should work with null config', () => {
      const url = new URL('https://example.com');
      expect(isURL(url, null)).toBe(true);
      expect(isURL('https://example.com', null)).toBe(false);
    });
  });

  describe('type narrowing', () => {
    it('should narrow type correctly', () => {
      const data: unknown = new URL('https://example.com');
      if (isURL(data)) {
        expect(data.protocol).toBe('https:');
        expect(data.hostname).toBe('example.com');
        expect(data.pathname).toBe('/');
      }
    });

    it('should work with union types', () => {
      const data: string | URL = new URL('https://example.com');
      if (isURL(data)) {
        expect(data.protocol).toBe('https:');
      }
    });
  });

  describe('real-world scenarios', () => {
    it('should validate API endpoints', () => {
      const url = new URL('https://api.example.com/v1/users');
      expect(isURL(url)).toBe(true);
    });

    it('should validate relative URLs', () => {
      const baseUrl = new URL('https://example.com');
      const relativeUrl = new URL('/api/data', baseUrl);
      expect(isURL(relativeUrl)).toBe(true);
    });

    it('should validate URLs with complex paths', () => {
      const url = new URL('https://example.com/path/to/resource?param=value#fragment');
      expect(isURL(url)).toBe(true);
    });
  });
});
