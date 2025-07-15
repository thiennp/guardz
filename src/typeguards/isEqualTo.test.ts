import { isEqualTo } from '@/typeguards/isEqualTo';

describe('isEqualTo', () => {
  const value1 = 'hello';
  const value2 = 123;
  const value3 = { a: 1 };
  const value4 = null;
  const value5 = undefined;

  const isEqualToHello = isEqualTo(value1);
  const isEqualTo123 = isEqualTo(value2);
  const isEqualToObj = isEqualTo(value3);
  const isEqualToNull = isEqualTo(value4);
  const isEqualToUndefined = isEqualTo(value5);

  it('should return true for equal values (strict equality)', () => {
    expect(isEqualToHello(value1)).toBe(true);
    expect(isEqualTo123(value2)).toBe(true);
    expect(isEqualToObj(value3)).toBe(true); // Same object reference
    expect(isEqualToNull(value4)).toBe(true);
    expect(isEqualToUndefined(value5)).toBe(true);
  });

  it('should return false for unequal values', () => {
    expect(isEqualToHello('world')).toBe(false);
    expect(isEqualTo123(456)).toBe(false);
    expect(isEqualToObj({ a: 1 })).toBe(false); // Different object reference
    expect(isEqualToNull(undefined)).toBe(false);
    expect(isEqualToUndefined(null)).toBe(false);
    expect(isEqualToHello(value2)).toBe(false);
  });

  it('should handle error reporting', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'token', callbackOnError: mockCallback };
    const checkToken = isEqualTo('secret');

    checkToken('secret', config);
    expect(mockCallback).not.toHaveBeenCalled();

    checkToken('wrong', config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    // Note: isEqualTo uses custom error message format
    expect(mockCallback).toHaveBeenCalledWith('Expected token ("wrong") to be "equal to "secret""');
  });
}); 