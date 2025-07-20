import { isUnknown } from './isUnknown';

describe('isUnknown', () => {
  it('should always return true for any value', () => {
    expect(isUnknown(123)).toBe(true);
    expect(isUnknown('hello')).toBe(true);
    expect(isUnknown(null)).toBe(true);
    expect(isUnknown(undefined)).toBe(true);
    expect(isUnknown({})).toBe(true);
    expect(isUnknown([])).toBe(true);
    expect(isUnknown(true)).toBe(true);
    expect(isUnknown(NaN)).toBe(true);
    expect(isUnknown(() => {})).toBe(true);
  });

  it('should not call error callback', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'anything', callbackOnError: mockCallback };
    isUnknown('whatever', config);
    expect(mockCallback).not.toHaveBeenCalled();
  });
});
