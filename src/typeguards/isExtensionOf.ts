import type { TypeGuardFn } from './isType';

/**
 * Creates a type guard for types that extend a base type by combining
 * a base type guard with validation for additional properties.
 * This is specifically designed for inheritance patterns where one type extends another.
 * 
 * This function is particularly useful for:
 * - Interface inheritance: `interface Employee extends Person`
 * - Type extension patterns: `type Manager = Employee & { teamSize: number }`
 * - Validating hierarchical data structures
 * - Creating reusable base type guards with specialized extensions
 *
 * @param baseTypeGuard - Type guard for the base type that must be satisfied
 * @param extendedTypeGuard - Type guard for the full extended type (including base properties)
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
 * interface Manager extends Employee {
 *   teamSize: number;
 *   reportsTo: string;
 * }
 *
 * // Base type guard
 * const isPerson = isType<Person>({ name: isString, age: isNumber });
 * 
 * // Extended type guard (includes base properties)
 * const isEmployeeFull = isType<Employee>({
 *   name: isString,
 *   age: isNumber,
 *   employeeId: isString,
 *   department: isString
 * });
 * 
 * // Manager type guard (includes all properties)
 * const isManagerFull = isType<Manager>({
 *   name: isString,
 *   age: isNumber,
 *   employeeId: isString,
 *   department: isString,
 *   teamSize: isNumber,
 *   reportsTo: isString
 * });
 *
 * // Create extension type guards
 * const isEmployee = isExtensionOf(isPerson, isEmployeeFull);
 * const isManager = isExtensionOf(isEmployee, isManagerFull);
 *
 * // Usage examples
 * const employee = { 
 *   name: "John", 
 *   age: 30, 
 *   employeeId: "EMP001", 
 *   department: "Engineering" 
 * };
 * 
 * if (isEmployee(employee)) {
 *   // TypeScript knows employee is Employee (extends Person)
 *   console.log(`Employee ${employee.name} (${employee.employeeId}) works in ${employee.department}`);
 * }
 * 
 * const manager = { 
 *   name: "Jane", 
 *   age: 35, 
 *   employeeId: "EMP002", 
 *   department: "Engineering",
 *   teamSize: 5,
 *   reportsTo: "CTO"
 * };
 * 
 * if (isManager(manager)) {
 *   // TypeScript knows manager is Manager (extends Employee extends Person)
 *   console.log(`Manager ${manager.name} manages ${manager.teamSize} people in ${manager.department}`);
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

    // Then check if it satisfies the extended type
    return extendedTypeGuard(value, config);
  };
}
