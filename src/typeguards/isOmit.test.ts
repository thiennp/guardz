import { isOmit } from './isOmit';
import { isType } from './isType';
import { isString } from './isString';
import { isNumber } from './isNumber';
import { isBoolean } from './isBoolean';

interface TargetType {
  name: string;
  age?: number;
  isActive: boolean;
}

describe('isOmit', () => {
  const isTarget = isType<TargetType>({
    name: isString,
    age: isNumber,
    isActive: isBoolean,
  });

  const omitAge = isOmit<TargetType, 'age'>(isTarget, 'age');
  const omitNameAndActive = isOmit<TargetType, 'name' | 'isActive'>(
    isTarget,
    'name',
    'isActive'
  );

  it('should pass regardless of omitted keys; validate the rest', () => {
    // omitted age can be present/wrong/missing; rest must be valid per base guard
    expect(omitAge({ name: 'A', isActive: true })).toBe(true);
    expect(omitAge({ name: 'A', isActive: true, age: 2 } as any)).toBe(true);
    expect(omitAge({ name: 'A', isActive: true, age: 'bad' } as any)).toBe(true);
    // when non-omitted props are invalid -> fail
    expect(omitAge({ name: 1, isActive: true } as any)).toBe(false);
    expect(omitNameAndActive({ age: 2 })).toBe(true);
  });

  it('should ignore errors for omitted keys and enforce remaining keys', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'user', callbackOnError: mockCallback };

    // age wrong type, but omitted; missing required non-omitted keys should error
    omitAge({ name: 'A' } as any, config);
    const msgs1 = mockCallback.mock.calls.map((c) => c[0]);
    expect(msgs1.length).toBe(1);
    expect(msgs1[0]).toBe('Expected user.isActive (undefined) to be "boolean"');

    mockCallback.mockClear();
    omitAge({ isActive: true } as any, config);
    const msgs2 = mockCallback.mock.calls.map((c) => c[0]);
    expect(msgs2.length).toBe(1);
    expect(msgs2[0]).toBe('Expected user.name (undefined) to be "string"');
  });

  it('should not report messages for omitted keys but still report for others', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'user', callbackOnError: mockCallback };

    omitAge({ age: 'bad' } as any, config);
    // no errors because other required properties are omitted as well; but omitted keys are ignored
    expect(mockCallback).not.toHaveBeenCalled();

    omitNameAndActive({ age: 'ok' as any } as any, config);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should return false for non-object values', () => {
    expect(omitAge(null as any)).toBe(false);
    expect(omitAge(undefined as any)).toBe(false);
    expect(omitAge([] as any)).toBe(false);
  });
});
