import {
  isString,
  isNonEmptyString
} from '../src';

console.log('=== String Type Guards ===');

// Basic string validation
console.log('isString("hello"):', isString("hello")); // true
console.log('isString(""):', isString("")); // true (empty string is still a string)
console.log('isString(42):', isString(42)); // false
console.log('isString(null):', isString(null)); // false
console.log('isString(undefined):', isString(undefined)); // false

// Non-empty string validation
console.log('\n=== Non-Empty String Validation ===');
console.log('isNonEmptyString("hello"):', isNonEmptyString("hello")); // true
console.log('isNonEmptyString(""):', isNonEmptyString("")); // false
console.log('isNonEmptyString("   "):', isNonEmptyString("   ")); // true (spaces are characters)
console.log('isNonEmptyString(42):', isNonEmptyString(42)); // false

// Practical example: Username validation
function validateUsername(username: unknown): string {
  if (!isNonEmptyString(username)) {
    throw new Error('Username must be a non-empty string');
  }
  
  if (username.length < 3) {
    throw new Error('Username must be at least 3 characters long');
  }
  
  if (username.length > 20) {
    throw new Error('Username must be at most 20 characters long');
  }
  
  // Check for valid characters (alphanumeric and underscore only)
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    throw new Error('Username can only contain letters, numbers, and underscores');
  }
  
  return username;
}

console.log('\n=== Username Validation Example ===');
try {
  console.log('Valid username "john_doe":', validateUsername("john_doe"));
  console.log('Valid username "user123":', validateUsername("user123"));
  
  // These would throw errors:
  // validateUsername("");
  // validateUsername("ab"); // too short
  // validateUsername("very_long_username_that_exceeds_limit"); // too long
  // validateUsername("user@name"); // invalid characters
} catch (error) {
  console.error('Username validation error:', error instanceof Error ? error.message : String(error));
}

// Practical example: Email validation
function validateEmail(email: unknown): string {
  if (!isNonEmptyString(email)) {
    throw new Error('Email must be a non-empty string');
  }
  
  // Basic email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Email must be in a valid format (e.g., user@domain.com)');
  }
  
  return email;
}

console.log('\n=== Email Validation Example ===');
try {
  console.log('Valid email "user@example.com":', validateEmail("user@example.com"));
  console.log('Valid email "test.email+tag@domain.co.uk":', validateEmail("test.email+tag@domain.co.uk"));
  
  // These would throw errors:
  // validateEmail("");
  // validateEmail("invalid-email");
  // validateEmail("@domain.com");
  // validateEmail("user@");
} catch (error) {
  console.error('Email validation error:', error instanceof Error ? error.message : String(error));
}

// Practical example: Password validation
function validatePassword(password: unknown): string {
  if (!isNonEmptyString(password)) {
    throw new Error('Password must be a non-empty string');
  }
  
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }
  
  if (password.length > 128) {
    throw new Error('Password must be at most 128 characters long');
  }
  
  // Check for at least one uppercase letter, one lowercase letter, and one number
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    throw new Error('Password must contain at least one uppercase letter, one lowercase letter, and one number');
  }
  
  return password;
}

console.log('\n=== Password Validation Example ===');
try {
  console.log('Valid password "SecurePass123":', validatePassword("SecurePass123"));
  
  // These would throw errors:
  // validatePassword("");
  // validatePassword("short"); // too short
  // validatePassword("nouppercase123"); // no uppercase
  // validatePassword("NOLOWERCASE123"); // no lowercase
  // validatePassword("NoNumbers"); // no numbers
} catch (error) {
  console.error('Password validation error:', error instanceof Error ? error.message : String(error));
}

// Practical example: URL validation
function validateURL(url: unknown): string {
  if (!isNonEmptyString(url)) {
    throw new Error('URL must be a non-empty string');
  }
  
  try {
    new URL(url);
    return url;
  } catch {
    throw new Error('URL must be in a valid format');
  }
}

console.log('\n=== URL Validation Example ===');
try {
  console.log('Valid URL "https://example.com":', validateURL("https://example.com"));
  console.log('Valid URL "http://localhost:3000":', validateURL("http://localhost:3000"));
  
  // These would throw errors:
  // validateURL("");
  // validateURL("not-a-url");
  // validateURL("ftp://invalid");
} catch (error) {
  console.error('URL validation error:', error instanceof Error ? error.message : String(error));
} 

// --- Structured Error Handling for Strings ---
console.log('\n=== Structured Error Handling for Strings ===');
const stringErrors: string[] = [];
const stringConfig = {
  identifier: 'username',
  callbackOnError: (error: string) => stringErrors.push(error),
};
const validUsername = isNonEmptyString('john_doe', stringConfig);
const invalidUsername = isNonEmptyString('', stringConfig);
console.log('Valid username result:', validUsername); // true
console.log('Invalid username result:', invalidUsername); // false
console.log('Collected errors:', stringErrors); // [ ... ] 