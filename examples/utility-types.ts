import type {
  NonEmptyArray,
  NonEmptyString,
  NonNegativeNumber,
  NonPositiveNumber,
  NegativeNumber,
  Nullable,
  PositiveNumber,
  Integer,
  PositiveInteger,
  NegativeInteger,
  NonNegativeInteger,
  NonPositiveInteger,
} from '../src';

console.log('=== GuardZ Utility Types ===');

// These are TypeScript utility types that provide compile-time type safety
// They don't have runtime validation but help with type checking

// NonEmptyArray - ensures array has at least one element
function processNonEmptyArray<T>(arr: NonEmptyArray<T>): T {
  // TypeScript knows this array is not empty, so we can safely access first element
  return arr[0];
}

// NonEmptyString - ensures string is not empty
function processNonEmptyString(str: NonEmptyString): string {
  // TypeScript knows this string is not empty
  return str.toUpperCase();
}

// Number utility types
function processPositiveNumber(num: PositiveNumber): number {
  // TypeScript knows this number is positive
  return Math.sqrt(num);
}

function processNonNegativeNumber(num: NonNegativeNumber): number {
  // TypeScript knows this number is >= 0
  return Math.sqrt(num);
}

function processInteger(num: Integer): number {
  // TypeScript knows this is an integer
  return num * 2;
}

function processPositiveInteger(num: PositiveInteger): number {
  // TypeScript knows this is a positive integer
  return num * 2;
}

// Nullable utility type
function processNullableString(str: Nullable<string>): string {
  // TypeScript knows this could be string | null
  return str ?? 'default';
}

// Example usage with type assertions
console.log('\n=== Example Usage ===');

// These utility types are branded types that require validation
// They're typically used in function signatures and interfaces
// rather than direct assignment

console.log('Utility types provide compile-time type safety');
console.log('They work best when combined with runtime validation');
console.log(
  'Direct assignment requires type assertions or validation functions'
);

// Practical example: Function signatures with utility types
interface UserProfile {
  id: PositiveInteger;
  name: NonEmptyString;
  email: NonEmptyString;
  age: NonNegativeInteger;
  tags: NonEmptyArray<string>;
  avatar?: Nullable<string>;
}

function createUserProfile(
  id: PositiveInteger,
  name: NonEmptyString,
  email: NonEmptyString,
  age: NonNegativeInteger,
  tags: NonEmptyArray<string>,
  avatar?: Nullable<string>
): UserProfile {
  return {
    id,
    name,
    email,
    age,
    tags,
    avatar,
  };
}

// This would work:
// const user = createUserProfile(1, "John", "john@example.com", 30, ["admin"], null);

// These would cause TypeScript errors:
// createUserProfile(0, "", "", -5, [], undefined); // Multiple type errors

console.log('\n=== Type Safety Benefits ===');
console.log('1. NonEmptyArray prevents empty arrays where not allowed');
console.log('2. NonEmptyString prevents empty strings where not allowed');
console.log('3. PositiveNumber ensures positive values');
console.log('4. Integer ensures whole numbers');
console.log('5. Nullable<T> makes null handling explicit');
console.log('6. All utility types provide compile-time safety');

console.log('\n=== Integration with Runtime Validation ===');
console.log(
  'These utility types work best when combined with runtime validation:'
);
console.log('- Use type guards to validate data at runtime');
console.log('- Use utility types to ensure type safety at compile time');
console.log('- This provides both runtime and compile-time safety');
