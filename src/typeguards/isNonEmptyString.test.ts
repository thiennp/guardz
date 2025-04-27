import { isNonEmptyString } from '@/typeguards/isNonEmptyString';

describe('isNonEmptyString', () => {
  it('should return true for non-empty strings', () => {
    expect(isNonEmptyString('hello')).toBe(true);
    expect(isNonEmptyString(' ')).toBe(false); // Whitespace-only string should be considered empty after trim
    expect(isNonEmptyString(String('test'))).toBe(true);
  });

  it('should return false for empty strings and non-strings', () => {
    expect(isNonEmptyString('')).toBe(false);
    expect(isNonEmptyString(123)).toBe(false);
    expect(isNonEmptyString(null)).toBe(false);
    expect(isNonEmptyString(undefined)).toBe(false);
    expect(isNonEmptyString({})).toBe(false);
    expect(isNonEmptyString([])).toBe(false);
    expect(isNonEmptyString(true)).toBe(false);
  });

  it('should handle TypeGuardFn config for error reporting', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'username', callbackOnError: mockCallback };

    isNonEmptyString('testuser', config);
    expect(mockCallback).not.toHaveBeenCalled();

    isNonEmptyString('', config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('Expected username ("") to be "NonEmptyString"');

    mockCallback.mockClear(); // Clear mock for next check
    isNonEmptyString(123, config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('Expected username (123) to be "NonEmptyString"');
  });
}); 