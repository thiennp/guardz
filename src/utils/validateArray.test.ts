import { validateArray } from './validateArray';
import { isString } from '../typeguards/isString';
import { isNumber } from '../typeguards/isNumber';
import { isSchema } from '../typeguards/isSchema';

describe('validateArray', () => {
  const createContext = (path: string) => ({
    path,
    config: {
      identifier: path,
      callbackOnError: jest.fn(),
      errorMode: 'multi' as const,
    },
  });

  it('should return an array error for non-array values', () => {
    const result = validateArray('not-an-array', isString, createContext('user.tags'));

    expect(result.valid).toBe(false);
    expect(result.errors[0]?.message).toBe(
      'Expected user.tags ("not-an-array") to be "Array"'
    );
  });

  it('should validate primitive array items and collect index errors', () => {
    const result = validateArray(['ok', 123], isString, createContext('user.tags'));

    expect(result.valid).toBe(false);
    expect(result.errors[0]?.message).toBe(
      'Expected user.tags[1] (123) to be "string"'
    );
    expect(result.tree?.children?.['0']?.valid).toBe(true);
    expect(result.tree?.children?.['1']).toBeDefined();
  });

  it('should omit long primitive values from error messages', () => {
    const longValue = '1'.repeat(201);
    const result = validateArray([longValue], isNumber, createContext('user.tags'));

    expect(result.valid).toBe(false);
    expect(result.errors[0]?.message).toBe('Expected user.tags[0] to be "number"');
  });

  it('should validate object array items using nested schema metadata', () => {
    const itemGuard = isSchema({ value: isString });
    const result = validateArray(
      [{ value: 'ok' }, { value: 123 }],
      itemGuard,
      createContext('user.items')
    );

    expect(result.valid).toBe(false);
    expect(result.errors[0]?.message).toBe(
      'Expected user.items[1].value (123) to be "string"'
    );
  });

  it('should validate empty arrays', () => {
    const result = validateArray([], isString, createContext('user.tags'));

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
