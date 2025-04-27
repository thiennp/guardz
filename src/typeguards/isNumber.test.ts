import { isNumber } from '@/typeguards/isNumber';

describe('isNumber', () => {
  it('should return true for numbers', () => {
    expect(isNumber(123)).toBe(true);
    expect(isNumber(0)).toBe(true);
    expect(isNumber(-10)).toBe(true);
    expect(isNumber(1.23)).toBe(true);
    expect(isNumber(Number(5))).toBe(true);
  });

  it('should return false for non-numbers', () => {
    expect(isNumber('hello')).toBe(false);
    expect(isNumber(NaN)).toBe(false); // NaN is technically a number, but often excluded
    expect(isNumber(null)).toBe(false);
    expect(isNumber(undefined)).toBe(false);
    expect(isNumber({})).toBe(false);
    expect(isNumber([])).toBe(false);
    expect(isNumber(true)).toBe(false);
    expect(isNumber(() => {})).toBe(false);
  });

  it('should handle TypeGuardFn config for error reporting', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'age', callbackOnError: mockCallback };

    isNumber(42, config);
    expect(mockCallback).not.toHaveBeenCalled();

    isNumber('not a number', config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    // Assuming generateTypeGuardError is used
    expect(mockCallback).toHaveBeenCalledWith('Expected age ("not a number") to be "number"');
  });
}); 