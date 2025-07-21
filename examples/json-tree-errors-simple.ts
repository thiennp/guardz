#!/usr/bin/env ts-node

/**
 * Simple example demonstrating the new JSON tree error format in Guardz
 * 
 * The isType function (and its aliases isObject and isObjectWith) now support
 * a JSON tree error format that provides a structured view of validation errors.
 */

import { isType } from '../src/typeguards/isType';
import { isString } from '../src/typeguards/isString';
import { isNumber } from '../src/typeguards/isNumber';
import { isBoolean } from '../src/typeguards/isBoolean';

console.log('🛡️  Guardz JSON Tree Error Format Example\n');

// Define a user interface
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

// Create type guard
const isUser = isType<User>({
  id: isNumber,
  name: isString,
  email: isString,
  isActive: isBoolean,
});

// Test data with multiple validation errors
const invalidUser = {
  id: '1', // should be number
  name: 123, // should be string
  email: true, // should be string
  isActive: 'yes', // should be boolean
};

// Test data with mixed valid/invalid properties
const mixedUser = {
  id: 1, // valid
  name: 'John Doe', // valid
  email: true, // invalid - should be string
  isActive: 'yes', // invalid - should be boolean
};

console.log('📝 Example 1: String format (default)');
const stringErrors: string[] = [];
const stringConfig = {
  callbackOnError: (error: string) => stringErrors.push(error),
  identifier: 'user',
  // No errorMode specified - defaults to 'single' (string format)
};

const stringResult = isUser(invalidUser, stringConfig);
console.log(`❌ Validation result: ${stringResult}`);
console.log(`📊 Errors collected: ${stringErrors.length}`);
console.log('🔍 Error messages:');
stringErrors.forEach((error, index) => {
  console.log(`  ${index + 1}. ${error}`);
});

console.log('\n📝 Example 2: JSON tree format (all invalid)');
const jsonErrors: string[] = [];
const jsonConfig = {
  callbackOnError: (error: string) => jsonErrors.push(error),
  identifier: 'user',
  errorMode: 'json' as const,
};

const jsonResult = isUser(invalidUser, jsonConfig);
console.log(`❌ Validation result: ${jsonResult}`);
console.log(`📊 Errors collected: ${jsonErrors.length}`);

if (jsonErrors.length > 0) {
  console.log('🌳 JSON Tree Structure:');
  const lastError = jsonErrors[jsonErrors.length - 1];
  if (lastError) {
    const errorTree = JSON.parse(lastError);
    console.log(JSON.stringify(errorTree, null, 2));
  }
}

console.log('\n📝 Example 3: JSON tree format (mixed valid/invalid)');
const mixedErrors: string[] = [];
const mixedConfig = {
  callbackOnError: (error: string) => mixedErrors.push(error),
  identifier: 'user',
  errorMode: 'json' as const,
};

const mixedResult = isUser(mixedUser, mixedConfig);
console.log(`❌ Validation result: ${mixedResult}`);
console.log(`📊 Errors collected: ${mixedErrors.length}`);

if (mixedErrors.length > 0) {
  console.log('🌳 JSON Tree Structure (Mixed):');
  const lastError = mixedErrors[mixedErrors.length - 1];
  if (lastError) {
    const errorTree = JSON.parse(lastError);
    console.log(JSON.stringify(errorTree, null, 2));
  }
}

console.log('\n📝 Example 4: Analyzing the JSON tree');
if (jsonErrors.length > 0) {
  const lastError = jsonErrors[jsonErrors.length - 1];
  if (lastError) {
    const errorTree = JSON.parse(lastError);
    const userValidation = errorTree.user;
    
    console.log('✅ Valid properties:');
    const validProps = Object.entries(userValidation.value)
      .filter(([_, prop]: [string, any]) => prop.valid)
      .map(([key, _]) => key);
    
    if (validProps.length > 0) {
      validProps.forEach(prop => console.log(`  - ${prop}`));
    } else {
      console.log('  (none)');
    }
    
    console.log('\n❌ Invalid properties:');
    const invalidProps = Object.entries(userValidation.value)
      .filter(([_, prop]: [string, any]) => !prop.valid)
      .map(([key, prop]: [string, any]) => `${key}: ${JSON.stringify(prop.value)} (expected ${prop.expectedType})`);
    
    invalidProps.forEach(prop => console.log(`  - ${prop}`));
    
    console.log('\n🔧 Error details:');
    invalidProps.forEach((prop, index) => {
      console.log(`  ${index + 1}. user.${prop}`);
    });
  }
}

console.log('\n📝 Example 5: Comparison');
console.log('String format: Simple, one error per line');
console.log('JSON tree format: Structured, shows valid/invalid branches');
console.log('\nThe JSON tree format makes it easier to:');
console.log('- See the overall structure of validation errors');
console.log('- Identify which properties are valid vs invalid');
console.log('- Understand the expected vs actual types');
console.log('- Process errors programmatically');
console.log('\nThis improvement makes debugging much more intuitive! 🎉'); 