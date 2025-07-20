import { isDefined } from './isDefined';

describe('isDefined', () => {
  it('should return true for defined values (not null or undefined)', () => {
    expect(isDefined(0)).toBe(true);
    expect(isDefined('')).toBe(true);
    expect(isDefined(false)).toBe(true);
    expect(isDefined({})).toBe(true);
    expect(isDefined([])).toBe(true);
    expect(isDefined(NaN)).toBe(true);
  });

  it('should return false for null and undefined', () => {
    expect(isDefined(null)).toBe(false);
    expect(isDefined(undefined)).toBe(false);
  });

  it('should handle TypeGuardFn config for error reporting', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'user', callbackOnError: mockCallback };

    isDefined({ name: 'test' }, config);
    expect(mockCallback).not.toHaveBeenCalled();

    isDefined(null, config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(
      'Expected user (null) to be "isDefined"'
    );

    mockCallback.mockClear();
    isDefined(undefined, config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(
      'Expected user (undefined) to be "isDefined"'
    );
  });
});
