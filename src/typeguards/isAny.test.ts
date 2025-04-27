import { isAny } from '@/typeguards/isAny';

describe('isAny', () => {
  it('should always return true for any value', () => {
    expect(isAny(123)).toBe(true);
    expect(isAny('hello')).toBe(true);
    expect(isAny(null)).toBe(true);
    expect(isAny(undefined)).toBe(true);
    expect(isAny({})).toBe(true);
    expect(isAny([])).toBe(true);
    expect(isAny(true)).toBe(true);
    expect(isAny(NaN)).toBe(true);
    expect(isAny(() => {})).toBe(true);
  });

  it('should not call error callback', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'anything', callbackOnError: mockCallback };
    isAny('whatever', config);
    expect(mockCallback).not.toHaveBeenCalled();
  });
}); 