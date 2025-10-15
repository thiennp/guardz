import { isPick } from './isPick';
import { isString } from './isString';
import { isNumber } from './isNumber';
import { isBoolean } from './isBoolean';
import { isType } from './isType';

interface TargetType {
  name: string;
  age?: number;
  isActive: boolean;
}

describe('isPick', () => {
  const isTarget = isType<TargetType>({
    name: isString,
    age: isNumber,
    isActive: isBoolean,
  });

  const isPickName = isPick<TargetType, 'name'>(isTarget, 'name');
  const isPickNameAndActive = isPick<TargetType, 'name' | 'isActive'>(
    isTarget,
    'name',
    'isActive'
  );
  const isPickAge = isPick<TargetType, 'age'>(isTarget, 'age');

  it('should return true when all picked keys are present', () => {
    expect(isPickName({ name: 'John' })).toBe(true);
    expect(isPickNameAndActive({ name: 'Jane', isActive: false })).toBe(true);
    expect(isPickAge({ age: 0 })).toBe(true);
    expect(
      isPickNameAndActive({ name: 'N', isActive: true, extra: 'ok' } as any)
    ).toBe(true);
  });

  it('should return false when a picked key is missing', () => {
    expect(isPickName({} as any)).toBe(false);
    expect(isPickNameAndActive({ name: 'Only name' } as any)).toBe(false);
  });

  it('does not validate types by itself (delegated to base guard)', () => {
    expect(isPickName({ name: 1 } as any)).toBe(true);
    expect(isPickAge({ age: '1' } as any)).toBe(true);
  });

  it('should return false for non-object values', () => {
    expect(isPickName(null as any)).toBe(false);
    expect(isPickName(undefined as any)).toBe(false);
    expect(isPickName([] as any)).toBe(false);
  });

  it('should handle error reporting for object type (structure only)', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'profile', callbackOnError: mockCallback };

    isPickName({ name: 'Valid' }, config);
    expect(mockCallback).not.toHaveBeenCalled();

    // non-object
    isPickName('invalid' as any, config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(
      'Expected profile ("invalid") to be "non-null object"'
    );

    mockCallback.mockClear();

    // missing picked key
    isPickName({} as any, config);
    expect(mockCallback).not.toHaveBeenCalled();
  });
});


