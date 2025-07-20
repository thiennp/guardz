import { isURL } from './isURL';

describe('isURL', () => {
  it('should return true for URL objects', () => {
    if (typeof URL !== 'undefined') {
      expect(isURL(new URL('https://example.com'))).toBe(true);
      expect(isURL(new URL('http://localhost:3000'))).toBe(true);
      expect(isURL(new URL('file:///path/to/file'))).toBe(true);
      expect(isURL(new URL('ftp://ftp.example.com'))).toBe(true);
      expect(isURL(new URL('ws://localhost:8080'))).toBe(true);
    } else {
      // In environments where URL is not available
      expect(isURL({})).toBe(false);
    }
  });

  it('should return false for non-URL objects', () => {
    expect(isURL('https://example.com')).toBe(false);
    expect(isURL({ href: 'https://example.com' })).toBe(false);
    expect(isURL(123)).toBe(false);
    expect(isURL({})).toBe(false);
    expect(isURL([])).toBe(false);
    expect(isURL(null)).toBe(false);
    expect(isURL(undefined)).toBe(false);
    expect(isURL(true)).toBe(false);
    expect(isURL(() => {})).toBe(false);
  });

  it('should handle error reporting', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'apiEndpoint', callbackOnError: mockCallback };

    isURL('https://example.com', config);
    expect(mockCallback).toHaveBeenCalledTimes(1);

    if (typeof URL === 'undefined') {
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected apiEndpoint ("https://example.com") to be "URL (not available in this environment)"'
      );
    } else {
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected apiEndpoint ("https://example.com") to be "URL"'
      );
    }
  });

  it('should not call error callback for valid URL objects', () => {
    if (typeof URL !== 'undefined') {
      const mockCallback = jest.fn();
      const config = { identifier: 'url', callbackOnError: mockCallback };

      const url = new URL('https://example.com');
      isURL(url, config);

      expect(mockCallback).not.toHaveBeenCalled();
    }
  });

  it('should handle environment detection correctly', () => {
    // Test that the guard properly detects when URL is not available
    const result = isURL({});

    if (typeof URL === 'undefined') {
      expect(result).toBe(false);
    } else {
      expect(result).toBe(false); // {} is not a URL instance
    }
  });

  it('should work with URLs that have different protocols', () => {
    if (typeof URL !== 'undefined') {
      expect(isURL(new URL('https://api.example.com/v1/users'))).toBe(true);
      expect(isURL(new URL('http://localhost:3000/api/data'))).toBe(true);
      expect(isURL(new URL('ws://localhost:8080/socket'))).toBe(true);
      expect(isURL(new URL('wss://secure.example.com/socket'))).toBe(true);
    }
  });

  it('should work with URLs that have query parameters', () => {
    if (typeof URL !== 'undefined') {
      const url = new URL('https://example.com/search?q=test&page=1');
      expect(isURL(url)).toBe(true);
    }
  });

  it('should work with URLs that have fragments', () => {
    if (typeof URL !== 'undefined') {
      const url = new URL('https://example.com/page#section1');
      expect(isURL(url)).toBe(true);
    }
  });
});
