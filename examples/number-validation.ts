import {
  isNumber,
  isInteger,
  isPositiveNumber,
  isNegativeNumber,
  isNonNegativeNumber,
  isNonPositiveNumber,
  isPositiveInteger,
  isNegativeInteger,
  isNonNegativeInteger,
  isNonPositiveInteger
} from '../src';

console.log('=== Number Type Guards ===');

// Basic number validation
console.log('isNumber(42):', isNumber(42)); // true
console.log('isNumber(3.14):', isNumber(3.14)); // true
console.log('isNumber("42"):', isNumber("42")); // false
console.log('isNumber(NaN):', isNumber(NaN)); // true (NaN is a number in JavaScript)

// Integer validation
console.log('\n=== Integer Validation ===');
console.log('isInteger(42):', isInteger(42)); // true
console.log('isInteger(3.14):', isInteger(3.14)); // false
console.log('isInteger(-5):', isInteger(-5)); // true
console.log('isInteger(0):', isInteger(0)); // true

// Positive number validation
console.log('\n=== Positive Number Validation ===');
console.log('isPositiveNumber(42):', isPositiveNumber(42)); // true
console.log('isPositiveNumber(3.14):', isPositiveNumber(3.14)); // true
console.log('isPositiveNumber(0):', isPositiveNumber(0)); // false
console.log('isPositiveNumber(-5):', isPositiveNumber(-5)); // false

// Negative number validation
console.log('\n=== Negative Number Validation ===');
console.log('isNegativeNumber(-42):', isNegativeNumber(-42)); // true
console.log('isNegativeNumber(-3.14):', isNegativeNumber(-3.14)); // true
console.log('isNegativeNumber(0):', isNegativeNumber(0)); // false
console.log('isNegativeNumber(5):', isNegativeNumber(5)); // false

// Non-negative number validation
console.log('\n=== Non-Negative Number Validation ===');
console.log('isNonNegativeNumber(42):', isNonNegativeNumber(42)); // true
console.log('isNonNegativeNumber(0):', isNonNegativeNumber(0)); // true
console.log('isNonNegativeNumber(-5):', isNonNegativeNumber(-5)); // false

// Non-positive number validation
console.log('\n=== Non-Positive Number Validation ===');
console.log('isNonPositiveNumber(-42):', isNonPositiveNumber(-42)); // true
console.log('isNonPositiveNumber(0):', isNonPositiveNumber(0)); // true
console.log('isNonPositiveNumber(5):', isNonPositiveNumber(5)); // false

// Positive integer validation
console.log('\n=== Positive Integer Validation ===');
console.log('isPositiveInteger(42):', isPositiveInteger(42)); // true
console.log('isPositiveInteger(3.14):', isPositiveInteger(3.14)); // false
console.log('isPositiveInteger(0):', isPositiveInteger(0)); // false
console.log('isPositiveInteger(-5):', isPositiveInteger(-5)); // false

// Negative integer validation
console.log('\n=== Negative Integer Validation ===');
console.log('isNegativeInteger(-42):', isNegativeInteger(-42)); // true
console.log('isNegativeInteger(-3.14):', isNegativeInteger(-3.14)); // false
console.log('isNegativeInteger(0):', isNegativeInteger(0)); // false
console.log('isNegativeInteger(5):', isNegativeInteger(5)); // false

// Non-negative integer validation
console.log('\n=== Non-Negative Integer Validation ===');
console.log('isNonNegativeInteger(42):', isNonNegativeInteger(42)); // true
console.log('isNonNegativeInteger(0):', isNonNegativeInteger(0)); // true
console.log('isNonNegativeInteger(3.14):', isNonNegativeInteger(3.14)); // false
console.log('isNonNegativeInteger(-5):', isNonNegativeInteger(-5)); // false

// Non-positive integer validation
console.log('\n=== Non-Positive Integer Validation ===');
console.log('isNonPositiveInteger(-42):', isNonPositiveInteger(-42)); // true
console.log('isNonPositiveInteger(0):', isNonPositiveInteger(0)); // true
console.log('isNonPositiveInteger(-3.14):', isNonPositiveInteger(-3.14)); // false
console.log('isNonPositiveInteger(5):', isNonPositiveInteger(5)); // false

// Practical example: Age validation
function validateAge(age: unknown): number {
  if (!isNonNegativeInteger(age)) {
    throw new Error('Age must be a non-negative integer');
  }
  
  if (age > 150) {
    throw new Error('Age seems unrealistic');
  }
  
  return age;
}

console.log('\n=== Age Validation Example ===');
try {
  console.log('Valid age 25:', validateAge(25));
  console.log('Valid age 0:', validateAge(0));
  // These would throw errors:
  // validateAge(-5);
  // validateAge(3.14);
  // validateAge("25");
} catch (error) {
  console.error('Age validation error:', error instanceof Error ? error.message : String(error));
}

// Practical example: Coordinate validation
function validateCoordinate(x: unknown, y: unknown): [number, number] {
  if (!isNumber(x) || !isNumber(y)) {
    throw new Error('Coordinates must be numbers');
  }
  
  if (!isFinite(x) || !isFinite(y)) {
    throw new Error('Coordinates must be finite numbers');
  }
  
  return [x, y];
}

console.log('\n=== Coordinate Validation Example ===');
try {
  console.log('Valid coordinates:', validateCoordinate(10.5, -20.3));
  // This would throw an error:
  // validateCoordinate("10", "20");
} catch (error) {
  console.error('Coordinate validation error:', error instanceof Error ? error.message : String(error));
} 

// --- Structured Error Handling for Numbers ---
console.log('\n=== Structured Error Handling for Numbers ===');
const numberErrors: string[] = [];
const numberConfig = {
  identifier: 'age',
  callbackOnError: (error: string) => numberErrors.push(error),
};
const validAge = isNonNegativeInteger(25, numberConfig);
const invalidAge = isNonNegativeInteger(-5, numberConfig);
console.log('Valid age result:', validAge); // true
console.log('Invalid age result:', invalidAge); // false
console.log('Collected errors:', numberErrors); // [ ... ] 