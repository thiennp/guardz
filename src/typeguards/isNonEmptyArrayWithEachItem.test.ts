import { isNonEmptyArrayWithEachItem } from '@/typeguards/isNonEmptyArrayWithEachItem';
import { isNumber } from '@/typeguards/isNumber';
import { isString } from '@/typeguards/isString';

describe('isNonEmptyArrayWithEachItem', () => {
  const isNonEmptyNumberArray = isNonEmptyArrayWithEachItem(isNumber);
  const isNonEmptyStringArray = isNonEmptyArrayWithEachItem(isString);

  it('should return true for non-empty arrays where all items satisfy the predicate', () => {
    expect(isNonEmptyNumberArray([1, 2, 3])).toBe(true);
    expect(isNonEmptyStringArray(['a', 'b'])).toBe(true);
    expect(isNonEmptyStringArray([' '])).toBe(true);
  });

  it('should return false for empty arrays, non-arrays, or arrays with items not satisfying the predicate', () => {
    expect(isNonEmptyNumberArray([])).toBe(false); // Empty array fails
    expect(isNonEmptyNumberArray([1, '2', 3])).toBe(false);
    expect(isNonEmptyNumberArray({ 0: 1 })).toBe(false);
    expect(isNonEmptyNumberArray(null)).toBe(false);
    expect(isNonEmptyNumberArray(undefined)).toBe(false);
    expect(isNonEmptyStringArray(['a', 1])).toBe(false);
    expect(isNonEmptyStringArray([])).toBe(false); // Empty array fails
  });

  it('should handle error reporting for emptiness, non-array, and item issues', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'ids', callbackOnError: mockCallback };

    isNonEmptyNumberArray([10], config);
    expect(mockCallback).not.toHaveBeenCalled();

    // Test error for empty array
    isNonEmptyNumberArray([], config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('Expected ids ([]) to be "non-empty array"');

    mockCallback.mockClear();

    // Test error for non-array
    isNonEmptyNumberArray(null, config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('Expected ids (null) to be "Array"');

    mockCallback.mockClear();

    // Test error for an item within the array
    isNonEmptyNumberArray([1, 'two', 3], config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('Expected ids[1] ("two") to be "number"');
  });
}); 