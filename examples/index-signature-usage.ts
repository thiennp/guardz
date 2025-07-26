import { 
  isIndexSignature, 
  isIntersectionOf, 
  isType, 
  isString, 
  isNumber, 
  isBoolean, 
  isOneOfTypes,
  isArrayWithEachItem,
  isNumeric,
  isBooleanLike,
  isDateLike
} from '../src';

// Example 1: Basic Index Signature Usage
console.log('=== Basic Index Signature Examples ===');

// String-keyed object with number values
const isStringNumberMap = isIndexSignature(isString, isNumber);

const userAges = { alice: 25, bob: 30, charlie: 35 };
const featureFlags = { darkMode: true, notifications: false };

console.log(isStringNumberMap(userAges)); // true
console.log(isStringNumberMap(featureFlags)); // false (boolean values)

// Number-keyed object with boolean values
// Using the isNumeric utility from guardz
const isNumberBooleanMap = isIndexSignature(isNumeric, isBoolean);

const numericFlags = { 1: true, 2: false, 3: true };
const stringFlags = { "1": true, "2": false, "abc": true };

console.log(isNumberBooleanMap(numericFlags)); // true
console.log(isNumberBooleanMap(stringFlags)); // false (contains "abc")

// Example 2: Boolean-like Values
console.log('\n=== Boolean-like Examples ===');

const isStringBooleanLikeMap = isIndexSignature(isString, isBooleanLike);

const formData = {
  newsletter: "true",
  notifications: "1", 
  marketing: "false",
  terms: "0"
};

console.log(isStringBooleanLikeMap(formData)); // true

// Example 3: Date-like Values
console.log('\n=== Date-like Examples ===');

const isStringDateLikeMap = isIndexSignature(isString, isDateLike);

const eventData = {
  startDate: "2023-01-01",
  endDate: "2023-12-31T23:59:59Z",
  created: "2023-01-01T00:00:00.000Z"
};

console.log(isStringDateLikeMap(eventData)); // true

// Example 4: Complex Value Types
console.log('\n=== Complex Value Types ===');

// Use existing isArrayWithEachItem utility instead of custom guard
const isStringArrayMap = isIndexSignature(isString, isArrayWithEachItem(isString));

const categories = {
  fruits: ["apple", "banana", "orange"],
  colors: ["red", "blue", "green"],
  numbers: ["one", "two", "three"]
};

console.log(isStringArrayMap(categories)); // true

// Example 5: Union Value Types
console.log('\n=== Union Value Types ===');

// For union types, we need to use a custom guard since isOneOfTypes expects same return type
const isStringNumberBoolean = (value: unknown): value is string | number | boolean => {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
};

const isStringUnionMap = isIndexSignature(isString, isStringNumberBoolean);

const mixedData = {
  name: "John",
  age: 30,
  active: true,
  email: "john@example.com"
};

console.log(isStringUnionMap(mixedData)); // true

// Example 6: Combining Index Signatures with Specific Properties
console.log('\n=== Index Signature + Specific Properties ===');

// Define the index signature part
const isStringIndex = isIndexSignature(isString, isStringNumberBoolean);

// Define the specific properties
const isConfigProperties = isType({
  name: isString,
  version: isString,
  debug: isBoolean
});

// Combine them using intersection
const isConfig = isIntersectionOf(isStringIndex, isConfigProperties);

const config = {
  name: "myApp",
  version: "1.0.0",
  debug: true,
  apiUrl: "https://api.example.com",
  timeout: 5000
};

console.log(isConfig(config)); // true

// Type narrowing example
if (isConfig(config)) {
  // TypeScript knows config has both specific properties AND index signature
  console.log(`App: ${config.name} v${config.version}`); // Specific properties
  console.log(`API URL: ${config.apiUrl}`); // Index signature property
  console.log(`Timeout: ${config.timeout}`); // Index signature property
}

// Example 7: API Response with Metadata
console.log('\n=== API Response Example ===');

const isApiResponse = isIntersectionOf(
  isIndexSignature(isString, isStringNumberBoolean),
  isType({
    status: isString,
    timestamp: isString,
    data: isIndexSignature(isString, isNumber)
  })
);

const apiResponse = {
  status: "success",
  timestamp: "2023-01-01T00:00:00Z",
  data: { user1: 25, user2: 30 },
  message: "Data retrieved successfully",
  count: 2,
  tags: ["api", "users"]
};

console.log(isApiResponse(apiResponse)); // true

if (isApiResponse(apiResponse)) {
  console.log(`Status: ${apiResponse.status}`);
  console.log(`User count: ${apiResponse.count}`);
  console.log(`Tags: ${apiResponse.tags.join(', ')}`);
}

// Example 8: Error Handling
console.log('\n=== Error Handling ===');

const errors: string[] = [];
const config2 = {
  identifier: 'testData',
  callbackOnError: (error: string) => errors.push(error)
};

const invalidData = { a: 1, b: "2", c: 3 };

if (!isStringNumberMap(invalidData, config2)) {
  console.log('Validation failed:', errors);
}

console.log('\n=== All Examples Completed ==='); 