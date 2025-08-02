import { isRegex, isPattern } from '../src';
import type { Pattern } from '../src';

/**
 * Example demonstrating the usage of isRegex and isPattern type guards.
 * 
 * This example shows how to:
 * 1. Validate if a value is a RegExp object using isRegex
 * 2. Create pattern-based type guards using isPattern
 * 3. Use branded types for type safety
 */

// Example 1: Using isRegex to validate RegExp objects
console.log('=== isRegex Examples ===');

const patterns: unknown[] = [
  /^[a-z]+$/,
  new RegExp('\\d+'),
  'not a regex',
  123,
  null,
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/
];

patterns.forEach((pattern, index) => {
  if (isRegex(pattern)) {
    console.log(`Pattern ${index}: Valid RegExp - ${pattern.source} (flags: ${pattern.flags})`);
  } else {
    console.log(`Pattern ${index}: Not a RegExp - ${typeof pattern}`);
  }
});

// Example 2: Using isPattern for email validation
console.log('\n=== Email Validation with isPattern ===');

type Email = Pattern<'Email'>;
const isEmail = isPattern<'Email'>(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

const emailCandidates: unknown[] = [
  'user@example.com',
  'test@domain.org',
  'invalid-email',
  'user@',
  '@domain.com',
  '',
  123,
  null
];

emailCandidates.forEach((candidate, index) => {
  if (isEmail(candidate)) {
    // candidate is now typed as Email (branded string)
    console.log(`Email ${index}: Valid - ${candidate}`);
  } else {
    console.log(`Email ${index}: Invalid - ${candidate}`);
  }
});

// Example 3: Using isPattern with string patterns
console.log('\n=== Phone Number Validation with String Pattern ===');

type PhoneNumber = Pattern<'PhoneNumber'>;
const isPhoneNumber = isPattern<'PhoneNumber'>('^\\+?[\\d\\s\\-()]{10,}$');

const phoneCandidates: unknown[] = [
  '+1-555-123-4567',
  '555-123-4567',
  '(555) 123-4567',
  '123',
  'abc',
  '',
  123,
  null
];

phoneCandidates.forEach((candidate, index) => {
  if (isPhoneNumber(candidate)) {
    // candidate is now typed as PhoneNumber (branded string)
    console.log(`Phone ${index}: Valid - ${candidate}`);
  } else {
    console.log(`Phone ${index}: Invalid - ${candidate}`);
  }
});

// Example 4: URL validation
console.log('\n=== URL Validation ===');

const isUrl = isPattern<'URL'>('^https?:\\/\\/.+');

const urlCandidates: unknown[] = [
  'https://example.com',
  'http://test.org',
  'https://sub.domain.co.uk/path',
  'ftp://example.com',
  'not-a-url',
  '',
  123,
  null
];

urlCandidates.forEach((candidate, index) => {
  if (isUrl(candidate)) {
    // candidate is now typed as URL (branded string)
    console.log(`URL ${index}: Valid - ${candidate}`);
  } else {
    console.log(`URL ${index}: Invalid - ${candidate}`);
  }
});

// Example 5: Date format validation
console.log('\n=== Date Format Validation ===');

const isDateString = isPattern<'DateString'>('^\\d{4}-\\d{2}-\\d{2}$');

const dateCandidates: unknown[] = [
  '2023-12-25',
  '2023-13-01', // Invalid month
  '2023-12-32', // Invalid day
  '2023/12/25', // Wrong format
  '2023-12-25T10:30:00', // Too long
  '',
  123,
  null
];

dateCandidates.forEach((candidate, index) => {
  if (isDateString(candidate)) {
    // candidate is now typed as DateString (branded string)
    console.log(`Date ${index}: Valid - ${candidate}`);
  } else {
    console.log(`Date ${index}: Invalid - ${candidate}`);
  }
});

// Example 6: Error handling with config
console.log('\n=== Error Handling Example ===');

const mockErrorHandler = (error: string) => {
  console.log(`Error: ${error}`);
};

const config = {
  callbackOnError: mockErrorHandler,
  identifier: 'userInput'
};

// Test with invalid email
const invalidEmail: unknown = 'not-an-email';
if (!isEmail(invalidEmail, config)) {
  console.log('Email validation failed, but error was handled');
}

// Test with non-string value
const nonStringValue: unknown = 123;
if (!isEmail(nonStringValue, config)) {
  console.log('Type validation failed, but error was handled');
}

// Example 7: Type safety with branded types
console.log('\n=== Type Safety with Branded Types ===');

function processEmail(email: Email) {
  // This function only accepts validated email strings
  console.log(`Processing email: ${email}`);
  // TypeScript knows this is a validated email string
}

function processPhoneNumber(phone: PhoneNumber) {
  // This function only accepts validated phone number strings
  console.log(`Processing phone: ${phone}`);
  // TypeScript knows this is a validated phone number string
}

// These would work:
const validEmail: unknown = 'user@example.com';
if (isEmail(validEmail)) {
  processEmail(validEmail); // TypeScript knows this is safe
}

const validPhone: unknown = '+1-555-123-4567';
if (isPhoneNumber(validPhone)) {
  processPhoneNumber(validPhone); // TypeScript knows this is safe
}

// These would cause TypeScript errors:
// processEmail('invalid-email'); // Error: Argument of type 'string' is not assignable to parameter of type 'Email'
// processPhoneNumber('123'); // Error: Argument of type 'string' is not assignable to parameter of type 'PhoneNumber'

console.log('\n=== Example Complete ==='); 