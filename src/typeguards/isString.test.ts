import { isString } from '@/typeguards/isString';

describe('isString', () => {
  it('should return true for strings', () => {
    expect(isString('hello')).toBe(true);
    expect(isString('')).toBe(true);
    expect(isString(String('test'))).toBe(true);
  });

  it('should return false for non-strings', () => {
    expect(isString(123)).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(undefined)).toBe(false);
    expect(isString({})).toBe(false);
    expect(isString([])).toBe(false);
    expect(isString(true)).toBe(false);
    expect(isString(() => {})).toBe(false);
  });

  it('should handle TypeGuardFn config for error reporting (optional)', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'myVar', callbackOnError: mockCallback };

    // Test case where it should pass (no error callback)
    isString('valid string', config);
    expect(mockCallback).not.toHaveBeenCalled();

    // Test case where it should fail (error callback should be called)
    isString(123, config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('Expected myVar (123) to be "string"'); 
  });
}); 