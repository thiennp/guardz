import {
  isGeneric,
  isString,
  isNumber,
  isPositiveInteger,
  isArrayWithEachItem,
  isType,
  isObjectWithEachItem,
  isEnum,
  isOneOfTypes,
  isEqualTo
} from '../src';

console.log('=== Generic Type Guards Examples ===\n');

// 1. Basic Generic Type Guards
console.log('1. Basic Generic Type Guards:');
const isGenericString = isGeneric(isString);
const isGenericNumber = isGeneric(isNumber);

console.log('isGenericString("hello"):', isGenericString("hello")); // true
console.log('isGenericString(123):', isGenericString(123)); // false
console.log('isGenericNumber(42):', isGenericNumber(42)); // true
console.log('isGenericNumber("42"):', isGenericNumber("42")); // false

// 2. Domain-Specific Type Guards
console.log('\n2. Domain-Specific Type Guards:');
const isUserId = isGeneric(isPositiveInteger);
const isEmail = isGeneric(isString);
const isName = isGeneric(isString);
const isAge = isGeneric(isNumber);

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

const isUser = isType<User>({
  id: isUserId,
  name: isName,
  email: isEmail,
  age: isAge,
});

const validUser = { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 };
const invalidUser = { id: -1, name: 123, email: 'invalid-email', age: 'thirty' };

console.log('Valid user:', isUser(validUser)); // true
console.log('Invalid user:', isUser(invalidUser)); // false

// 3. Complex Generic Type Guards
console.log('\n3. Complex Generic Type Guards:');
const isGenericNumberArray = isGeneric(isArrayWithEachItem(isNumber));
const isGenericStringArray = isGeneric(isArrayWithEachItem(isString));

interface DataSet {
  numbers: number[];
  labels: string[];
  metadata: Record<string, string>;
}

const isDataSet = isType<DataSet>({
  numbers: isGenericNumberArray,
  labels: isGenericStringArray,
  metadata: isObjectWithEachItem(isString),
});

const validDataSet = {
  numbers: [1, 2, 3, 4, 5],
  labels: ['A', 'B', 'C', 'D', 'E'],
  metadata: { source: 'api', version: '1.0' }
};

const invalidDataSet = {
  numbers: [1, '2', 3, '4', 5],
  labels: ['A', 123, 'C', 'D', 'E'],
  metadata: { source: 'api', version: 1.0 }
};

console.log('Valid dataset:', isDataSet(validDataSet)); // true
console.log('Invalid dataset:', isDataSet(invalidDataSet)); // false

// 4. Enum with Generic Type Guards
console.log('\n4. Enum with Generic Type Guards:');
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

const isUserRole = isGeneric(isEnum(UserRole));
const isRoleArray = isGeneric(isArrayWithEachItem(isUserRole));

interface UserWithRole extends User {
  role: UserRole;
  permissions: UserRole[];
}

const isUserWithRole = isType<UserWithRole>({
  id: isUserId,
  name: isName,
  email: isEmail,
  age: isAge,
  role: isUserRole,
  permissions: isRoleArray,
});

const validUserWithRole = {
  id: 1,
  name: 'Admin User',
  email: 'admin@example.com',
  age: 35,
  role: UserRole.ADMIN,
  permissions: [UserRole.ADMIN, UserRole.USER]
};

console.log('Valid user with role:', isUserWithRole(validUserWithRole)); // true

// 5. Union Types with Generic Type Guards
console.log('\n5. Union Types with Generic Type Guards:');
const isStringOrNumber = isGeneric(isOneOfTypes<string | number>(isString, isNumber));
const isNullableString = isGeneric(isOneOfTypes<string | null>(isString, isEqualTo(null)));

interface FlexibleData {
  value: string | number;
  description: string | null;
}

const isFlexibleData = isType<FlexibleData>({
  value: isStringOrNumber,
  description: isNullableString,
});

const validFlexibleData = {
  value: 42,
  description: 'A number value'
};

const validFlexibleData2 = {
  value: 'hello',
  description: null
};

console.log('Valid flexible data (number):', isFlexibleData(validFlexibleData)); // true
console.log('Valid flexible data (string):', isFlexibleData(validFlexibleData2)); // true

// 6. Error Handling with Generic Type Guards
console.log('\n6. Error Handling with Generic Type Guards:');
const errors: string[] = [];
const config = {
  identifier: 'user',
  callbackOnError: (error: string) => errors.push(error),
};

const invalidUserForErrors = { 
  id: 'not-a-number', 
  name: 123, 
  email: 'invalid-email', 
  age: 'thirty' 
};

const result = isUser(invalidUserForErrors, config);
console.log('Validation result:', result); // false
console.log('Collected errors:', errors);
// Expected output:
// [
//   'Expected user.id ("not-a-number") to be "PositiveInteger"',
//   'Expected user.name (123) to be "string"',
//   'Expected user.age ("thirty") to be "number"'
// ]

// 7. Reusable Validation Patterns
console.log('\n7. Reusable Validation Patterns:');
// Create reusable patterns for your application
const isApiId = isGeneric(isPositiveInteger);
const isApiEmail = isGeneric(isString);
const isApiName = isGeneric(isString);
const isApiTimestamp = isGeneric(isNumber);

// Use them consistently across different interfaces
interface ApiUser {
  id: number;
  name: string;
  email: string;
  createdAt: number;
}

interface ApiPost {
  id: number;
  title: string;
  authorId: number;
  createdAt: number;
}

const isApiUser = isType<ApiUser>({
  id: isApiId,
  name: isApiName,
  email: isApiEmail,
  createdAt: isApiTimestamp,
});

const isApiPost = isType<ApiPost>({
  id: isApiId,
  title: isApiName,
  authorId: isApiId,
  createdAt: isApiTimestamp,
});

// Both use the same validation patterns
const apiUser = { id: 1, name: 'John', email: 'john@example.com', createdAt: Date.now() };
const apiPost = { id: 1, title: 'My Post', authorId: 1, createdAt: Date.now() };

console.log('API User valid:', isApiUser(apiUser)); // true
console.log('API Post valid:', isApiPost(apiPost)); // true

// 8. Performance and Type Safety
console.log('\n8. Performance and Type Safety:');
// Generic type guards maintain full type safety
const data: unknown = "hello world";

if (isGenericString(data)) {
  // TypeScript knows data is string here
  console.log('String length:', data.length); // Safe to use string methods
  console.log('Uppercase:', data.toUpperCase()); // Safe to use string methods
}

if (isGenericNumber(data)) {
  // This block won't execute for string data
  console.log('Number methods:', data.toFixed(2));
}

console.log('\n=== Generic Type Guards Examples Complete ==='); 