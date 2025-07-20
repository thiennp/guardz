import {
  isOneOf,
  isOneOfTypes,
  isIntersectionOf,
  isExtensionOf,
  isString,
  isNumber,
  isBoolean,
  isDate,
  isType,
} from '../src';

console.log('=== Union and Composite Type Guards ===');

// Union type guards with isOneOf (literal values)
console.log('\n=== Union Type Guards (isOneOf - Literal Values) ===');

const isColor = isOneOf('red', 'green', 'blue');
const isStatus = isOneOf(200, 404, 500);
const isBooleanOrNull = isOneOf(true, false, null);

console.log('isColor("red"):', isColor('red')); // true
console.log('isColor("yellow"):', isColor('yellow')); // false
console.log('isStatus(404):', isStatus(404)); // true
console.log('isStatus(201):', isStatus(201)); // false
console.log('isBooleanOrNull(true):', isBooleanOrNull(true)); // true
console.log('isBooleanOrNull(undefined):', isBooleanOrNull(undefined)); // false

// Union type guards with isOneOfTypes (type guard functions)
console.log('\n=== Union Type Guards (isOneOfTypes - Type Guards) ===');

// Note: For union types with different type guards, we need to use a different approach
// as TypeScript doesn't allow mixing different return types in isOneOfTypes
const isStringOrNumberUnion = (value: unknown): value is string | number =>
  isString(value) || isNumber(value);

const isPrimitive = (value: unknown): value is string | number | boolean =>
  isString(value) || isNumber(value) || isBoolean(value);

console.log('isStringOrNumberUnion("hello"):', isStringOrNumberUnion('hello')); // true
console.log('isStringOrNumberUnion(42):', isStringOrNumberUnion(42)); // true
console.log('isStringOrNumberUnion(true):', isStringOrNumberUnion(true)); // false

console.log('isPrimitive("hello"):', isPrimitive('hello')); // true
console.log('isPrimitive(42):', isPrimitive(42)); // true
console.log('isPrimitive(true):', isPrimitive(true)); // true
console.log('isPrimitive(new Date()):', isPrimitive(new Date())); // false

// Intersection type guards
console.log('\n=== Intersection Type Guards ===');

// Define base types
const isNamed = isType({ name: isString });
const isAged = isType({ age: isNumber });
const isActive = isType({ isActive: isBoolean });

// Create intersection type guard
const isNamedAndAged = isIntersectionOf(isNamed, isAged);
const isCompleteUser = isIntersectionOf(isNamed, isAged, isActive);

console.log(
  'isNamedAndAged({ name: "John", age: 30 }):',
  isNamedAndAged({ name: 'John', age: 30 })
); // true

console.log(
  'isNamedAndAged({ name: "John" }):',
  isNamedAndAged({ name: 'John' })
); // false (missing age)

console.log('isNamedAndAged({ age: 30 }):', isNamedAndAged({ age: 30 })); // false (missing name)

console.log(
  'isCompleteUser({ name: "John", age: 30, isActive: true }):',
  isCompleteUser({ name: 'John', age: 30, isActive: true })
); // true

console.log(
  'isCompleteUser({ name: "John", age: 30 }):',
  isCompleteUser({ name: 'John', age: 30 })
); // false (missing isActive)

// Extension type guards
console.log('\n=== Extension Type Guards ===');

// Define base type
const isPerson = isType({ name: isString, age: isNumber });

// Define extended type
const isEmployee = isType({
  name: isString,
  age: isNumber,
  employeeId: isString,
  department: isString,
});

// Create extension type guard
const isEmployeeExtension = isExtensionOf(isPerson, isEmployee);

console.log(
  'isEmployeeExtension({ name: "John", age: 30, employeeId: "E123", department: "IT" }):',
  isEmployeeExtension({
    name: 'John',
    age: 30,
    employeeId: 'E123',
    department: 'IT',
  })
); // true

console.log(
  'isEmployeeExtension({ name: "John", age: 30 }):',
  isEmployeeExtension({ name: 'John', age: 30 })
); // false (missing employee properties)

console.log(
  'isEmployeeExtension({ employeeId: "E123", department: "IT" }):',
  isEmployeeExtension({ employeeId: 'E123', department: 'IT' })
); // false (missing person properties)

// Practical example: API response validation
console.log('\n=== API Response Validation Example ===');

interface BaseResponse {
  success: boolean;
  message: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
}

interface UserResponse extends BaseResponse {
  data: UserData;
}

// Create type guards
const isBaseResponse = isType({ success: isBoolean, message: isString });
const isUserData = isType({ id: isNumber, name: isString, email: isString });
const isUserResponse = isType({
  success: isBoolean,
  message: isString,
  data: isUserData,
});

// Validate API responses
function validateUserResponse(response: unknown): UserResponse {
  if (!isUserResponse(response)) {
    throw new Error('Invalid user response format');
  }

  return response;
}

const validResponse: UserResponse = {
  success: true,
  message: 'User retrieved successfully',
  data: {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
  },
};

const invalidResponse = {
  success: true,
  message: 'User retrieved successfully',
  data: {
    id: '1', // should be number
    name: 'John Doe',
    email: 'john@example.com',
  },
};

try {
  const validated = validateUserResponse(validResponse);
  console.log('Valid response:', validated);
} catch (error) {
  console.error(
    'Validation error:',
    error instanceof Error ? error.message : String(error)
  );
}

try {
  validateUserResponse(invalidResponse);
} catch (error) {
  console.error(
    'Validation error:',
    error instanceof Error ? error.message : String(error)
  );
}

// Practical example: Configuration validation
console.log('\n=== Configuration Validation Example ===');

interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
}

interface CacheConfig {
  enabled: boolean;
  ttl: number;
}

interface AppConfig {
  database: DatabaseConfig;
  cache: CacheConfig;
  debug: boolean;
}

// Create type guards
const isDatabaseConfig = isType({
  host: isString,
  port: isNumber,
  username: isString,
  password: isString,
});

const isCacheConfig = isType({
  enabled: isBoolean,
  ttl: isNumber,
});

const isAppConfig = isType({
  database: isDatabaseConfig,
  cache: isCacheConfig,
  debug: isBoolean,
});

function validateAppConfig(config: unknown): AppConfig {
  if (!isAppConfig(config)) {
    throw new Error('Invalid application configuration');
  }

  return config;
}

const validConfig: AppConfig = {
  database: {
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'secret',
  },
  cache: {
    enabled: true,
    ttl: 3600,
  },
  debug: false,
};

try {
  const validated = validateAppConfig(validConfig);
  console.log('Valid config:', validated);
} catch (error) {
  console.error(
    'Config validation error:',
    error instanceof Error ? error.message : String(error)
  );
}

// --- Structured Error Handling for Union/Intersection Types ---
console.log('\n=== Structured Error Handling for Union/Intersection Types ===');
const unionErrors: string[] = [];
const unionConfig = {
  identifier: 'value',
  callbackOnError: (error: string) => unionErrors.push(error),
};
// Use the custom union type guard we defined earlier
const validUnion = isStringOrNumberUnion('hello');
const invalidUnion = isStringOrNumberUnion(true);
console.log('Valid union result:', validUnion); // true
console.log('Invalid union result:', invalidUnion); // false
console.log('Collected errors:', unionErrors); // [ ... ]
