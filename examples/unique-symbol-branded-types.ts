/**
 * Example demonstrating unique symbol branded types support.
 * 
 * This example shows how to use branded types with unique symbols,
 * providing better type safety and avoiding string literal conflicts.
 */

import { isBranded, Branded, type BrandedWith } from '../src';

console.log('=== Unique Symbol Branded Types Example ===\n');

// ============================================================================
// 1. Custom unique symbol brands
// ============================================================================

console.log('--- Custom Unique Symbol Brands ---');

// Define custom symbol brands
const CustomUserIdBrand = Symbol('CustomUserId');
const CustomEmailBrand = Symbol('CustomEmail');
const CustomAgeBrand = Symbol('CustomAge');

// Define branded types with custom symbols
type CustomUserId = Branded<number, typeof CustomUserIdBrand>;
type CustomEmail = Branded<string, typeof CustomEmailBrand>;
type CustomAge = Branded<number, typeof CustomAgeBrand>;

// Create type guards for custom symbol branded types
const isCustomUserId = isBranded<CustomUserId>((value) => {
  return typeof value === 'number' && value > 0 && Number.isInteger(value);
});

const isCustomEmail = isBranded<CustomEmail>((value) => {
  if (typeof value !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
});

const isCustomAge = isBranded<CustomAge>((value) => {
  if (typeof value !== 'number') return false;
  if (!Number.isInteger(value)) return false;
  if (value < 0) return false;
  if (value > 150) return false;
  return true;
});

// Test custom symbol branded types
const customUserId: unknown = 123;
const customEmail: unknown = 'user@example.com';
const customAge: unknown = 25;

if (isCustomUserId(customUserId)) {
  console.log('Valid CustomUserId:', customUserId); // number & { readonly brand: typeof CustomUserIdBrand }
}

if (isCustomEmail(customEmail)) {
  console.log('Valid CustomEmail:', customEmail); // string & { readonly brand: typeof CustomEmailBrand }
}

if (isCustomAge(customAge)) {
  console.log('Valid CustomAge:', customAge); // number & { readonly brand: typeof CustomAgeBrand }
}

// ============================================================================
// 2. Predefined brand symbols
// ============================================================================

console.log('\n--- Predefined Brand Symbols ---');

// Use predefined brand symbols
type PredefinedUserId = BrandedWith<number, 'UserId'>;
type PredefinedEmail = BrandedWith<string, 'Email'>;
type PredefinedPassword = BrandedWith<string, 'Password'>;
type PredefinedAge = BrandedWith<number, 'Age'>;

// Create type guards using predefined symbols
const isPredefinedUserId = isBranded<PredefinedUserId>((value) => {
  return typeof value === 'number' && value > 0 && Number.isInteger(value);
});

const isPredefinedEmail = isBranded<PredefinedEmail>((value) => {
  if (typeof value !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
});

const isPredefinedPassword = isBranded<PredefinedPassword>((value) => {
  if (typeof value !== 'string') return false;
  if (value.length < 8) return false;
  if (!/[A-Z]/.test(value)) return false;
  if (!/[a-z]/.test(value)) return false;
  if (!/\d/.test(value)) return false;
  return true;
});

const isPredefinedAge = isBranded<PredefinedAge>((value) => {
  if (typeof value !== 'number') return false;
  if (!Number.isInteger(value)) return false;
  if (value < 0) return false;
  if (value > 150) return false;
  return true;
});

// Test predefined brand symbols
const predefinedUserId: unknown = 456;
const predefinedEmail: unknown = 'admin@example.com';
const predefinedPassword: unknown = 'SecurePass123';
const predefinedAge: unknown = 30;

if (isPredefinedUserId(predefinedUserId)) {
  console.log('Valid PredefinedUserId:', predefinedUserId);
}

if (isPredefinedEmail(predefinedEmail)) {
  console.log('Valid PredefinedEmail:', predefinedEmail);
}

if (isPredefinedPassword(predefinedPassword)) {
  console.log('Valid PredefinedPassword:', predefinedPassword);
}

if (isPredefinedAge(predefinedAge)) {
  console.log('Valid PredefinedAge:', predefinedAge);
}

// ============================================================================
// 3. Complex branded types with unique symbols
// ============================================================================

console.log('\n--- Complex Branded Types with Unique Symbols ---');

// Branded type for API responses
const ApiResponseBrand = Symbol('ApiResponse');
type ApiResponse<T> = Branded<T, typeof ApiResponseBrand>;

const isValidApiResponse = isBranded<ApiResponse<any>>((value) => {
  if (typeof value !== 'object' || value === null) return false;
  if (!('data' in value)) return false;
  if (!('status' in value)) return false;
  if (typeof value.status !== 'number') return false;
  return true;
});

// Branded type for database IDs
const DatabaseIdBrand = Symbol('DatabaseId');
type DatabaseId = Branded<number, typeof DatabaseIdBrand>;

const isDatabaseId = isBranded<DatabaseId>((value) => {
  return typeof value === 'number' && value > 0 && Number.isInteger(value);
});

// Branded type for session tokens
const SessionTokenBrand = Symbol('SessionToken');
type SessionToken = Branded<string, typeof SessionTokenBrand>;

const isSessionToken = isBranded<SessionToken>((value) => {
  if (typeof value !== 'string') return false;
  if (value.length < 32) return false;
  // Check for UUID-like format
  const tokenRegex = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
  return tokenRegex.test(value);
});

// Test complex branded types
const apiResponse: unknown = { data: { id: 1 }, status: 200 };
const databaseId: unknown = 789;
const sessionToken: unknown = '550e8400-e29b-41d4-a716-446655440000';

if (isValidApiResponse(apiResponse)) {
  console.log('Valid ApiResponse:', apiResponse);
}

if (isDatabaseId(databaseId)) {
  console.log('Valid DatabaseId:', databaseId);
}

if (isSessionToken(sessionToken)) {
  console.log('Valid SessionToken:', sessionToken);
}

// ============================================================================
// 4. Error handling with unique symbol branded types
// ============================================================================

console.log('\n--- Error Handling with Unique Symbol Brands ---');

const errors: string[] = [];
const config = {
  callbackOnError: (error: string) => errors.push(error),
  identifier: 'test'
};

// Test invalid values with error collection
const invalidCustomUserId: unknown = -1;
const invalidCustomEmail: unknown = 'not-an-email';
const invalidCustomAge: unknown = 200;

isCustomUserId(invalidCustomUserId, config);
isCustomEmail(invalidCustomEmail, config);
isCustomAge(invalidCustomAge, config);

console.log('Validation errors:', errors);

// ============================================================================
// 5. Type safety demonstration
// ============================================================================

console.log('\n--- Type Safety Demonstration ---');

// Demonstrate that different branded types are not interchangeable
function processUserId(id: CustomUserId) {
  console.log('Processing custom user ID:', id);
}

function processPredefinedUserId(id: PredefinedUserId) {
  console.log('Processing predefined user ID:', id);
}

// This would cause a TypeScript error:
// const customId: CustomUserId = 123 as CustomUserId;
// const predefinedId: PredefinedUserId = 456 as PredefinedUserId;
// processUserId(predefinedId); // Error: Type 'PredefinedUserId' is not assignable to 'CustomUserId'

console.log('Type safety ensures different branded types are not interchangeable');

// Demonstrate function usage (these would work with valid branded types)
if (isCustomUserId(customUserId)) {
  processUserId(customUserId);
}

if (isPredefinedUserId(predefinedUserId)) {
  processPredefinedUserId(predefinedUserId);
}

// ============================================================================
// 6. Comparison with string-based brands
// ============================================================================

console.log('\n--- Comparison with String-based Brands ---');

// String-based branded type (current approach)
type StringUserId = Branded<number, 'UserId'>;
const isStringUserId = isBranded<StringUserId>((value) => {
  return typeof value === 'number' && value > 0 && Number.isInteger(value);
});

// Symbol-based branded type (unique symbol approach)
type SymbolUserId = Branded<number, typeof CustomUserIdBrand>;
const isSymbolUserId = isBranded<SymbolUserId>((value) => {
  return typeof value === 'number' && value > 0 && Number.isInteger(value);
});

// Both work the same way functionally
const stringUserId: unknown = 123;
const symbolUserId: unknown = 456;

if (isStringUserId(stringUserId)) {
  console.log('Valid StringUserId:', stringUserId);
}

if (isSymbolUserId(symbolUserId)) {
  console.log('Valid SymbolUserId:', symbolUserId);
}

console.log('\n=== Summary ===');
console.log('✅ Unique symbol branded types provide better type safety');
console.log('✅ Predefined brand symbols for common use cases');
console.log('✅ Custom symbol brands for specific domains');
console.log('✅ Full TypeScript support with proper type narrowing');
console.log('✅ Error handling and validation');
console.log('✅ Type safety prevents mixing different branded types');
console.log('✅ Both string and symbol brands work seamlessly'); 