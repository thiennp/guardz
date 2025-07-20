import { isNonEmptyArray } from './isNonEmptyArray';

describe('isNonEmptyArray', () => {
  it('should return true for non-empty arrays', () => {
    expect(isNonEmptyArray([1])).toBe(true);
    expect(isNonEmptyArray([null])).toBe(true);
    expect(isNonEmptyArray([1, 2, 3])).toBe(true);
  });

  it('should return false for empty arrays and non-arrays', () => {
    expect(isNonEmptyArray([])).toBe(false);
    expect(isNonEmptyArray(null)).toBe(false);
    expect(isNonEmptyArray(undefined)).toBe(false);
  });

  it('should handle TypeGuardFn config for error reporting', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'items', callbackOnError: mockCallback };

    isNonEmptyArray([1, 2], config);
    expect(mockCallback).not.toHaveBeenCalled();

    isNonEmptyArray([], config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(
      'Expected items ([]) to be "NonEmptyArray"'
    );
  });
});
