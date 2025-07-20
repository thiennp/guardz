import { isBoolean } from './isBoolean';

describe('isBoolean', () => {
  it('should return true for booleans', () => {
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(false)).toBe(true);
    expect(isBoolean(Boolean(1))).toBe(true); // true
  });

  it('should return false for non-booleans', () => {
    expect(isBoolean(1)).toBe(false);
    expect(isBoolean(0)).toBe(false);
    expect(isBoolean('true')).toBe(false);
    expect(isBoolean(null)).toBe(false);
    expect(isBoolean(undefined)).toBe(false);
    expect(isBoolean({})).toBe(false);
    expect(isBoolean([])).toBe(false);
  });

  it('should handle TypeGuardFn config for error reporting', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'isActive', callbackOnError: mockCallback };

    isBoolean(true, config);
    expect(mockCallback).not.toHaveBeenCalled();

    isBoolean(1, config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(
      'Expected isActive (1) to be "boolean"'
    );
  });
});
