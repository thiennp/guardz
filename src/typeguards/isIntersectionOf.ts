import type { TypeGuardFn } from './isType';

/**
 * Creates a type guard that validates a value against multiple type guards,
 * ensuring the value satisfies all of them. This is useful for:
 * - Type intersection: `type Employee = Person & { employeeId: string }`
 * - Multiple type validation scenarios
 * - Combining multiple independent type checks
 *
 * @param typeGuards - Array of type guard functions that the value must satisfy
 * @returns A type guard function that returns true only if all provided type guards pass
 *
 * @example
 * ```typescript
 * interface Person {
 *   name: string;
 *   age: number;
 * }
 *
 * interface Employee {
 *   employeeId: string;
 *   department: string;
 * }
 *
 * type PersonEmployee = Person & Employee;
 *
 * const isPerson = isType<Person>({ name: isString, age: isNumber });
 * const isEmployee = isType<Employee>({ employeeId: isString, department: isString });
 * const isPersonEmployee = isIntersectionOf(isPerson, isEmployee);
 *
 * // Usage
 * const candidate = { name: "John", age: 30, employeeId: "EMP001", department: "Engineering" };
 * if (isPersonEmployee(candidate)) {
 *   // TypeScript now knows candidate is PersonEmployee
 *   console.log(`${candidate.name} works in ${candidate.department}`);
 * }
 * ```
 */
export function isIntersectionOf<T extends readonly unknown[]>(
  ...typeGuards: T
): TypeGuardFn<T[number] extends TypeGuardFn<infer U> ? U : never> {
  return function (
    value: unknown,
    config
  ): value is T[number] extends TypeGuardFn<infer U> ? U : never {
    for (const typeGuard of typeGuards) {
      if (!(typeGuard as TypeGuardFn<unknown>)(value, config)) {
        return false;
      }
    }
    return true;
  };
}
