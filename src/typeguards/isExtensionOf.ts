import type { TypeGuardFn } from "./isType";

/**
 * Creates a type guard for types that extend a base type by combining
 * a base type guard with validation for additional properties.
 * This is specifically designed for inheritance patterns where one type extends another.
 * 
 * @param baseTypeGuard - Type guard for the base type
 * @param extendedTypeGuard - Type guard for the additional properties only (excluding base type properties)
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
 * const isEmployeeAdditional = isType<Omit<Employee, keyof Person>>({ 
 *   employeeId: isString, 
 *   department: isString 
 * });
 * 
 * const isEmployee = isExtensionOf(isPerson, isEmployeeAdditional);
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
  extendedTypeGuard: TypeGuardFn<Omit<T, keyof U>>
): TypeGuardFn<T> {
  return function (value: unknown, config): value is T {
    // First check if it satisfies the base type
    if (!baseTypeGuard(value, config)) {
      return false;
    }

    // Then check if it satisfies the extended type (additional properties only)
    return extendedTypeGuard(value, config);
  };
} 