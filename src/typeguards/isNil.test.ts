import { isNil } from './isNil';

describe('isNil', () => {
  it('should return true for null and undefined', () => {
    expect(isNil(null)).toBe(true);
    expect(isNil(undefined)).toBe(true);
  });

  it('should return false for defined values', () => {
    expect(isNil(0)).toBe(false);
    expect(isNil('')).toBe(false);
    expect(isNil(false)).toBe(false);
    expect(isNil({})).toBe(false);
    expect(isNil([])).toBe(false);
    expect(isNil(NaN)).toBe(false);
  });

  it('should handle TypeGuardFn config for error reporting', () => {
    const mockCallback = jest.fn();
    const config = {
      identifier: 'optionalValue',
      callbackOnError: mockCallback,
    };

    isNil(null, config);
    expect(mockCallback).not.toHaveBeenCalled();

    isNil(0, config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(
      'Expected optionalValue (0) to be "null | undefined"'
    );

    mockCallback.mockClear();
    isNil('hello', config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(
      'Expected optionalValue ("hello") to be "null | undefined"'
    );
  });
});
