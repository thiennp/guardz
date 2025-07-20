import { isNonNegativeNumber } from './isNonNegativeNumber';

describe('isNonNegativeNumber', () => {
  it('should return true for non-negative numbers', () => {
    expect(isNonNegativeNumber(0)).toBe(true);
    expect(isNonNegativeNumber(10)).toBe(true);
    expect(isNonNegativeNumber(1.23)).toBe(true);
    expect(isNonNegativeNumber(Number(5))).toBe(true);
  });

  it('should return false for negative numbers and non-numbers', () => {
    expect(isNonNegativeNumber(-10)).toBe(false);
    expect(isNonNegativeNumber(-0.01)).toBe(false);
    expect(isNonNegativeNumber('hello')).toBe(false);
    expect(isNonNegativeNumber(NaN)).toBe(false);
    expect(isNonNegativeNumber(null)).toBe(false);
    expect(isNonNegativeNumber(undefined)).toBe(false);
    expect(isNonNegativeNumber({})).toBe(false);
    expect(isNonNegativeNumber([])).toBe(false);
    expect(isNonNegativeNumber(true)).toBe(false);
  });

  it('should handle TypeGuardFn config for error reporting', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'count', callbackOnError: mockCallback };

    isNonNegativeNumber(5, config);
    expect(mockCallback).not.toHaveBeenCalled();

    isNonNegativeNumber(-1, config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(
      'Expected count (-1) to be "NonNegativeNumber"'
    );

    mockCallback.mockClear();
    isNonNegativeNumber('text', config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(
      'Expected count ("text") to be "NonNegativeNumber"'
    );
  });
});
