import { isMap } from './isMap';

describe('isMap', () => {
  it('should return true for Map objects', () => {
    expect(isMap(new Map())).toBe(true);
    expect(isMap(new Map([['key', 'value']]))).toBe(true);
    expect(
      isMap(
        new Map([
          [1, 'one'],
          [2, 'two'],
        ])
      )
    ).toBe(true);
  });

  it('should return false for non-Map objects', () => {
    expect(isMap({})).toBe(false);
    expect(isMap([])).toBe(false);
    expect(isMap('not a map')).toBe(false);
    expect(isMap(123)).toBe(false);
    expect(isMap(null)).toBe(false);
    expect(isMap(undefined)).toBe(false);
    expect(isMap(true)).toBe(false);
    expect(isMap(new Set())).toBe(false);
  });

  it('should handle error reporting', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'cache', callbackOnError: mockCallback };

    isMap('not a map', config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(
      'Expected cache ("not a map") to be "Map"'
    );
  });

  it('should not call error callback for valid Map objects', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'cache', callbackOnError: mockCallback };

    isMap(new Map(), config);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should work with different Map types', () => {
    // Empty Map
    expect(isMap(new Map())).toBe(true);

    // Map with string keys
    expect(
      isMap(
        new Map([
          ['a', 1],
          ['b', 2],
        ])
      )
    ).toBe(true);

    // Map with mixed key types
    expect(
      isMap(
        new Map<number | string, number | string>([
          [1, 'one'],
          ['two', 2],
        ])
      )
    ).toBe(true);

    // Map with object keys
    const objKey = { id: 1 };
    expect(isMap(new Map([[objKey, 'value']]))).toBe(true);
  });
});
