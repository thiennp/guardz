import { isObjectWithEachItem } from '@/typeguards/isObjectWithEachItem';
import { isNumber } from '@/typeguards/isNumber';
import { isString } from '@/typeguards/isString';

describe('isObjectWithEachItem', () => {
  const isStringRecord = isObjectWithEachItem(isString);
  const isNumberRecord = isObjectWithEachItem(isNumber);

  it('should return true for objects where all values satisfy the predicate', () => {
    expect(isStringRecord({ a: 'hello', b: 'world' })).toBe(true);
    expect(isStringRecord({})).toBe(true); // Empty object satisfies
    expect(isNumberRecord({ x: 1, y: 0 })).toBe(true);
  });

  it('should return false for non-objects or objects with values not satisfying the predicate', () => {
    expect(isStringRecord({ a: 'hello', b: 123 })).toBe(false);
    expect(isStringRecord(['a', 'b'])).toBe(false); // Array is not a plain object in this context typically
    expect(isStringRecord(null)).toBe(false);
    expect(isStringRecord(undefined)).toBe(false);
    expect(isNumberRecord({ x: 1, y: '2' })).toBe(false);
  });

  it('should handle error reporting for the object itself and its values', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'data', callbackOnError: mockCallback };

    isNumberRecord({ count: 10 }, config);
    expect(mockCallback).not.toHaveBeenCalled();

    // Test error for non-object
    isNumberRecord(null, config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('Expected data (null) to be "Object"');

    mockCallback.mockClear();

    // Test error for a value within the object
    // Note: isObjectWithEachItem iterates values, index might not be predictable/stable for object keys
    // The identifier passed down might just be object[index], not object[key]
    isNumberRecord({ valid: 1, invalid: 'text' }, config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    // We expect an error from isNumber for the 'text' value
    // The exact identifier (e.g., data[0] or data[1]) depends on iteration order
    expect(mockCallback).toHaveBeenCalledWith(expect.stringMatching(/^Expected data\[\d+\] \("text"\) to be "number"$/));
  });
}); 