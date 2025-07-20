import type { TypeGuardFn } from './isType';

/**
 * Creates a type guard for types that extend a base type by combining
 * a base type guard with validation for additional properties.
 * This is specifically designed for inheritance patterns where one type extends another.
 *
 * @param baseTypeGuard - Type guard for the base type
 * @param extendedTypeGuard - Type guard for the full extended type
 * @returns A type guard function for the extended type
 *
 * @example
 * ```typescript
 * interface Person {
 *   name: string;
 *   age: number;
 * }
 *
 * interface Employee extends Person {
 *   employeeId: string;
 *   department: string;
 * }
 *
 * const isPerson = isType<Person>({ name: isString, age: isNumber });
 * const isEmployeeFull = isType<Employee>({
 *   name: isString,
 *   age: isNumber,
 *   employeeId: isString,
 *   department: isString
 * });
 *
 * const isEmployee = isExtensionOf(isPerson, isEmployeeFull);
 *
 * // Usage
 * const candidate = { name: "John", age: 30, employeeId: "EMP001", department: "Engineering" };
 * if (isEmployee(candidate)) {
 *   // TypeScript knows candidate is Employee (extends Person)
 *   console.log(`Employee ${candidate.name} (${candidate.employeeId}) works in ${candidate.department}`);
 * }
 * ```
 */
export function isExtensionOf<T extends U, U>(
  baseTypeGuard: TypeGuardFn<U>,
  extendedTypeGuard: TypeGuardFn<T>
): TypeGuardFn<T> {
  return function (value: unknown, config): value is T {
    // First check if it satisfies the base type
    if (!baseTypeGuard(value, config)) {
      return false;
    }

    // Then check if it satisfies the extended type
    return extendedTypeGuard(value, config);
  };
}
