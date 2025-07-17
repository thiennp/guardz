import type { TypeGuardFn } from "./isType";

/**
 * A type guard that always returns true and asserts value is T.
 * Useful for types imported from 3rd parties or external sources where runtime validation is not possible or needed.
 * 
 * This is particularly helpful when:
 * - Working with external library types that don't provide type guards
 * - Dealing with API responses where you trust the type but need TypeScript assertion
 * - Testing scenarios where you want to bypass runtime validation
 * - Legacy code integration where type safety is needed but runtime checks aren't feasible
 *
 * @param value - The value to assert as type T
 * @returns Always returns true, but TypeScript treats the value as type T
 * 
 * @example
 * ```typescript
 * // Basic usage with external library types
 * import type { ExternalApiResponse } from 'some-external-lib';
 * const isExternalResponse = isAsserted<ExternalApiResponse>;
 * 
 * const data: unknown = { id: 123, name: 'test' };
 * if (isExternalResponse(data)) {
 *   // TypeScript knows data is ExternalApiResponse
 *   console.log(data.id); // No type error
 *   console.log(data.name); // No type error
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Usage with complex nested types
 * interface UserProfile {
 *   id: string;
 *   preferences: {
 *     theme: 'light' | 'dark';
 *     notifications: boolean;
 *   };
 *   metadata: Record<string, unknown>;
 * }
 * 
 * const isUserProfile = isAsserted<UserProfile>;
 * const profile: unknown = {
 *   id: 'user-123',
 *   preferences: { theme: 'dark', notifications: true },
 *   metadata: { lastLogin: new Date() }
 * };
 * 
 * if (isUserProfile(profile)) {
 *   // Full type safety for nested properties
 *   console.log(profile.preferences.theme); // 'light' | 'dark'
 *   console.log(profile.metadata.lastLogin); // unknown
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Usage in combination with other type guards
 * import { isType, isString, isNumber } from './isType';
 * 
 * interface ValidatedUser {
 *   name: string;
 *   age: number;
 * }
 * 
 * interface ExternalUser extends ValidatedUser {
 *   externalId: string;
 *   metadata: unknown;
 * }
 * 
 * const isValidatedUser = isType<ValidatedUser>({
 *   name: isString,
 *   age: isNumber
 * });
 * 
 * const isExternalUser = isExtensionOf(
 *   isValidatedUser,
 *   isAsserted<Omit<ExternalUser, keyof ValidatedUser>>
 * );
 * 
 * const user: unknown = {
 *   name: 'John',
 *   age: 30,
 *   externalId: 'ext-123',
 *   metadata: { source: 'api' }
 * };
 * 
 * if (isExternalUser(user)) {
 *   // TypeScript knows user is ExternalUser
 *   console.log(user.externalId); // string
 *   console.log(user.metadata); // unknown
 * }
 * ```
 */
export function isAsserted<T>(value: unknown): value is T {
  return true;
} 