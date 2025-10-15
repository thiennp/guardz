import {
  isString,
  isNumber,
  isBoolean,
  isDate,
  isDefined,
  isNil,
  isAny,
  isUnknown,
  isBigInt,
  isType,
} from '../src';

// Basic primitive type guards
console.log('=== Basic Primitive Type Guards ===');

// String validation
console.log('isString("hello"):', isString('hello')); // true
console.log('isString(123):', isString(123)); // false
console.log('isString(null):', isString(null)); // false

// Number validation
console.log('isNumber(42):', isNumber(42)); // true
console.log('isNumber("42"):', isNumber('42')); // false
console.log('isNumber(NaN):', isNumber(NaN)); // true (NaN is a number in JavaScript)

// Boolean validation
console.log('isBoolean(true):', isBoolean(true)); // true
console.log('isBoolean(false):', isBoolean(false)); // true
console.log('isBoolean(1):', isBoolean(1)); // false

// Date validation
console.log('isDate(new Date()):', isDate(new Date())); // true
console.log('isDate("2023-01-01"):', isDate('2023-01-01')); // false

// Null/Undefined validation
console.log('isNil(null):', isNil(null)); // true
console.log('isNil(undefined):', isNil(undefined)); // true
console.log('isNil(0):', isNil(0)); // false

// Defined validation
console.log('isDefined("hello"):', isDefined('hello')); // true
console.log('isDefined(0):', isDefined(0)); // true
console.log('isDefined(null):', isDefined(null)); // false

// Any and Unknown validation
console.log('isAny("anything"):', isAny('anything')); // true
console.log('isUnknown("anything"):', isUnknown('anything')); // true

// BigInt validation
console.log('isBigInt(BigInt(42)):', isBigInt(BigInt(42))); // true
console.log('isBigInt(42):', isBigInt(42)); // false

// Practical example: Function parameter validation
function processUserInput(input: unknown): string {
  if (isString(input)) {
    return `Processed string: ${input.toUpperCase()}`;
  }

  if (isNumber(input)) {
    return `Processed number: ${input * 2}`;
  }

  if (isBoolean(input)) {
    return `Processed boolean: ${input ? 'YES' : 'NO'}`;
  }

  throw new Error('Invalid input type');
}

console.log('\n=== Function Parameter Validation ===');
console.log(processUserInput('hello world')); // "Processed string: HELLO WORLD"
console.log(processUserInput(21)); // "Processed number: 42"
console.log(processUserInput(true)); // "Processed boolean: YES"

// This would throw an error:
// processUserInput(null);

// --- Structured Error Handling Example ---
console.log('\n=== Structured Error Handling Example ===');
const errors: string[] = [];
const config = {
  identifier: 'input',
  callbackOnError: (error: string) => errors.push(error),
};

const isUser = isType({ name: isString, age: isNumber });
const invalidUser = { name: 123, age: 'thirty' };
const result = isUser(invalidUser, config);
console.log('Validation result:', result); // false
console.log('Collected errors:', errors); // [ 'Expected input.name (123) to be "string"', 'Expected input.age ("thirty") to be "number"' ]

type a = Pick<User, 'name' | 'age'>