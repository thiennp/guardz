import { isType } from '../src/typeguards/isType';
import { isString } from '../src/typeguards/isString';
import { isNumber } from '../src/typeguards/isNumber';
import { isBoolean } from '../src/typeguards/isBoolean';

console.log('🛡️  Guardz Error Modes Demo\n');

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

console.log('📝 Example 1: Single Error Mode (Default)');
console.log('Stops at first failure for performance');
const singleErrors: string[] = [];
const singleConfig = {
  callbackOnError: (error: string) => singleErrors.push(error),
  identifier: 'user',
  // No errorMode specified - defaults to 'single'
};

const singleResult = isUser(invalidUser, singleConfig);
console.log(`❌ Validation result: ${singleResult}`);
console.log(`📊 Errors collected: ${singleErrors.length}`);
console.log('🔍 Error messages:');
singleErrors.forEach((error, index) => {
  console.log(`  ${index + 1}. ${error}`);
});

console.log('\n📝 Example 2: Multi Error Mode');
console.log('Collects all errors as strings');
const multiErrors: string[] = [];
const multiConfig = {
  callbackOnError: (error: string) => multiErrors.push(error),
  identifier: 'user',
  errorMode: 'multi' as const,
};

const multiResult = isUser(invalidUser, multiConfig);
console.log(`❌ Validation result: ${multiResult}`);
console.log(`📊 Errors collected: ${multiErrors.length}`);
console.log('🔍 Error messages:');
multiErrors.forEach((error, index) => {
  console.log(`  ${index + 1}. ${error}`);
});

console.log('\n📝 Example 3: JSON Error Mode');
console.log('Outputs structured JSON tree');
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

console.log('\n📝 Example 4: Performance Comparison');
console.log('Single mode: Fastest - stops at first error');
console.log('Multi mode: Medium - collects all errors as strings');
console.log('JSON mode: Most detailed - provides structured tree');
console.log('\nUse single mode for production, multi/json for debugging! 🎉'); 