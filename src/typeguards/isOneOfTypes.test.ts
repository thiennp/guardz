import { isString } from '@/typeguards/isString';
import { isNumber } from '@/typeguards/isNumber';
import { isOneOfTypes } from '@/typeguards/isOneOfTypes';

describe('isOneOfTypes', () => {
  const isStringOrNumber = isOneOfTypes<string | number>(isString, isNumber);

  it('should return true if value matches one of the type guards', () => {
    expect(isStringOrNumber('hello')).toBe(true);
    expect(isStringOrNumber(123)).toBe(true);
    expect(isStringOrNumber(0)).toBe(true);
  });

  it('should return false if value matches none of the type guards', () => {
    expect(isStringOrNumber(null)).toBe(false);
    expect(isStringOrNumber(undefined)).toBe(false);
    expect(isStringOrNumber(true)).toBe(false);
    expect(isStringOrNumber({})).toBe(false);
    expect(isStringOrNumber([])).toBe(false);
    expect(isStringOrNumber(() => {})).toBe(false);
  });

  it('should handle error reporting with detailed reasons', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'value', callbackOnError: mockCallback };

    isStringOrNumber('test', config);
    expect(mockCallback).not.toHaveBeenCalled();

    isStringOrNumber(true, config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    // Note: isOneOfTypes uses custom error message format
    // It aggregates errors from the failing guards
    const expectedError = [
      'Expected value (true) type to match one of "isString | isNumber"',
      '- Expected value (true) to be "string"',
      '- Expected value (true) to be "number"',
    ].join('\n');
    expect(mockCallback).toHaveBeenCalledWith(expectedError);
  });
}); 