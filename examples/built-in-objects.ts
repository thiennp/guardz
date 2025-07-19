import { 
  isMap, 
  isSet, 
  isRegExp, 
  isSymbol, 
  isPromise, 
  isFunction,
  isString,
  isNumber,
  isBoolean,
  isType
} from '../src/index';

console.log('=== Built-in Object Type Guards Examples ===\n');

// 1. Map Type Guards
console.log('1. Map Type Guards:');
const isStringNumberMap = isMap(isString, isNumber);
const isAnyMap = isMap();

const validMap = new Map([['user1', 100], ['user2', 200]]);
const invalidMap = new Map([[1, 'not-a-number']]);

console.log('isStringNumberMap(validMap):', isStringNumberMap(validMap)); // true
console.log('isStringNumberMap(invalidMap):', isStringNumberMap(invalidMap)); // false
console.log('isAnyMap(validMap):', isAnyMap(validMap)); // true

// Type narrowing example
const data: unknown = new Map([['key1', 42], ['key2', 84]]);
if (isMap(isString, isNumber)(data)) {
  // data is now typed as Map<string, number>
  data.forEach((value, key) => {
    console.log(`${key}: ${value.toFixed(2)}`); // Safe to use number methods
  });
}

console.log('\n2. Set Type Guards:');
const isStringSet = isSet(isString);
const isAnySet = isSet();

const validStringSet = new Set(['apple', 'banana', 'cherry']);
const invalidSet = new Set(['apple', 123, 'cherry']); // Mixed types

console.log('isStringSet(validStringSet):', isStringSet(validStringSet)); // true
console.log('isStringSet(invalidSet):', isStringSet(invalidSet)); // false
console.log('isAnySet(validStringSet):', isAnySet(validStringSet)); // true

// Type narrowing example
const setData: unknown = new Set(['hello', 'world']);
if (isSet(isString)(setData)) {
  // setData is now typed as Set<string>
  setData.forEach(item => {
    console.log(item.toUpperCase()); // Safe to use string methods
  });
}

console.log('\n3. RegExp Type Guards:');
const validRegex = /^[a-z]+$/i;
const invalidRegex = 'not-a-regex';

console.log('isRegExp(validRegex):', isRegExp(validRegex)); // true
console.log('isRegExp(invalidRegex):', isRegExp(invalidRegex)); // false

// Type narrowing example
const regexData: unknown = /^[0-9]+$/;
if (isRegExp(regexData)) {
  // regexData is now typed as RegExp
  console.log('Regex test:', regexData.test('123')); // true
  console.log('Regex flags:', regexData.flags); // ""
}

console.log('\n4. Symbol Type Guards:');
const validSymbol = Symbol('user-id');
const invalidSymbol = 'not-a-symbol';

console.log('isSymbol(validSymbol):', isSymbol(validSymbol)); // true
console.log('isSymbol(invalidSymbol):', isSymbol(invalidSymbol)); // false

// Type narrowing example
const symbolData: unknown = Symbol('test');
if (isSymbol(symbolData)) {
  // symbolData is now typed as Symbol
  console.log('Symbol type:', typeof symbolData); // "symbol"
}

console.log('\n5. Promise Type Guards:');
const validPromise = Promise.resolve('hello');
const invalidPromise = 'not-a-promise';

const isAnyPromise = isPromise();
console.log('isAnyPromise(validPromise):', isAnyPromise(validPromise)); // true
console.log('isAnyPromise(invalidPromise):', isAnyPromise(invalidPromise)); // false

// Type narrowing example
const promiseData: unknown = Promise.resolve(42);
if (isPromise(isNumber)(promiseData)) {
  // promiseData is now typed as Promise<number>
  console.log('Promise type:', typeof promiseData); // "object"
  // Note: We can't validate the resolved value without awaiting
}

console.log('\n6. Function Type Guards:');
const validFunction = (x: number) => x * 2;
const invalidFunction = 'not-a-function';

console.log('isFunction(validFunction):', isFunction(validFunction)); // true
console.log('isFunction(invalidFunction):', isFunction(invalidFunction)); // false

// Type narrowing example
const functionData: unknown = (a: number, b: number) => a + b;
if (isFunction(functionData)) {
  // functionData is now typed as Function
  console.log('Function result:', functionData(5, 3)); // 8
  console.log('Function name:', functionData.name); // ""
}

console.log('\n7. Complex Object Validation:');
interface UserPreferences {
  theme: string;
  notifications: boolean;
  customRegex: RegExp;
  allowedUsers: Set<string>;
  userScores: Map<string, number>;
  asyncOperation: Promise<string>;
  validator: Function;
}

const isUserPreferences = isType<UserPreferences>({
  theme: isString,
  notifications: isBoolean,
  customRegex: isRegExp,
  allowedUsers: isSet(isString),
  userScores: isMap(isString, isNumber),
  asyncOperation: isPromise(),
  validator: isFunction,
});

const validPreferences: unknown = {
  theme: 'dark',
  notifications: true,
  customRegex: /^[a-z]+$/i,
  allowedUsers: new Set(['user1', 'user2']),
  userScores: new Map([['user1', 100], ['user2', 200]]),
  asyncOperation: Promise.resolve('success'),
  validator: (x: number) => x > 0,
};

console.log('isUserPreferences(validPreferences):', isUserPreferences(validPreferences)); // true

// Type narrowing with complex object
if (isUserPreferences(validPreferences)) {
  // validPreferences is now typed as UserPreferences
  console.log('Theme:', validPreferences.theme);
  console.log('Notifications:', validPreferences.notifications);
  console.log('Regex test:', validPreferences.customRegex.test('hello'));
  console.log('Allowed users count:', validPreferences.allowedUsers.size);
  console.log('User scores count:', validPreferences.userScores.size);
  console.log('Validator result:', validPreferences.validator(5));
}

console.log('\n8. Error Handling Examples:');
const errors: string[] = [];
const config = {
  identifier: 'test.data',
  callbackOnError: (error: string) => errors.push(error),
};

// Test Map with error handling
const invalidMapForErrors = new Map([[1, 'not-a-number']]);
isMap(isString, isNumber)(invalidMapForErrors, config);

// Test Set with error handling
const invalidSetForErrors = new Set(['valid', 123, 'also-valid']);
isSet(isString)(invalidSetForErrors, config);

// Test RegExp with error handling
isRegExp('not-a-regex', config);

console.log('Collected errors:', errors);

console.log('\n=== Built-in Object Type Guards Examples Complete ==='); 