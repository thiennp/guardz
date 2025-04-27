import { isNonNullObject } from '@/typeguards/isNonNullObject';

describe('isNonNullObject', () => {
  it('should return true for non-null objects', () => {
    expect(isNonNullObject({})).toBe(true);
    expect(isNonNullObject({ a: 1 })).toBe(true);
    expect(isNonNullObject([])).toBe(false);
    expect(isNonNullObject(new Date())).toBe(true);
  });

  it('should return false for null and non-objects', () => {
    expect(isNonNullObject(null)).toBe(false);
    expect(isNonNullObject(undefined)).toBe(false);
    expect(isNonNullObject(123)).toBe(false);
    expect(isNonNullObject('hello')).toBe(false);
    expect(isNonNullObject(true)).toBe(false);
    expect(isNonNullObject(NaN)).toBe(false);
  });

  it('should handle TypeGuardFn config for error reporting', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'userData', callbackOnError: mockCallback };

    isNonNullObject({ name: 'test' }, config);
    expect(mockCallback).not.toHaveBeenCalled();

    isNonNullObject(null, config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('Expected userData (null) to be "non-null object"');

    mockCallback.mockClear();
    isNonNullObject(123, config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('Expected userData (123) to be "non-null object"');
  });
}); 