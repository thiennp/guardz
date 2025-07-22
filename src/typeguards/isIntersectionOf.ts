import type { TypeGuardFn } from './isType';

/**
 * Creates a type guard that validates a value against multiple type guards,
 * ensuring the value satisfies all of them. This function provides overloads
 * for 1-10 type guards with exact intersection type inference.
 * 
 * This is useful for:
 * - Type intersection: `type Employee = Person & { employeeId: string }`
 * - Multiple type validation scenarios
 * - Combining multiple independent type checks
 * - Creating complex validation rules with precise type inference
 *
 * @param typeGuards - Type guard functions that the value must satisfy (1-10 guards)
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
 * interface Manager {
 *   teamSize: number;
 *   reportsTo: string;
 * }
 *
 * const isPerson = isType<Person>({ name: isString, age: isNumber });
 * const isEmployee = isType<Employee>({ employeeId: isString, department: isString });
 * const isManager = isType<Manager>({ teamSize: isNumber, reportsTo: isString });
 *
 * // Single type guard
 * const isPersonOnly = isIntersectionOf(isPerson);
 * // Type: TypeGuardFn<Person>
 *
 * // Two type guards - exact intersection type
 * const isPersonEmployee = isIntersectionOf(isPerson, isEmployee);
 * // Type: TypeGuardFn<Person & Employee>
 *
 * // Three type guards - exact intersection type
 * const isPersonEmployeeManager = isIntersectionOf(isPerson, isEmployee, isManager);
 * // Type: TypeGuardFn<Person & Employee & Manager>
 *
 * // Usage
 * const candidate = { 
 *   name: "John", 
 *   age: 30, 
 *   employeeId: "EMP001", 
 *   department: "Engineering",
 *   teamSize: 5,
 *   reportsTo: "CTO"
 * };
 * 
 * if (isPersonEmployeeManager(candidate)) {
 *   // TypeScript now knows candidate is Person & Employee & Manager
 *   console.log(`${candidate.name} manages ${candidate.teamSize} people in ${candidate.department}`);
 * }
 * ```
 */

// Overloads for 1-10 type guards
export function isIntersectionOf<T1>(
  typeGuard1: TypeGuardFn<T1>
): TypeGuardFn<T1>;

export function isIntersectionOf<T1, T2>(
  typeGuard1: TypeGuardFn<T1>,
  typeGuard2: TypeGuardFn<T2>
): TypeGuardFn<T1 & T2>;

export function isIntersectionOf<T1, T2, T3>(
  typeGuard1: TypeGuardFn<T1>,
  typeGuard2: TypeGuardFn<T2>,
  typeGuard3: TypeGuardFn<T3>
): TypeGuardFn<T1 & T2 & T3>;

export function isIntersectionOf<T1, T2, T3, T4>(
  typeGuard1: TypeGuardFn<T1>,
  typeGuard2: TypeGuardFn<T2>,
  typeGuard3: TypeGuardFn<T3>,
  typeGuard4: TypeGuardFn<T4>
): TypeGuardFn<T1 & T2 & T3 & T4>;

export function isIntersectionOf<T1, T2, T3, T4, T5>(
  typeGuard1: TypeGuardFn<T1>,
  typeGuard2: TypeGuardFn<T2>,
  typeGuard3: TypeGuardFn<T3>,
  typeGuard4: TypeGuardFn<T4>,
  typeGuard5: TypeGuardFn<T5>
): TypeGuardFn<T1 & T2 & T3 & T4 & T5>;

export function isIntersectionOf<T1, T2, T3, T4, T5, T6>(
  typeGuard1: TypeGuardFn<T1>,
  typeGuard2: TypeGuardFn<T2>,
  typeGuard3: TypeGuardFn<T3>,
  typeGuard4: TypeGuardFn<T4>,
  typeGuard5: TypeGuardFn<T5>,
  typeGuard6: TypeGuardFn<T6>
): TypeGuardFn<T1 & T2 & T3 & T4 & T5 & T6>;

export function isIntersectionOf<T1, T2, T3, T4, T5, T6, T7>(
  typeGuard1: TypeGuardFn<T1>,
  typeGuard2: TypeGuardFn<T2>,
  typeGuard3: TypeGuardFn<T3>,
  typeGuard4: TypeGuardFn<T4>,
  typeGuard5: TypeGuardFn<T5>,
  typeGuard6: TypeGuardFn<T6>,
  typeGuard7: TypeGuardFn<T7>
): TypeGuardFn<T1 & T2 & T3 & T4 & T5 & T6 & T7>;

export function isIntersectionOf<T1, T2, T3, T4, T5, T6, T7, T8>(
  typeGuard1: TypeGuardFn<T1>,
  typeGuard2: TypeGuardFn<T2>,
  typeGuard3: TypeGuardFn<T3>,
  typeGuard4: TypeGuardFn<T4>,
  typeGuard5: TypeGuardFn<T5>,
  typeGuard6: TypeGuardFn<T6>,
  typeGuard7: TypeGuardFn<T7>,
  typeGuard8: TypeGuardFn<T8>
): TypeGuardFn<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8>;

export function isIntersectionOf<T1, T2, T3, T4, T5, T6, T7, T8, T9>(
  typeGuard1: TypeGuardFn<T1>,
  typeGuard2: TypeGuardFn<T2>,
  typeGuard3: TypeGuardFn<T3>,
  typeGuard4: TypeGuardFn<T4>,
  typeGuard5: TypeGuardFn<T5>,
  typeGuard6: TypeGuardFn<T6>,
  typeGuard7: TypeGuardFn<T7>,
  typeGuard8: TypeGuardFn<T8>,
  typeGuard9: TypeGuardFn<T9>
): TypeGuardFn<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9>;

export function isIntersectionOf<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
  typeGuard1: TypeGuardFn<T1>,
  typeGuard2: TypeGuardFn<T2>,
  typeGuard3: TypeGuardFn<T3>,
  typeGuard4: TypeGuardFn<T4>,
  typeGuard5: TypeGuardFn<T5>,
  typeGuard6: TypeGuardFn<T6>,
  typeGuard7: TypeGuardFn<T7>,
  typeGuard8: TypeGuardFn<T8>,
  typeGuard9: TypeGuardFn<T9>,
  typeGuard10: TypeGuardFn<T10>
): TypeGuardFn<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10>;

// Implementation
export function isIntersectionOf(
  ...typeGuards: TypeGuardFn<unknown>[]
): TypeGuardFn<unknown> {
  return function (
    value: unknown,
    config
  ): value is unknown {
    for (const typeGuard of typeGuards) {
      if (!typeGuard(value, config)) {
        return false;
      }
    }
    return true;
  };
}
