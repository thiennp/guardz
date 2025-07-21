#!/usr/bin/env npx ts-node -r tsconfig-paths/register

/**
 * 🛡️ Guardz Comprehensive Error Modes Demo
 * 
 * This example demonstrates all three error reporting modes:
 * - Single Error Mode (default, fastest)
 * - Multi Error Mode (comprehensive)
 * - JSON Error Mode (structured)
 * 
 * Plus functional programming features and performance considerations.
 */

import { isType } from '../src/typeguards/isType';
import { isString } from '../src/typeguards/isString';
import { isNumber } from '../src/typeguards/isNumber';
import { isBoolean } from '../src/typeguards/isBoolean';
import { isArrayWithEachItem } from '../src/typeguards/isArrayWithEachItem';

console.log('🛡️  Guardz Comprehensive Error Modes Demo\n');

// Define a complex user interface
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  tags: string[];
}

// Create type guard for User
const isUser = isType<User>({
  id: isNumber,
  name: isString,
  email: isString,
  age: isNumber,
  isActive: isBoolean,
  preferences: isType({
    theme: (value): value is 'light' | 'dark' => 
      value === 'light' || value === 'dark',
    notifications: isBoolean,
  }),
  tags: isArrayWithEachItem(isString),
});

// Invalid user data for testing
const invalidUser = {
  id: "123",           // Should be number
  name: 456,           // Should be string
  email: true,         // Should be string
  age: "thirty",       // Should be number
  isActive: "yes",     // Should be boolean
  preferences: {
    theme: "blue",     // Should be 'light' or 'dark'
    notifications: "on", // Should be boolean
  },
  tags: [1, 2, 3],    // Should be string array
};

console.log('📊 Test Data:');
console.log(JSON.stringify(invalidUser, null, 2));
console.log('\n' + '='.repeat(80) + '\n');

// ============================================================================
// 1. SINGLE ERROR MODE (Default - Fastest)
// ============================================================================

console.log('📝 Example 1: Single Error Mode (Default - Fastest)');
console.log('Stops at first failure for maximum performance\n');

const singleErrors: string[] = [];
const singleStart = performance.now();

const singleResult = isUser(invalidUser, {
  identifier: 'user',
  callbackOnError: (error) => singleErrors.push(error),
  errorMode: 'single'
});

const singleEnd = performance.now();

console.log(`❌ Validation result: ${singleResult}`);
console.log(`⏱️  Performance: ${(singleEnd - singleStart).toFixed(3)}ms`);
console.log(`📊 Errors collected: ${singleErrors.length}`);
console.log('🔍 Error messages:');
singleErrors.forEach((error, index) => {
  console.log(`  ${index + 1}. ${error}`);
});

console.log('\n' + '='.repeat(80) + '\n');

// ============================================================================
// 2. MULTI ERROR MODE (Comprehensive)
// ============================================================================

console.log('📝 Example 2: Multi Error Mode (Comprehensive)');
console.log('Collects all errors as strings\n');

const multiErrors: string[] = [];
const multiStart = performance.now();

const multiResult = isUser(invalidUser, {
  identifier: 'user',
  callbackOnError: (error) => multiErrors.push(error),
  errorMode: 'multi'
});

const multiEnd = performance.now();

console.log(`❌ Validation result: ${multiResult}`);
console.log(`⏱️  Performance: ${(multiEnd - multiStart).toFixed(3)}ms`);
console.log(`📊 Errors collected: ${multiErrors.length}`);
console.log('🔍 Error messages:');
multiErrors.forEach((error, index) => {
  console.log(`  ${index + 1}. ${error}`);
});

console.log('\n' + '='.repeat(80) + '\n');

// ============================================================================
// 3. JSON ERROR MODE (Structured)
// ============================================================================

console.log('📝 Example 3: JSON Error Mode (Structured)');
console.log('Provides structured JSON tree with detailed validation information\n');

const jsonErrors: string[] = [];
const jsonStart = performance.now();

const jsonResult = isUser(invalidUser, {
  identifier: 'user',
  callbackOnError: (error) => jsonErrors.push(error),
  errorMode: 'json'
});

const jsonEnd = performance.now();

console.log(`❌ Validation result: ${jsonResult}`);
console.log(`⏱️  Performance: ${(jsonEnd - jsonStart).toFixed(3)}ms`);
console.log(`📊 Errors collected: ${jsonErrors.length}`);

// Separate individual errors from JSON tree
const individualErrors = jsonErrors.slice(0, -1);
const jsonTree = jsonErrors[jsonErrors.length - 1];

console.log('🔍 Individual error messages:');
individualErrors.forEach((error, index) => {
  console.log(`  ${index + 1}. ${error}`);
});

console.log('\n🌳 JSON Tree Structure:');
console.log(jsonTree);

console.log('\n' + '='.repeat(80) + '\n');

// ============================================================================
// 4. FUNCTIONAL PROGRAMMING FEATURES
// ============================================================================

console.log('📝 Example 4: Functional Programming Features');
console.log('Demonstrating Higher-Order Functions and composition\n');

// Higher-Order Function: Compose type guards
const isUserList = isArrayWithEachItem(isUser);
const isUserMap = isType({
  users: isUserList,
  count: isNumber,
});

// Test data
const userListData = [
  { id: 1, name: "John", email: "john@example.com", age: 30, isActive: true, preferences: { theme: "light", notifications: true }, tags: ["admin"] },
  { id: "2", name: 123, email: true, age: "twenty", isActive: "yes", preferences: { theme: "blue", notifications: "on" }, tags: [1, 2, 3] }, // Invalid
];

const userMapData = {
  users: userListData,
  count: "not a number"
};

console.log('🔧 Testing Higher-Order Function Composition:');
console.log('User List Validation:');

const userListErrors: string[] = [];
const userListResult = isUserList(userListData, {
  identifier: 'users',
  callbackOnError: (error) => userListErrors.push(error),
  errorMode: 'multi'
});

console.log(`  Result: ${userListResult}`);
console.log(`  Errors: ${userListErrors.length}`);
userListErrors.slice(0, 3).forEach((error, index) => {
  console.log(`    ${index + 1}. ${error}`);
});

console.log('\n🔧 Testing Nested Composition:');
console.log('User Map Validation:');

const userMapErrors: string[] = [];
const userMapResult = isUserMap(userMapData, {
  identifier: 'userMap',
  callbackOnError: (error) => userMapErrors.push(error),
  errorMode: 'multi'
});

console.log(`  Result: ${userMapResult}`);
console.log(`  Errors: ${userMapErrors.length}`);
userMapErrors.slice(0, 3).forEach((error, index) => {
  console.log(`    ${index + 1}. ${error}`);
});

console.log('\n' + '='.repeat(80) + '\n');

// ============================================================================
// 5. PERFORMANCE COMPARISON
// ============================================================================

console.log('📝 Example 5: Performance Comparison');
console.log('Comparing all three error modes with large datasets\n');

// Create a large dataset for performance testing
const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
  id: i % 2 === 0 ? i : `invalid-${i}`,
  name: i % 3 === 0 ? `User ${i}` : i,
  email: i % 4 === 0 ? `user${i}@example.com` : i,
  age: i % 5 === 0 ? i : `age-${i}`,
  isActive: i % 6 === 0 ? true : `active-${i}`,
  preferences: {
    theme: i % 7 === 0 ? 'light' : 'invalid-theme',
    notifications: i % 8 === 0 ? true : `notify-${i}`,
  },
  tags: i % 9 === 0 ? [`tag${i}`] : [i, i + 1, i + 2],
}));

const performanceResults: Array<{ mode: string; time: number; errors: number }> = [];

// Test Single Mode Performance
const singlePerfErrors: string[] = [];
const singlePerfStart = performance.now();

isUserList(largeDataset, {
  identifier: 'users',
  callbackOnError: (error) => singlePerfErrors.push(error),
  errorMode: 'single'
});

const singlePerfEnd = performance.now();
performanceResults.push({
  mode: 'Single',
  time: singlePerfEnd - singlePerfStart,
  errors: singlePerfErrors.length
});

// Test Multi Mode Performance
const multiPerfErrors: string[] = [];
const multiPerfStart = performance.now();

isUserList(largeDataset, {
  identifier: 'users',
  callbackOnError: (error) => multiPerfErrors.push(error),
  errorMode: 'multi'
});

const multiPerfEnd = performance.now();
performanceResults.push({
  mode: 'Multi',
  time: multiPerfEnd - multiPerfStart,
  errors: multiPerfErrors.length
});

// Test JSON Mode Performance
const jsonPerfErrors: string[] = [];
const jsonPerfStart = performance.now();

isUserList(largeDataset, {
  identifier: 'users',
  callbackOnError: (error) => jsonPerfErrors.push(error),
  errorMode: 'json'
});

const jsonPerfEnd = performance.now();
performanceResults.push({
  mode: 'JSON',
  time: jsonPerfEnd - jsonPerfStart,
  errors: jsonPerfErrors.length
});

console.log('📊 Performance Results (1000 items):');
console.log('┌─────────┬─────────────┬─────────────┐');
console.log('│ Mode    │ Time (ms)   │ Errors      │');
console.log('├─────────┼─────────────┼─────────────┤');

performanceResults.forEach(result => {
  console.log(`│ ${result.mode.padEnd(7)} │ ${result.time.toFixed(3).padStart(11)} │ ${result.errors.toString().padStart(11)} │`);
});

console.log('└─────────┴─────────────┴─────────────┘');

console.log('\n💡 Performance Insights:');
console.log('• Single mode: Fastest - stops at first error (best for production)');
console.log('• Multi mode: Medium - collects all errors as strings');
console.log('• JSON mode: Most detailed - provides structured tree (best for debugging)');

console.log('\n' + '='.repeat(80) + '\n');

// ============================================================================
// 6. USE CASE RECOMMENDATIONS
// ============================================================================

console.log('📝 Example 6: Use Case Recommendations');
console.log('When to use each error mode\n');

console.log('🚀 Single Error Mode (Default):');
console.log('  ✅ Production environments');
console.log('  ✅ Performance-critical applications');
console.log('  ✅ When you only need to know if validation failed');
console.log('  ✅ Real-time user input validation');
console.log('  ✅ API request validation');

console.log('\n📋 Multi Error Mode:');
console.log('  ✅ Form validation with multiple fields');
console.log('  ✅ Data import/export validation');
console.log('  ✅ Configuration file validation');
console.log('  ✅ When you need all validation errors');
console.log('  ✅ Testing and debugging');

console.log('\n🌳 JSON Error Mode:');
console.log('  ✅ Complex nested object validation');
console.log('  ✅ API response validation');
console.log('  ✅ Data transformation pipelines');
console.log('  ✅ When you need structured error data');
console.log('  ✅ Integration with error tracking systems');

console.log('\n' + '='.repeat(80) + '\n');

console.log('🎉 Demo Complete!');
console.log('\nKey Takeaways:');
console.log('• Choose error mode based on your use case and performance requirements');
console.log('• Functional programming enables powerful composition patterns');
console.log('• Guardz provides both performance and flexibility');
console.log('• Structured error handling improves debugging and user experience');
console.log('\nHappy type guarding! 🛡️'); 