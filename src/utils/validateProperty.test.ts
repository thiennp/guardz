import { validateProperty } from './validateProperty';
import { isString } from '../typeguards/isString';
import { isNumber } from '../typeguards/isNumber';
import { isType } from '../typeguards/isType';
import { isArrayWithEachItem } from '../typeguards/isArrayWithEachItem';
import { createTreeNode } from './createTreeNode';
import type { ValidationContext } from './validationTypes';

describe('validateProperty', () => {
  const baseContext = (errorMode: 'single' | 'multi' | 'json' = 'multi'): ValidationContext => ({
    path: 'user',
    config: {
      identifier: 'user',
      callbackOnError: jest.fn(),
      errorMode,
    },
    parentTree: createTreeNode('root', true, 'object'),
  });

  it('should drill into nested schema guards in multi mode', () => {
    const result = validateProperty(
      'profile',
      { age: '30' },
      isType({ age: isNumber }),
      baseContext('multi')
    );

    expect(result.valid).toBe(false);
    expect(result.errors[0]?.path).toBe('user.profile.age');
  });

  it('should drill into array guards in json mode', () => {
    const result = validateProperty(
      'tags',
      ['ok', 1],
      isArrayWithEachItem(isString),
      baseContext('json')
    );

    expect(result.valid).toBe(false);
    expect(result.errors[0]?.path).toBe('user.tags[1]');
  });

  it('should pass config to nested guards in single mode', () => {
    const errors: string[] = [];
    const context: ValidationContext = {
      path: 'user',
      config: {
        identifier: 'user',
        callbackOnError: (message) => errors.push(message),
        errorMode: 'single',
      },
    };

    validateProperty('profile', { age: '30' }, isType({ age: isNumber }), context);

    expect(errors[0]).toContain('user.profile.age');
  });

  it('should validate regular guards without config in multi mode', () => {
    const result = validateProperty('name', 123, isString, baseContext('multi'));

    expect(result.valid).toBe(false);
    expect(result.errors[0]?.message).toBe('Expected user.name (123) to be "string"');
  });

  it('should validate regular guards in single mode', () => {
    const result = validateProperty('name', 123, isString, baseContext('single'));

    expect(result.valid).toBe(false);
    expect(result.errors[0]?.message).toBe('Expected user.name (123) to be "string"');
  });
});
