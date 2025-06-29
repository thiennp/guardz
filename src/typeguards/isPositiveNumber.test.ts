import { isPositiveNumber } from '@/typeguards/isPositiveNumber';

describe('isPositiveNumber', () => {
  it('should return true for non-negative numbers', () => {
    expect(isPositiveNumber(10)).toBe(true);
    expect(isPositiveNumber(1.23)).toBe(true);
    expect(isPositiveNumber(Number(5))).toBe(true);
  });
  
  it('should return false for negative numbers and non-numbers', () => {
    expect(isPositiveNumber(0)).toBe(false);
    expect(isPositiveNumber(-10)).toBe(false);
    expect(isPositiveNumber(-0.01)).toBe(false);
    expect(isPositiveNumber('hello')).toBe(false);
    expect(isPositiveNumber(NaN)).toBe(false);
    expect(isPositiveNumber(null)).toBe(false);
    expect(isPositiveNumber(undefined)).toBe(false);
    expect(isPositiveNumber({})).toBe(false);
    expect(isPositiveNumber([])).toBe(false);
    expect(isPositiveNumber(true)).toBe(false);
  });

  it('should handle TypeGuardFn config for error reporting', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'count', callbackOnError: mockCallback };

    isPositiveNumber(5, config);
    expect(mockCallback).not.toHaveBeenCalled();

    isPositiveNumber(-1, config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('Expected count (-1) to be "PositiveNumber"');

    mockCallback.mockClear();
    isPositiveNumber('text', config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('Expected count ("text") to be "PositiveNumber"');
  });
}); 