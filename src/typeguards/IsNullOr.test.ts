import { isNullOr } from '@/typeguards/IsNullOr'; // Note the capitalization
import { isString } from '@/typeguards/isString';
import { isNumber } from '@/typeguards/isNumber';

describe('isNullOr', () => {
  const isNullOrString = isNullOr(isString);
  const isNullOrNumber = isNullOr(isNumber);

  it('should return true for null or if the predicate returns true', () => {
    expect(isNullOrString(null)).toBe(true);
    expect(isNullOrString('hello')).toBe(true);
    expect(isNullOrNumber(null)).toBe(true);
    expect(isNullOrNumber(123)).toBe(true);
  });

  it('should return false if not null and the predicate returns false', () => {
    expect(isNullOrString(123)).toBe(false);
    expect(isNullOrString(undefined)).toBe(false);
    expect(isNullOrString({})).toBe(false);
    expect(isNullOrNumber('hello')).toBe(false);
    expect(isNullOrNumber(undefined)).toBe(false);
  });

  it('should handle error reporting from the predicate', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'optionalValue', callbackOnError: mockCallback };

    isNullOrString(null, config);
    expect(mockCallback).not.toHaveBeenCalled();

    isNullOrString('test', config);
    expect(mockCallback).not.toHaveBeenCalled();

    isNullOrString(123, config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    // Error comes from the isString predicate
    expect(mockCallback).toHaveBeenCalledWith('Expected optionalValue (123) to be "string"');
  });
}); 