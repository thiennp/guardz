import { isOneOf } from '@/typeguards/isOneOf';

describe('isOneOf', () => {
  const isStatusOkOrPending = isOneOf('OK', 'PENDING');
  const isAllowedNumber = isOneOf(1, 3, 5);
  const isAllowedObject = isOneOf({ id: 1 }, { id: 2 }); // Checks reference

  it('should return true if value is one of the acceptable values', () => {
    expect(isStatusOkOrPending('OK')).toBe(true);
    expect(isStatusOkOrPending('PENDING')).toBe(true);
    expect(isAllowedNumber(3)).toBe(true);
  });

  it('should return false if value is not one of the acceptable values', () => {
    expect(isStatusOkOrPending('ERROR')).toBe(false);
    expect(isStatusOkOrPending(null)).toBe(false);
    expect(isAllowedNumber(2)).toBe(false);
    expect(isAllowedNumber('1')).toBe(false);
    expect(isAllowedObject({ id: 1 })).toBe(false); // Different reference
  });

  it('should handle error reporting', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'status', callbackOnError: mockCallback };

    isStatusOkOrPending('OK', config);
    expect(mockCallback).not.toHaveBeenCalled();

    isStatusOkOrPending('FAILED', config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    // Note: isOneOf uses custom error message format
    expect(mockCallback).toHaveBeenCalledWith('status ("FAILED") must be one of following values "OK" | "PENDING"');
  });
}); 