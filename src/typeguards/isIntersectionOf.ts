import type { TypeGuardFn } from "./isType";

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

// Overload for 2 type guards
export function isIntersectionOf<T, U>(
  ...typeGuards: [TypeGuardFn<T>, TypeGuardFn<U>]
): TypeGuardFn<T & U>;

// Overload for 3 type guards
export function isIntersectionOf<T, U, V>(
  ...typeGuards: [TypeGuardFn<T>, TypeGuardFn<U>, TypeGuardFn<V>]
): TypeGuardFn<T & U & V>;

// Overload for 4 type guards
export function isIntersectionOf<T, U, V, W>(
  ...typeGuards: [TypeGuardFn<T>, TypeGuardFn<U>, TypeGuardFn<V>, TypeGuardFn<W>]
): TypeGuardFn<T & U & V & W>;

// Overload for 5 type guards
export function isIntersectionOf<T, U, V, W, X>(
  ...typeGuards: [TypeGuardFn<T>, TypeGuardFn<U>, TypeGuardFn<V>, TypeGuardFn<W>, TypeGuardFn<X>]
): TypeGuardFn<T & U & V & W & X>;

// Overload for 6 type guards
export function isIntersectionOf<T, U, V, W, X, Y>(
  ...typeGuards: [TypeGuardFn<T>, TypeGuardFn<U>, TypeGuardFn<V>, TypeGuardFn<W>, TypeGuardFn<X>, TypeGuardFn<Y>]
): TypeGuardFn<T & U & V & W & X & Y>;

// Overload for 7 type guards
export function isIntersectionOf<T, U, V, W, X, Y, Z>(
  ...typeGuards: [TypeGuardFn<T>, TypeGuardFn<U>, TypeGuardFn<V>, TypeGuardFn<W>, TypeGuardFn<X>, TypeGuardFn<Y>, TypeGuardFn<Z>]
): TypeGuardFn<T & U & V & W & X & Y & Z>;

// Overload for 8 type guards
export function isIntersectionOf<T, U, V, W, X, Y, Z, A>(
  ...typeGuards: [TypeGuardFn<T>, TypeGuardFn<U>, TypeGuardFn<V>, TypeGuardFn<W>, TypeGuardFn<X>, TypeGuardFn<Y>, TypeGuardFn<Z>, TypeGuardFn<A>]
): TypeGuardFn<T & U & V & W & X & Y & Z & A>;

// Overload for 9 type guards
export function isIntersectionOf<T, U, V, W, X, Y, Z, A, B>(
  ...typeGuards: [TypeGuardFn<T>, TypeGuardFn<U>, TypeGuardFn<V>, TypeGuardFn<W>, TypeGuardFn<X>, TypeGuardFn<Y>, TypeGuardFn<Z>, TypeGuardFn<A>, TypeGuardFn<B>]
): TypeGuardFn<T & U & V & W & X & Y & Z & A & B>;

// Overload for 10 type guards
export function isIntersectionOf<T, U, V, W, X, Y, Z, A, B, C>(
  ...typeGuards: [TypeGuardFn<T>, TypeGuardFn<U>, TypeGuardFn<V>, TypeGuardFn<W>, TypeGuardFn<X>, TypeGuardFn<Y>, TypeGuardFn<Z>, TypeGuardFn<A>, TypeGuardFn<B>, TypeGuardFn<C>]
): TypeGuardFn<T & U & V & W & X & Y & Z & A & B & C>;

// Implementation
export function isIntersectionOf(
  ...typeGuards: TypeGuardFn<unknown>[]
): TypeGuardFn<unknown> {
  return function (value: unknown, config): value is unknown {
    for (let i = 0; i < typeGuards.length; i++) {
      const typeGuard = typeGuards[i];
      if (!typeGuard(value, config)) {
        return false;
      }
    }
    return true;
  };
}
