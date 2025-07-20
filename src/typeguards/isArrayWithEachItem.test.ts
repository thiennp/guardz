import { isArrayWithEachItem } from './isArrayWithEachItem';
import { isNumber } from './isNumber';
import { isString } from './isString';

describe('isArrayWithEachItem', () => {
  const isNumberArray = isArrayWithEachItem(isNumber);
  const isStringArray = isArrayWithEachItem(isString);

  it('should return true for arrays where all items satisfy the predicate', () => {
    expect(isNumberArray([1, 2, 3])).toBe(true);
    expect(isNumberArray([])).toBe(true); // Empty array satisfies the condition
    expect(isStringArray(['a', 'b'])).toBe(true);
    expect(isStringArray([])).toBe(true);
  });

  it('should return false for non-arrays or arrays with items not satisfying the predicate', () => {
    expect(isNumberArray([1, '2', 3])).toBe(false);
    expect(isNumberArray({ 0: 1 })).toBe(false); // Not an array
    expect(isNumberArray(null)).toBe(false);
    expect(isNumberArray(undefined)).toBe(false);
    expect(isStringArray(['a', 1])).toBe(false);
  });

  it('should handle error reporting for the array itself and its items', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'nums', callbackOnError: mockCallback };

    isNumberArray([1, 2], config);
    expect(mockCallback).not.toHaveBeenCalled();

    // Test error for non-array
    isNumberArray('not an array', config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(
      'Expected nums ("not an array") to be "Array"'
    );

    mockCallback.mockClear();

    // Test error for an item within the array
    isNumberArray([1, 'two', 3], config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    // Error comes from the predicate (isNumber) applied to the item
    expect(mockCallback).toHaveBeenCalledWith(
      'Expected nums[1] ("two") to be "number"'
    );
  });
});
