import { isFunction } from './isFunction';

describe('isFunction', () => {
  it('should return true for functions', () => {
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(function () {})).toBe(true);
    expect(isFunction(class {})).toBe(true);
    expect(isFunction(Math.max)).toBe(true);
    expect(isFunction(Array.isArray)).toBe(true);
    expect(isFunction(String)).toBe(true);
    expect(isFunction(Number)).toBe(true);
    expect(isFunction(Boolean)).toBe(true);
  });

  it('should return false for non-functions', () => {
    expect(isFunction('not a function')).toBe(false);
    expect(isFunction(123)).toBe(false);
    expect(isFunction({})).toBe(false);
    expect(isFunction([])).toBe(false);
    expect(isFunction(null)).toBe(false);
    expect(isFunction(undefined)).toBe(false);
    expect(isFunction(true)).toBe(false);
    expect(isFunction(Symbol('test'))).toBe(false);
  });

  it('should handle error reporting', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'callback', callbackOnError: mockCallback };

    isFunction('not a function', config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(
      'Expected callback ("not a function") to be "Function"'
    );
  });

  it('should not call error callback for valid functions', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'callback', callbackOnError: mockCallback };

    isFunction(() => {}, config);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should work with different function types', () => {
    // Arrow function
    expect(isFunction(() => 'arrow')).toBe(true);

    // Function declaration
    function testFunction() {
      return 'declaration';
    }
    expect(isFunction(testFunction)).toBe(true);

    // Function expression
    const funcExpr = function () {
      return 'expression';
    };
    expect(isFunction(funcExpr)).toBe(true);

    // Class constructor
    class TestClass {}
    expect(isFunction(TestClass)).toBe(true);

    // Built-in functions
    expect(isFunction(parseInt)).toBe(true);
    expect(isFunction(parseFloat)).toBe(true);
    expect(isFunction(isNaN)).toBe(true);
  });
});
