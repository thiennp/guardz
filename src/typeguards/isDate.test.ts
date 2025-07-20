import { isDate } from './isDate';

describe('isDate', () => {
  it('should return true for Date objects', () => {
    expect(isDate(new Date())).toBe(true);
    expect(isDate(new Date('2023-01-01'))).toBe(true);
  });

  it('should return false for invalid dates and non-Date objects', () => {
    expect(isDate(new Date('invalid date string'))).toBe(false); // Invalid Date object
    expect(isDate(Date.now())).toBe(false); // Number (timestamp)
    expect(isDate('2023-01-01')).toBe(false); // String
    expect(isDate(123)).toBe(false);
    expect(isDate(null)).toBe(false);
    expect(isDate(undefined)).toBe(false);
    expect(isDate({})).toBe(false);
    expect(isDate([])).toBe(false);
    expect(isDate(true)).toBe(false);
  });

  it('should handle TypeGuardFn config for error reporting', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'timestamp', callbackOnError: mockCallback };
    const validDate = new Date();
    const invalidDate = new Date('invalid');

    isDate(validDate, config);
    expect(mockCallback).not.toHaveBeenCalled();

    isDate(invalidDate, config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(
      `Expected timestamp (${invalidDate.toString()}) to be "Date"`
    );

    mockCallback.mockClear();
    isDate(123456789, config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(
      'Expected timestamp (123456789) to be "Date"'
    );
  });
});
