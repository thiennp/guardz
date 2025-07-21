#!/usr/bin/env ts-node

/**
 * Simple example demonstrating the improved error handling in Guardz
 * 
 * The isType function (and its aliases isObject and isObjectWith) now collect
 * all validation errors instead of stopping at the first failure.
 */

import { isObject } from '../src/typeguards/isObject';
import { isString } from '../src/typeguards/isString';
import { isNumber } from '../src/typeguards/isNumber';
import { isBoolean } from '../src/typeguards/isBoolean';

console.log('🛡️  Guardz Multiple Error Collection Example\n');

// Define a user interface
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

// Create a type guard for User
const isUser = isObject<User>({
  id: isNumber,
  name: isString,
  email: isString,
  isActive: isBoolean,
});

// Example 1: Valid user - no errors
console.log('📝 Example 1: Valid user');
const validUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  isActive: true,
};

const errors1: string[] = [];
const config1 = {
  identifier: 'user',
  callbackOnError: (error: string) => errors1.push(error),
};

const isValid = isUser(validUser, config1);
console.log(`✅ Validation result: ${isValid}`);
console.log(`📊 Errors collected: ${errors1.length}\n`);

// Example 2: Invalid user with multiple errors
console.log('📝 Example 2: Invalid user with multiple errors');
const invalidUser = {
  id: '1', // should be number
  name: 123, // should be string
  email: true, // should be string
  isActive: 'yes', // should be boolean
};

const errors2: string[] = [];
const config2 = {
  identifier: 'user',
  callbackOnError: (error: string) => errors2.push(error),
};

const isValid2 = isUser(invalidUser, config2);
console.log(`❌ Validation result: ${isValid2}`);
console.log(`📊 Errors collected: ${errors2.length}`);
console.log('🔍 All validation errors:');
errors2.forEach((error, index) => {
  console.log(`  ${index + 1}. ${error}`);
});
console.log();

// Example 3: Nested object with multiple errors
console.log('📝 Example 3: Nested object with multiple errors');
interface Profile {
  age: number;
  bio: string;
  verified: boolean;
}

interface UserWithProfile {
  id: number;
  profile: Profile;
  settings: {
    notifications: boolean;
    theme: string;
  };
}

const isProfile = isObject<Profile>({
  age: isNumber,
  bio: isString,
  verified: isBoolean,
});

const isUserWithProfile = isObject<UserWithProfile>({
  id: isNumber,
  profile: isProfile,
  settings: isObject({
    notifications: isBoolean,
    theme: isString,
  }),
});

const invalidUserWithProfile = {
  id: '1', // should be number
  profile: {
    age: '25', // should be number
    bio: 456, // should be string
    verified: 'true', // should be boolean
  },
  settings: {
    notifications: 'yes', // should be boolean
    theme: 789, // should be string
  },
};

const errors3: string[] = [];
const config3 = {
  identifier: 'user',
  callbackOnError: (error: string) => errors3.push(error),
};

const isValid3 = isUserWithProfile(invalidUserWithProfile, config3);
console.log(`❌ Validation result: ${isValid3}`);
console.log(`📊 Errors collected: ${errors3.length}`);
console.log('🔍 All validation errors:');
errors3.forEach((error, index) => {
  console.log(`  ${index + 1}. ${error}`);
});
console.log();

// Example 4: Comparison with old behavior (simulated)
console.log('📝 Example 4: Comparison with old behavior');
console.log('Before: Only first error would be reported');
console.log('After: All errors are collected and reported');
console.log('\nThis improvement makes debugging much easier! 🎉'); 