/**
 * Example demonstrating the usage of array utilities to solve the parameter mismatch
 * between type guards and array methods.
 * 
 * Problem: Type guards expect (value, config) but array methods pass (value, index, array)
 * Solution: Use forArray, forArrayWithErrors, or forArrayWithDetailedErrors wrappers
 */

import { isString, isNumber, isType } from '../src';
import { by } from '../src';

console.log('=== Array Utilities Example ===\n');

// Define a user type guard
const isUser = isType({
  name: isString,
  age: isNumber,
  email: isString
});

// Sample data with mixed valid/invalid users
const users = [
  { name: 'Alice', age: 25, email: 'alice@example.com' },
  { name: 'Bob', age: '30', email: 'bob@example.com' }, // invalid: age is string
  { name: 'Charlie', age: 35, email: 123 }, // invalid: email is number
  { name: 'Diana', age: 28, email: 'diana@example.com' },
  { name: 123, age: 40, email: 'eve@example.com' }, // invalid: name is number
];

console.log('Original users:', users);

// ❌ This won't work due to parameter mismatch
// const validUsers = users.filter(isUser); // Error: parameter mismatch

// ✅ Solution 1: Use by for simple filtering
console.log('\n--- Solution 1: Simple Filtering ---');
const validUsers = users.filter(by(isUser));
console.log('Valid users:', validUsers);
console.log('Valid count:', validUsers.length);



// ✅ Solution 4: Use with other array methods
console.log('\n--- Solution 4: Other Array Methods ---');

// Find first valid user
const firstValidUser = users.find(by(isUser));
console.log('First valid user:', firstValidUser);

// Find index of first valid user
const firstValidIndex = users.findIndex(by(isUser));
console.log('Index of first valid user:', firstValidIndex);

// Check if any users are valid
const hasValidUsers = users.some(by(isUser));
console.log('Has valid users:', hasValidUsers);

// Check if all users are valid
const allValid = users.every(by(isUser));
console.log('All users valid:', allValid);

// Map with type guard
const userNames = users.map((user) => {
  if (by(isUser)(user)) {
    return `${user.name} (${user.age})`;
  }
  return 'Invalid user';
});
console.log('User names:', userNames);

// ✅ Solution 5: Simple type guards work too
console.log('\n--- Solution 5: Simple Type Guards ---');
const mixedData = ['hello', 123, 'world', 456, 'test'];
const strings = mixedData.filter(by(isString));
console.log('Strings:', strings);

const numbers = mixedData.filter(by(isNumber));
console.log('Numbers:', numbers);

// ✅ Solution 6: Complex validation with error collection
console.log('\n--- Solution 6: Complex Validation ---');
interface ComplexUser {
  id: number;
  name: string;
  age: number;
  tags: string[];
  metadata: {
    created: string;
    updated: string;
  };
}

const isComplexUser = isType<ComplexUser>({
  id: isNumber,
  name: isString,
  age: isNumber,
  tags: (value) => Array.isArray(value) && value.every(by(isString)),
  metadata: isType({
    created: isString,
    updated: isString
  })
});

const complexUsers = [
  {
    id: 1,
    name: 'Alice',
    age: 25,
    tags: ['admin', 'developer'],
    metadata: { created: '2023-01-01', updated: '2023-01-15' }
  },
  {
    id: 2,
    name: 'Bob',
    age: '30', // invalid
    tags: ['user'],
    metadata: { created: '2023-01-02', updated: '2023-01-16' }
  },
  {
    id: 3,
    name: 'Charlie',
    age: 35,
    tags: [123, 'manager'], // invalid: mixed types
    metadata: { created: '2023-01-03', updated: '2023-01-17' }
  }
];

const validComplexUsers = complexUsers.filter(by(isComplexUser));

console.log('Valid complex users:', validComplexUsers.length);

console.log('\n=== Summary ===');
console.log('✅ Array utilities solve the parameter mismatch problem');
console.log('✅ by: Simple filtering for array methods');
console.log('✅ Works with all array methods: filter, find, findIndex, some, every, map');
console.log('✅ Works with both simple and complex type guards');
console.log('✅ Use isArrayWithEachItem for array validation with error collection'); 