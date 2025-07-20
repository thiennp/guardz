import { isIntersectionOf } from './isIntersectionOf';
import { isType } from './isType';
import { isString } from './isString';
import { isNumber } from './isNumber';

describe('isIntersectionOf', () => {
  interface Person {
    name: string;
    age: number;
  }

  interface Employee {
    employeeId: string;
    department: string;
  }

  type PersonEmployee = Person & Employee;

  const isPerson = isType<Person>({
    name: isString,
    age: isNumber,
  });

  const isEmployee = isType<Employee>({
    employeeId: isString,
    department: isString,
  });

  const isPersonEmployee = isIntersectionOf(isPerson, isEmployee);

  it('should return true when value satisfies all type guards', () => {
    const validValue: PersonEmployee = {
      name: 'John Doe',
      age: 30,
      employeeId: 'EMP001',
      department: 'Engineering',
    };

    expect(isPersonEmployee(validValue)).toBe(true);
  });

  it('should return false when value fails any type guard', () => {
    const invalidValue = {
      name: 'John Doe',
      age: 30,
      employeeId: 'EMP001',
      // missing department
    };

    expect(isPersonEmployee(invalidValue)).toBe(false);
  });

  it('should return false when value fails the first type guard', () => {
    const invalidValue = {
      // missing name and age
      employeeId: 'EMP001',
      department: 'Engineering',
    };

    expect(isPersonEmployee(invalidValue)).toBe(false);
  });

  it('should work with more than two type guards', () => {
    interface HasId {
      id: number;
    }

    const hasId = isType<HasId>({ id: isNumber });
    const isTripleType = isIntersectionOf(isPerson, isEmployee, hasId);

    const validValue = {
      name: 'John Doe',
      age: 30,
      employeeId: 'EMP001',
      department: 'Engineering',
      id: 123,
    };

    const invalidValue = {
      name: 'John Doe',
      age: 30,
      employeeId: 'EMP001',
      department: 'Engineering',
      // missing id
    };

    expect(isTripleType(validValue)).toBe(true);
    expect(isTripleType(invalidValue)).toBe(false);
  });

  it('should work with single type guard', () => {
    const singleTypeGuard = isIntersectionOf(isPerson);

    const validValue = {
      name: 'John Doe',
      age: 30,
    };

    const invalidValue = {
      name: 'John Doe',
      // missing age
    };

    expect(singleTypeGuard(validValue)).toBe(true);
    expect(singleTypeGuard(invalidValue)).toBe(false);
  });

  it('should work with error configuration', () => {
    const errors: string[] = [];
    const config = {
      callbackOnError: (error: string) => errors.push(error),
      identifier: 'testValue',
    };

    const invalidValue = {
      name: 'John Doe',
      // missing age (fails first type guard)
      employeeId: 'EMP001',
      department: 'Engineering',
    };

    const result = isPersonEmployee(invalidValue, config);
    expect(result).toBe(false);
    expect(errors.length).toBeGreaterThan(0);
  });
});
