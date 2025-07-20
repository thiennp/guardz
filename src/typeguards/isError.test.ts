import { isError } from './isError';

describe('isError', () => {
  it('should return true for Error objects', () => {
    expect(isError(new Error('Something went wrong'))).toBe(true);
    expect(isError(new TypeError('Invalid type'))).toBe(true);
    expect(isError(new ReferenceError('Not defined'))).toBe(true);
    expect(isError(new SyntaxError('Invalid syntax'))).toBe(true);
    expect(isError(new RangeError('Out of range'))).toBe(true);
    expect(isError(new URIError('Invalid URI'))).toBe(true);
  });

  it('should return false for non-Error objects', () => {
    expect(isError('error message')).toBe(false);
    expect(isError(123)).toBe(false);
    expect(isError({ message: 'error' })).toBe(false);
    expect(isError([])).toBe(false);
    expect(isError(null)).toBe(false);
    expect(isError(undefined)).toBe(false);
    expect(isError(true)).toBe(false);
    expect(isError(() => {})).toBe(false);
  });

  it('should handle error reporting', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'caughtError', callbackOnError: mockCallback };

    isError('not an error', config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(
      'Expected caughtError ("not an error") to be "Error"'
    );
  });

  it('should not call error callback for valid Error objects', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'caughtError', callbackOnError: mockCallback };

    isError(new Error('test'), config);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should work with custom Error subclasses', () => {
    class CustomError extends Error {
      constructor(message: string) {
        super(message);
        this.name = 'CustomError';
      }
    }

    expect(isError(new CustomError('Custom error'))).toBe(true);
  });

  it('should work with error-like objects that extend Error', () => {
    class ValidationError extends Error {
      constructor(
        public field: string,
        message: string
      ) {
        super(message);
        this.name = 'ValidationError';
      }
    }

    expect(isError(new ValidationError('email', 'Invalid email'))).toBe(true);
  });
});
