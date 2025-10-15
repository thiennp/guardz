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

  it('should pass when omitted keys are not present', () => {
    expect(omitAge({ name: 'A', isActive: true })).toBe(true);
    expect(omitNameAndActive({ age: 2 })).toBe(true);
  });

  it('should fail when an omitted key is present', () => {
    expect(omitAge({ age: 0 } as any)).toBe(false);
    expect(omitNameAndActive({ name: 'A' } as any)).toBe(false);
    expect(omitNameAndActive({ isActive: false } as any)).toBe(false);
  });

  it('should report error messages for present omitted keys', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'user', callbackOnError: mockCallback };

    omitAge({ age: 1 } as any, config);
    const messages1 = mockCallback.mock.calls.map((c) => c[0]);
    expect(messages1[0]).toEqual('Expected user.age (1) to be "undefined"');

    mockCallback.mockClear();
    omitNameAndActive({ name: 'A', isActive: false } as any, config);
    const messages2 = mockCallback.mock.calls.map((c) => c[0]);
    expect(messages2).toContain('Expected user.name ("A") to be "undefined"');
    expect(messages2).toContain('Expected user.isActive (false) to be "undefined"');
  });

  it('should return false for non-object values', () => {
    expect(omitAge(null as any)).toBe(false);
    expect(omitAge(undefined as any)).toBe(false);
    expect(omitAge([] as any)).toBe(false);
  });
});


