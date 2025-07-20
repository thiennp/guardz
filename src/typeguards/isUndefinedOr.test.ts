import { isUndefinedOr } from './isUndefinedOr';
import { isString } from './isString';
import { isNumber } from './isNumber';

describe('isUndefinedOr', () => {
  const isUndefinedOrString = isUndefinedOr(isString);
  const isUndefinedOrNumber = isUndefinedOr(isNumber);

  it('should return true for undefined or if the predicate returns true', () => {
    expect(isUndefinedOrString(undefined)).toBe(true);
    expect(isUndefinedOrString('hello')).toBe(true);
    expect(isUndefinedOrNumber(undefined)).toBe(true);
    expect(isUndefinedOrNumber(123)).toBe(true);
  });

  it('should return false if not undefined and the predicate returns false', () => {
    expect(isUndefinedOrString(123)).toBe(false);
    expect(isUndefinedOrString(null)).toBe(false);
    expect(isUndefinedOrString({})).toBe(false);
    expect(isUndefinedOrNumber('hello')).toBe(false);
    expect(isUndefinedOrNumber(null)).toBe(false);
  });

  it('should handle error reporting from the predicate', () => {
    const mockCallback = jest.fn();
    const config = {
      identifier: 'optionalName',
      callbackOnError: mockCallback,
    };

    isUndefinedOrString(undefined, config);
    expect(mockCallback).not.toHaveBeenCalled();

    isUndefinedOrString('test', config);
    expect(mockCallback).not.toHaveBeenCalled();

    isUndefinedOrString(123, config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    // Error comes from the isString predicate
    expect(mockCallback).toHaveBeenCalledWith(
      'Expected optionalName (123) to be "string"'
    );
  });
});
