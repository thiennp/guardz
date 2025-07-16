import {
  isNullOr,
  isUndefinedOr,
  isNilOr,
  isEnum,
  isEqualTo,
  isOneOf,
  isString,
  isNumber,
  isBoolean,
  isType
} from '../src';

console.log('=== Nullable and Special Type Guards ===');

// Nullable type guards
console.log('\n=== Nullable Type Guards ===');

const isStringOrNull = isNullOr(isString);
const isNumberOrUndefined = isUndefinedOr(isNumber);
const isBooleanOrNil = isNilOr(isBoolean);

console.log('isStringOrNull("hello"):', isStringOrNull("hello")); // true
console.log('isStringOrNull(null):', isStringOrNull(null)); // true
console.log('isStringOrNull(undefined):', isStringOrNull(undefined)); // false

console.log('isNumberOrUndefined(42):', isNumberOrUndefined(42)); // true
console.log('isNumberOrUndefined(undefined):', isNumberOrUndefined(undefined)); // true
console.log('isNumberOrUndefined(null):', isNumberOrUndefined(null)); // false

console.log('isBooleanOrNil(true):', isBooleanOrNil(true)); // true
console.log('isBooleanOrNil(null):', isBooleanOrNil(null)); // true
console.log('isBooleanOrNil(undefined):', isBooleanOrNil(undefined)); // true
console.log('isBooleanOrNil("hello"):', isBooleanOrNil("hello")); // false

// Enum type guards
console.log('\n=== Enum Type Guards ===');

enum UserRole {
  ADMIN = "admin",
  USER = "user",
  MODERATOR = "moderator"
}

enum Status {
  ACTIVE = 1,
  INACTIVE = 0,
  PENDING = 2
}

const isUserRole = isEnum(UserRole);
const isStatus = isEnum(Status);

console.log('isUserRole("admin"):', isUserRole("admin")); // true
console.log('isUserRole("user"):', isUserRole("user")); // true
console.log('isUserRole("guest"):', isUserRole("guest")); // false
console.log('isUserRole(1):', isUserRole(1)); // false

console.log('isStatus(1):', isStatus(1)); // true
console.log('isStatus(0):', isStatus(0)); // true
console.log('isStatus(2):', isStatus(2)); // true
console.log('isStatus(3):', isStatus(3)); // false
console.log('isStatus("active"):', isStatus("active")); // false

// Equality type guards
console.log('\n=== Equality Type Guards ===');

const isActive = isEqualTo(true);
const isAdmin = isEqualTo("admin");
const isZero = isEqualTo(0);

console.log('isActive(true):', isActive(true)); // true
console.log('isActive(false):', isActive(false)); // false
console.log('isActive(1):', isActive(1)); // false

console.log('isAdmin("admin"):', isAdmin("admin")); // true
console.log('isAdmin("user"):', isAdmin("user")); // false
console.log('isAdmin(1):', isAdmin(1)); // false

console.log('isZero(0):', isZero(0)); // true
console.log('isZero(1):', isZero(1)); // false
console.log('isZero("0"):', isZero("0")); // false

// Practical example: User validation with nullable fields
console.log('\n=== User Validation with Nullable Fields ===');

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null; // optional and nullable
  avatar?: string | undefined; // optional and undefined
  isActive: boolean | null | undefined; // nullable boolean
}

function validateUser(user: unknown): User {
  // Use isType to validate the entire user object
  const isUser = isType({
    id: isNumber,
    name: isString,
    email: isString,
    phone: isNullOr(isString),
    avatar: isUndefinedOr(isString),
    isActive: isNilOr(isBoolean)
  });
  
  if (!isUser(user)) {
    throw new Error('Invalid user object structure');
  }
  
  return user;
}

// Practical example: API response with nullable data
console.log('\n=== API Response with Nullable Data ===');

interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error?: string | undefined;
}

function validateApiResponse<T>(response: unknown, dataValidator: (data: unknown) => data is T): ApiResponse<T> {
  const isApiResponse = isType({
    success: isBoolean,
    data: isNullOr(dataValidator),
    error: isUndefinedOr(isString)
  });
  
  if (!isApiResponse(response)) {
    throw new Error('Invalid API response structure');
  }
  
  return response;
}

// Practical example: Configuration with enum values
console.log('\n=== Configuration with Enum Values ===');

interface AppConfig {
  environment: "development" | "staging" | "production";
  logLevel: "debug" | "info" | "warn" | "error";
  maxRetries: number | null;
}

function validateAppConfig(config: unknown): AppConfig {
  const isAppConfig = isType({
    environment: isOneOf("development", "staging", "production"),
    logLevel: isOneOf("debug", "info", "warn", "error"),
    maxRetries: isNullOr(isNumber)
  });
  
  if (!isAppConfig(config)) {
    throw new Error('Invalid app configuration structure');
  }
  
  return config as AppConfig;
}

// Example usage
const validConfig: AppConfig = {
  environment: "development",
  logLevel: "debug",
  maxRetries: 3
};

const configWithNull: AppConfig = {
  environment: "production",
  logLevel: "error",
  maxRetries: null
};

try {
  console.log('Valid config:', validateAppConfig(validConfig));
  console.log('Config with null:', validateAppConfig(configWithNull));
} catch (error) {
  console.error('Config validation error:', error instanceof Error ? error.message : String(error));
} 

// --- Structured Error Handling for Nullable/Special Types ---
console.log('\n=== Structured Error Handling for Nullable/Special Types ===');
const nullableErrors: string[] = [];
const nullableConfig = {
  identifier: 'optionalValue',
  callbackOnError: (error: string) => nullableErrors.push(error),
};
const validNullable = isNullOr(isString)('hello', nullableConfig);
const invalidNullable = isNullOr(isString)(123, nullableConfig);
console.log('Valid nullable result:', validNullable); // true
console.log('Invalid nullable result:', invalidNullable); // false
console.log('Collected errors:', nullableErrors); // [ ... ] 