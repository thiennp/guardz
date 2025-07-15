import { isExtensionOf } from './isExtensionOf';
import { isType } from './isType';
import { isString } from './isString';
import { isNumber } from './isNumber';
import { isBoolean } from './isBoolean';

describe('isExtensionOf', () => {
  interface Person {
    name: string;
    age: number;
  }

  interface Employee extends Person {
    employeeId: string;
    department: string;
  }

  const isPerson = isType<Person>({
    name: isString,
    age: isNumber,
  });

  const isEmployeeFull = isType<Employee>({
    name: isString,
    age: isNumber,
    employeeId: isString,
    department: isString,
  });

  const isEmployee = isExtensionOf(isPerson, isEmployeeFull);

  it('should return true when value satisfies both base and extended type guards', () => {
    const validEmployee: Employee = {
      name: 'John Doe',
      age: 30,
      employeeId: 'EMP001',
      department: 'Engineering',
    };

    expect(isEmployee(validEmployee)).toBe(true);
  });

  it('should return false when value fails base type guard', () => {
    const invalidValue = {
      // missing name and age (fails base type)
      employeeId: 'EMP001',
      department: 'Engineering',
    };

    expect(isEmployee(invalidValue)).toBe(false);
  });

  it('should return false when value satisfies base but fails extended type guard', () => {
    const invalidValue = {
      name: 'John Doe',
      age: 30,
      // missing employeeId and department (fails extended type)
    };

    expect(isEmployee(invalidValue)).toBe(false);
  });

  it('should work with complex inheritance hierarchies', () => {
    interface Manager extends Employee {
      managedTeamSize: number;
      isManager: boolean;
    }

    const isManagerFull = isType<Manager>({
      name: isString,
      age: isNumber,
      employeeId: isString,
      department: isString,
      managedTeamSize: isNumber,
      isManager: isBoolean,
    });

    const isManager = isExtensionOf(isEmployee, isManagerFull);

    const validManager: Manager = {
      name: 'Jane Smith',
      age: 35,
      employeeId: 'EMP002',
      department: 'Engineering',
      managedTeamSize: 5,
      isManager: true,
    };

    const invalidManager = {
      name: 'Jane Smith',
      age: 35,
      employeeId: 'EMP002',
      department: 'Engineering',
      // missing managedTeamSize and isManager
    };

    expect(isManager(validManager)).toBe(true);
    expect(isManager(invalidManager)).toBe(false);
  });

  it('should provide meaningful error messages', () => {
    const errors: string[] = [];
    const config = {
      callbackOnError: (error: string) => errors.push(error),
      identifier: 'candidate',
    };

    const invalidValue = {
      name: 'John Doe',
      // missing age (fails base type guard)
      employeeId: 'EMP001',
      department: 'Engineering',
    };

    const result = isEmployee(invalidValue, config);
    expect(result).toBe(false);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should work when base type guard passes but extended fails', () => {
    const errors: string[] = [];
    const config = {
      callbackOnError: (error: string) => errors.push(error),
      identifier: 'candidate',
    };

    const invalidValue = {
      name: 'John Doe',
      age: 30,
      // missing employeeId and department (passes base, fails extended)
    };

    const result = isEmployee(invalidValue, config);
    expect(result).toBe(false);
    expect(errors.length).toBeGreaterThan(0);
  });
}); 