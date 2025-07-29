import { isBranded, type Branded } from '../src/typeguards/isBranded';

// Example 1: User ID validation
type UserId = Branded<number, 'UserId'>;

const isUserId = isBranded<UserId>((value) => {
  if (typeof value !== 'number' || value <= 1000 || !Number.isInteger(value)) {
    throw new Error('UserId must be a positive integer greater than 1000');
  }
});

// Example 2: Email validation
type Email = Branded<string, 'Email'>;

const isEmail = isBranded<Email>((value) => {
  if (typeof value !== 'string') {
    throw new Error('Email must be a string');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    throw new Error('Invalid email format');
  }
});

// Example 3: Age validation
type Age = Branded<number, 'Age'>;

const isAge = isBranded<Age>((value) => {
  if (typeof value !== 'number') {
    throw new Error('Age must be a number');
  }
  if (!Number.isInteger(value)) {
    throw new Error('Age must be an integer');
  }
  if (value < 0) {
    throw new Error('Age cannot be negative');
  }
  if (value > 150) {
    throw new Error('Age cannot exceed 150');
  }
});

// Example 4: Password validation
type Password = Branded<string, 'Password'>;

const isPassword = isBranded<Password>((value) => {
  if (typeof value !== 'string') {
    throw new Error('Password must be a string');
  }
  if (value.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(value)) {
    throw new Error('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(value)) {
    throw new Error('Password must contain at least one lowercase letter');
  }
  if (!/\d/.test(value)) {
    throw new Error('Password must contain at least one digit');
  }
});

// Example 5: API Response validation
type ApiResponse<T> = Branded<T, 'ApiResponse'>;

const isValidApiResponse = isBranded<ApiResponse<any>>((value) => {
  if (typeof value !== 'object' || value === null) {
    throw new Error('API response must be an object');
  }
  if (!('status' in value) || typeof value.status !== 'number') {
    throw new Error('API response must have a numeric status');
  }
  if (!('data' in value)) {
    throw new Error('API response must have data property');
  }
});

// Example 6: URL validation
type URL = Branded<string, 'URL'>;

const isURL = isBranded<URL>((value) => {
  if (typeof value !== 'string') {
    throw new Error('URL must be a string');
  }
  try {
    new URL(value);
  } catch {
    throw new Error('Invalid URL format');
  }
});

// Example 7: Non-empty string validation
type NonEmptyString = Branded<string, 'NonEmptyString'>;

const isNonEmptyString = isBranded<NonEmptyString>((value) => {
  if (typeof value !== 'string') {
    throw new Error('Value must be a string');
  }
  if (value.length === 0) {
    throw new Error('String cannot be empty');
  }
});

// Example 8: Positive number validation
type PositiveNumber = Branded<number, 'PositiveNumber'>;

const isPositiveNumber = isBranded<PositiveNumber>((value) => {
  if (typeof value !== 'number') {
    throw new Error('Value must be a number');
  }
  if (value <= 0) {
    throw new Error('Value must be positive');
  }
});

// Usage examples
function validateUserInput(data: {
  userId: unknown;
  email: unknown;
  age: unknown;
}) {
  const errors: string[] = [];

  // Validate user ID
  if (!isUserId(data.userId, {
    callbackOnError: (error) => errors.push(`User ID: ${error}`),
    identifier: 'userId'
  })) {
    return { valid: false, errors };
  }

  // Validate email
  if (!isEmail(data.email, {
    callbackOnError: (error) => errors.push(`Email: ${error}`),
    identifier: 'email'
  })) {
    return { valid: false, errors };
  }

  // Validate age
  if (!isAge(data.age, {
    callbackOnError: (error) => errors.push(`Age: ${error}`),
    identifier: 'age'
  })) {
    return { valid: false, errors };
  }

  return { valid: true, data: data as { userId: UserId; email: Email; age: Age } };
}

// Example usage
const userInput = {
  userId: 123,
  email: 'user@example.com',
  age: 25
};

const result = validateUserInput(userInput);
console.log(result);

// Type-safe usage
const A_RANDOM_NUMBER = 123;
if (isUserId(A_RANDOM_NUMBER)) {
  const userId: UserId = A_RANDOM_NUMBER; // Type is narrowed to UserId
  // const userId: UserId = 123; will cause a type error
  console.log('Valid user ID:', userId);
}

const A_RANDOM_STRING = 'test@example.com';
if (isEmail(A_RANDOM_STRING)) {
  const email: Email = A_RANDOM_STRING; // Type is narrowed to Email
  // const email: Email = 'test@example.com'; will cause a type error
  console.log('Valid email:', email);
}
