import { guardWithTolerance } from '@/typeguards/guardWithTolerance';
import { isNumber } from '@/typeguards/isNumber';

const isAround10 = guardWithTolerance(isNumber, (value) => Math.abs(value - 10) <= 1);
const isAroundZero = guardWithTolerance(isNumber, (value) => Math.abs(value) <= 0.5);

describe('guardWithTolerance', () => {
  it('should return true if base guard passes and tolerance check passes', () => {
    expect(isAround10(10)).toBe(true);
    expect(isAround10(9.5)).toBe(true);
    expect(isAround10(11)).toBe(true);
    expect(isAroundZero(0)).toBe(true);
    expect(isAroundZero(0.5)).toBe(true);
    expect(isAroundZero(-0.5)).toBe(true);
  });

  it('should return false if base guard fails', () => {
    expect(isAround10('10')).toBe(false);
    expect(isAround10(null)).toBe(false);
    expect(isAroundZero(undefined)).toBe(false);
  });

  it('should return false if base guard passes but tolerance check fails', () => {
    expect(isAround10(11.1)).toBe(false);
    expect(isAround10(8)).toBe(false);
    expect(isAroundZero(0.6)).toBe(false);
    expect(isAroundZero(-1)).toBe(false);
  });

  it('should handle error reporting from the base guard', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'value', callbackOnError: mockCallback };

    isAround10(10.5, config);
    expect(mockCallback).not.toHaveBeenCalled();

    // Error from base guard (isNumber)
    isAround10('not a number', config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('Expected value ("not a number") to be "number"');

    mockCallback.mockClear();

    // No error reported if tolerance check fails but base guard passes
    // (This guard doesn't add its own error messages for tolerance)
    isAround10(12, config);
    expect(mockCallback).not.toHaveBeenCalled();
  });
}); 