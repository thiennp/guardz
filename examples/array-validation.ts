import {
  isArrayWithEachItem,
  isNonEmptyArray,
  isNonEmptyArrayWithEachItem,
  isTuple,
  isString,
  isNumber,
  isBoolean,
  isNonNullObject,
  isObjectWithEachItem,
  isType
} from '../src';

console.log('=== Array Type Guards ===');

// Basic array validation
const stringArray = ["hello", "world", "typescript"];
const numberArray = [1, 2, 3, 4, 5];
const mixedArray = ["hello", 42, true];
const emptyArray: string[] = [];

// Check if array has specific item types
const isStringArray = isArrayWithEachItem(isString);
const isNumberArray = isArrayWithEachItem(isNumber);

console.log('isStringArray(stringArray):', isStringArray(stringArray)); // true
console.log('isNumberArray(numberArray):', isNumberArray(numberArray)); // true
console.log('isStringArray(mixedArray):', isStringArray(mixedArray)); // false

// Check for non-empty arrays
console.log('isNonEmptyArray(stringArray):', isNonEmptyArray(stringArray)); // true
console.log('isNonEmptyArray(emptyArray):', isNonEmptyArray(emptyArray)); // false

// Check for non-empty arrays with specific item types
const isNonEmptyStringArray = isNonEmptyArrayWithEachItem(isString);

console.log('isNonEmptyStringArray(stringArray):', isNonEmptyStringArray(stringArray)); // true
console.log('isNonEmptyStringArray(emptyArray):', isNonEmptyStringArray(emptyArray)); // false

// Tuple validation
console.log('\n=== Tuple Validation ===');

// Valid tuples
const validTuple1: [string, number] = ["hello", 42];
const validTuple2: [string, number, boolean] = ["hello", 42, true];

// Invalid tuples
const invalidTuple1 = ["hello", "world"]; // Both strings, not [string, number]
const invalidTuple2 = [42, "hello"]; // Wrong order

const isCoordinateTuple = isTuple(isString, isNumber);
const isUserTuple = isTuple(isString, isNumber, isBoolean);

console.log('isCoordinateTuple(validTuple1):', isCoordinateTuple(validTuple1)); // true
console.log('isUserTuple(validTuple2):', isUserTuple(validTuple2)); // true
console.log('isCoordinateTuple(invalidTuple1):', isCoordinateTuple(invalidTuple1)); // false
console.log('isCoordinateTuple(invalidTuple2):', isCoordinateTuple(invalidTuple2)); // false

// Practical example: API response validation
interface User {
  id: number;
  name: string;
  email: string;
}

function validateUserArray(data: unknown): User[] {
  const isObjectArray = isArrayWithEachItem(isNonNullObject);
  
  if (!isObjectArray(data)) {
    throw new Error('Data must be an array of objects');
  }
  
  if (!isNonEmptyArray(data)) {
    throw new Error('Data array cannot be empty');
  }
  
  // For this example, we'll just validate that it's an array of objects
  // In a real scenario, you'd want more specific validation
  return data as unknown as User[];
}

console.log('\n=== API Response Validation ===');

const validUsers = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" }
];

const invalidUsers = [
  { id: "1", name: "John Doe", email: "john@example.com" }, // id should be number
  { id: 2, name: "Jane Smith" } // missing email
];

try {
  const validatedUsers = validateUserArray(validUsers);
  console.log('Valid users:', validatedUsers);
} catch (error) {
  console.error('Validation error:', error instanceof Error ? error.message : String(error));
}

try {
  validateUserArray(invalidUsers);
} catch (error) {
  console.error('Validation error:', error instanceof Error ? error.message : String(error));
} 

// --- Structured Error Handling for Arrays ---
console.log('\n=== Structured Error Handling for Arrays ===');
const arrayErrors: string[] = [];
const arrayConfig = {
  identifier: 'users',
  callbackOnError: (error: string) => arrayErrors.push(error),
};
const isUser = isType({ id: isNumber, name: isString });
const isUserArray = isArrayWithEachItem(isUser);
const invalidUsersArray = [
  { id: 1, name: 'Alice' },
  { id: '2', name: 123 },
  { id: 3, name: 'Charlie' }
];
const valid = isUserArray(invalidUsersArray, arrayConfig);
console.log('Validation result:', valid); // false
console.log('Collected errors:', arrayErrors); // [ ... ] 