import { isBranded, type Branded, type PredicateFn } from '../src';

/**
 * Example demonstrating the usage of PredicateFn type with isBranded.
 * 
 * This example shows how to:
 * 1. Use the PredicateFn type for type safety
 * 2. Create reusable predicate functions
 * 3. Use predicate functions with isBranded
 */

// Define branded types
type UserId = Branded<number, 'UserId'>;
type Email = Branded<string, 'Email'>;
type Age = Branded<number, 'Age'>;
type Password = Branded<string, 'Password'>;

// Create reusable predicate functions using PredicateFn type
const isPositiveInteger: PredicateFn = (value) => {
  return typeof value === 'number' && value > 0 && Number.isInteger(value);
};

const isValidEmail: PredicateFn = (value) => {
  if (typeof value !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

const isValidAge: PredicateFn = (value) => {
  if (typeof value !== 'number') return false;
  if (!Number.isInteger(value)) return false;
  if (value < 0) return false;
  if (value > 150) return false;
  return true;
};

const isValidPassword: PredicateFn = (value) => {
  if (typeof value !== 'string') return false;
  if (value.length < 8) return false;
  if (!/[A-Z]/.test(value)) return false;
  if (!/[a-z]/.test(value)) return false;
  if (!/\d/.test(value)) return false;
  return true;
};

// Create type guards using isBranded with PredicateFn
const isUserId = isBranded<UserId>(isPositiveInteger);
const isEmail = isBranded<Email>(isValidEmail);
const isAge = isBranded<Age>(isValidAge);
const isPassword = isBranded<Password>(isValidPassword);

// Example usage
console.log('=== PredicateFn Examples ===');

// Test UserId validation
const userIdCandidates: unknown[] = [123, -1, 0, 1.5, '123', null];
console.log('\n--- UserId Validation ---');
userIdCandidates.forEach((candidate, index) => {
  if (isUserId(candidate)) {
    console.log(`UserId ${index}: Valid - ${candidate}`);
  } else {
    console.log(`UserId ${index}: Invalid - ${candidate}`);
  }
});

// Test Email validation
const emailCandidates: unknown[] = [
  'user@example.com',
  'invalid-email',
  'user@',
  '@domain.com',
  '',
  123,
  null
];
console.log('\n--- Email Validation ---');
emailCandidates.forEach((candidate, index) => {
  if (isEmail(candidate)) {
    console.log(`Email ${index}: Valid - ${candidate}`);
  } else {
    console.log(`Email ${index}: Invalid - ${candidate}`);
  }
});

// Test Age validation
const ageCandidates: unknown[] = [25, -5, 151, 25.5, '25', null];
console.log('\n--- Age Validation ---');
ageCandidates.forEach((candidate, index) => {
  if (isAge(candidate)) {
    console.log(`Age ${index}: Valid - ${candidate}`);
  } else {
    console.log(`Age ${index}: Invalid - ${candidate}`);
  }
});

// Test Password validation
const passwordCandidates: unknown[] = [
  'ValidPass123',
  'short',
  'nouppercase123',
  'NOLOWERCASE123',
  'NoDigits',
  '',
  123,
  null
];
console.log('\n--- Password Validation ---');
passwordCandidates.forEach((candidate, index) => {
  if (isPassword(candidate)) {
    console.log(`Password ${index}: Valid - ${candidate}`);
  } else {
    console.log(`Password ${index}: Invalid - ${candidate}`);
  }
});

// Demonstrate type safety with branded types
console.log('\n--- Type Safety Examples ---');

function processUserId(id: UserId) {
  console.log(`Processing UserId: ${id}`);
}

function processEmail(email: Email) {
  console.log(`Processing Email: ${email}`);
}

function processAge(age: Age) {
  console.log(`Processing Age: ${age}`);
}

function processPassword(password: Password) {
  console.log(`Processing Password: ${password}`);
}

// These work with type safety
const validUserId: unknown = 123;
if (isUserId(validUserId)) {
  processUserId(validUserId); // TypeScript knows this is safe
}

const validEmail: unknown = 'user@example.com';
if (isEmail(validEmail)) {
  processEmail(validEmail); // TypeScript knows this is safe
}

const validAge: unknown = 25;
if (isAge(validAge)) {
  processAge(validAge); // TypeScript knows this is safe
}

const validPassword: unknown = 'ValidPass123';
if (isPassword(validPassword)) {
  processPassword(validPassword); // TypeScript knows this is safe
}

// These would cause TypeScript errors:
// processUserId(-1); // Error: Argument of type 'number' is not assignable to parameter of type 'UserId'
// processEmail('invalid'); // Error: Argument of type 'string' is not assignable to parameter of type 'Email'
// processAge(151); // Error: Argument of type 'number' is not assignable to parameter of type 'Age'
// processPassword('short'); // Error: Argument of type 'string' is not assignable to parameter of type 'Password'

console.log('\n=== Example Complete ==='); 