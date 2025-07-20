import { isURLSearchParams } from './isURLSearchParams';

describe('isURLSearchParams', () => {
  it('should return true for URLSearchParams objects', () => {
    if (typeof URLSearchParams !== 'undefined') {
      expect(isURLSearchParams(new URLSearchParams())).toBe(true);
      expect(isURLSearchParams(new URLSearchParams('?name=john&age=30'))).toBe(
        true
      );
      expect(
        isURLSearchParams(new URLSearchParams({ name: 'john', age: '30' }))
      ).toBe(true);
      expect(isURLSearchParams(new URLSearchParams('name=john&age=30'))).toBe(
        true
      );
    } else {
      // In environments where URLSearchParams is not available
      expect(isURLSearchParams({})).toBe(false);
    }
  });

  it('should return false for non-URLSearchParams objects', () => {
    expect(isURLSearchParams('name=john&age=30')).toBe(false);
    expect(isURLSearchParams({ name: 'john' })).toBe(false);
    expect(isURLSearchParams(123)).toBe(false);
    expect(isURLSearchParams({})).toBe(false);
    expect(isURLSearchParams([])).toBe(false);
    expect(isURLSearchParams(null)).toBe(false);
    expect(isURLSearchParams(undefined)).toBe(false);
    expect(isURLSearchParams(true)).toBe(false);
    expect(isURLSearchParams(() => {})).toBe(false);
  });

  it('should handle error reporting', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'queryParams', callbackOnError: mockCallback };

    isURLSearchParams('name=john&age=30', config);
    expect(mockCallback).toHaveBeenCalledTimes(1);

    if (typeof URLSearchParams === 'undefined') {
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected queryParams ("name=john&age=30") to be "URLSearchParams (not available in this environment)"'
      );
    } else {
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected queryParams ("name=john&age=30") to be "URLSearchParams"'
      );
    }
  });

  it('should not call error callback for valid URLSearchParams objects', () => {
    if (typeof URLSearchParams !== 'undefined') {
      const mockCallback = jest.fn();
      const config = { identifier: 'params', callbackOnError: mockCallback };

      const params = new URLSearchParams();
      isURLSearchParams(params, config);

      expect(mockCallback).not.toHaveBeenCalled();
    }
  });

  it('should handle environment detection correctly', () => {
    // Test that the guard properly detects when URLSearchParams is not available
    const result = isURLSearchParams({});

    if (typeof URLSearchParams === 'undefined') {
      expect(result).toBe(false);
    } else {
      expect(result).toBe(false); // {} is not a URLSearchParams instance
    }
  });

  it('should work with URLSearchParams created from different sources', () => {
    if (typeof URLSearchParams !== 'undefined') {
      // From string
      expect(isURLSearchParams(new URLSearchParams('name=john&age=30'))).toBe(
        true
      );

      // From object
      expect(
        isURLSearchParams(new URLSearchParams({ name: 'john', age: '30' }))
      ).toBe(true);

      // From URL
      const url = new URL('https://example.com?name=john&age=30');
      expect(isURLSearchParams(url.searchParams)).toBe(true);
    }
  });

  it('should work with URLSearchParams that have multiple values for same key', () => {
    if (typeof URLSearchParams !== 'undefined') {
      const params = new URLSearchParams();
      params.append('tag', 'javascript');
      params.append('tag', 'typescript');
      params.append('tag', 'react');

      expect(isURLSearchParams(params)).toBe(true);
    }
  });

  it('should work with empty URLSearchParams', () => {
    if (typeof URLSearchParams !== 'undefined') {
      expect(isURLSearchParams(new URLSearchParams())).toBe(true);
      expect(isURLSearchParams(new URLSearchParams(''))).toBe(true);
    }
  });
});
