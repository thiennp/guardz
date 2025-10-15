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
});
