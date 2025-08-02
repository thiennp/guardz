import type { Branded } from '../typeguards/isBranded';

/**
 * A branded type for strings that match a specific pattern.
 * 
 * @template P - The pattern identifier (string literal type)
 * @returns A branded string type with the pattern brand
 * 
 * @example
 * ```typescript
 * type Email = Pattern<'Email'>;
 * type PhoneNumber = Pattern<'PhoneNumber'>;
 * type URL = Pattern<'URL'>;
 * ```
 */
export type Pattern<P extends string> = Branded<string, P>;
