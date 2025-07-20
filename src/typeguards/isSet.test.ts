import { isSet } from './isSet';

describe('isSet', () => {
  it('should return true for Set objects', () => {
    expect(isSet(new Set())).toBe(true);
    expect(isSet(new Set([1, 2, 3]))).toBe(true);
    expect(isSet(new Set(['a', 'b', 'c']))).toBe(true);
  });

  it('should return false for non-Set objects', () => {
    expect(isSet([])).toBe(false);
    expect(isSet({})).toBe(false);
    expect(isSet('not a set')).toBe(false);
    expect(isSet(123)).toBe(false);
    expect(isSet(null)).toBe(false);
    expect(isSet(undefined)).toBe(false);
    expect(isSet(true)).toBe(false);
    expect(isSet(new Map())).toBe(false);
  });

  it('should handle error reporting', () => {
    const mockCallback = jest.fn();
    const config = {
      identifier: 'uniqueValues',
      callbackOnError: mockCallback,
    };

    isSet('not a set', config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(
      'Expected uniqueValues ("not a set") to be "Set"'
    );
  });

  it('should not call error callback for valid Set objects', () => {
    const mockCallback = jest.fn();
    const config = {
      identifier: 'uniqueValues',
      callbackOnError: mockCallback,
    };

    isSet(new Set(), config);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should work with different Set types', () => {
    // Empty Set
    expect(isSet(new Set())).toBe(true);

    // Set with numbers
    expect(isSet(new Set([1, 2, 3]))).toBe(true);

    // Set with strings
    expect(isSet(new Set(['a', 'b', 'c']))).toBe(true);

    // Set with mixed types
    expect(isSet(new Set([1, 'two', true]))).toBe(true);
  });
});
