# 🛡️ Guardz

[![NPM Version](https://img.shields.io/npm/v/guardz)](https://www.npmjs.com/package/guardz)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/thiennp/guardz/actions/workflows/ci.yml/badge.svg)](https://github.com/thiennp/guardz/actions/workflows/ci.yml)

A powerful TypeScript type guard library with **comprehensive error handling** and **functional programming patterns** for runtime type validation.

> **Runtime type guards with detailed error messages — not just validation, but actionable feedback with multiple error reporting modes.**

### Sample

[Codesandbox](https://codesandbox.io/p/live/c8c7f6fd-480e-43f2-b211-bd9962f54be5)

Guardz is a comprehensive runtime type-checking library that goes beyond simple validation.  
It provides **detailed, actionable error messages** that help you identify exactly what went wrong and where, with **three distinct error reporting modes** for different use cases.

- ✅ **Comprehensive Error Messages** - Know exactly what failed and why
- ✅ **Multiple Error Modes** - Single, Multi, and JSON tree error reporting
- ✅ **Functional Programming** - Pure functions with Higher-Order Functions (HoF)
- ✅ **Performance Optimized** - Fast single-error mode for production
- ✅ Zero transformation
- ✅ Fully type-safe
- ✅ Human-readable guards
- ✅ Tiny and dependency-free
- ✅ **Custom Error Handling** - Integrate with your logging and monitoring

---

## 🚀 Why Guardz?

TypeScript types vanish at runtime. That's where Guardz steps in.  
Unlike schema validators that require re-declaring types, Guardz uses **your existing TS types as the source of truth**, matching values without coercion.

**But Guardz goes further:**

- 🛑 **Comprehensive error messages**: Instantly know what failed, where, and why. Every type guard can provide detailed, field-specific error messages for debugging, logging, and user feedback.
- 🔄 **Multiple error modes**: Choose between single-error (fast), multi-error (comprehensive), or JSON-tree (structured) error reporting.
- 🔗 **Custom error handling**: Integrate with your logging, monitoring, or UI error display with a simple callback.
- ⚡ **Functional programming**: Built with pure functions and Higher-Order Functions for composable, maintainable code.

📚 [Read: "Assert Nothing, Guard Everything"](https://medium.com/p/0b3e4388ae78)

---

## 🎯 Error Messages: The Heart of Guardz

Guardz's error handling is what sets it apart from other type guard libraries. Instead of just returning `true` or `false`, Guardz provides **detailed, actionable error messages** that tell you exactly what went wrong.

### What Makes Guardz Error Messages Special

- **🔍 Precise Location**: Know exactly which field failed validation
- **📊 Clear Context**: See the actual value that failed and what was expected
- **🛠️ Actionable**: Error messages guide you to the exact fix needed
- **🌳 Nested Support**: Track errors through complex object structures
- **⚡ Performance**: Choose between fast single-error or comprehensive multi-error modes

### Example Error Messages

```typescript
// Simple validation error
Expected user.age ("30") to be "number"

// Nested object error
Expected user.details.email (123) to be "string"

// Array element error
Expected users[2].name (null) to be "string"

// Complex path error
Expected config.database.connection.pool.max ("10") to be "number"
```

---

## 🚀 Guardz Ecosystem

Guardz is more than just a type guard library - it's a complete ecosystem for runtime type safety in TypeScript applications.

### Core Package: `guardz`

The foundation of the ecosystem, providing comprehensive type guards with detailed error handling and functional programming patterns.

### HTTP Client: `guardz-axios`

Type-safe HTTP requests with runtime validation built on top of Axios.

**Key Features:**

- **Type-safe HTTP requests** with runtime validation
- **Multiple API patterns** for different use cases
- **Comprehensive error handling** with detailed feedback
- **Retry logic** with configurable backoff strategies
- **Tolerance mode** for graceful degradation

```typescript
import { safeGet } from 'guardz-axios';
import { isType, isString, isNumber } from 'guardz';

interface User {
  id: number;
  name: string;
  email: string;
}

const isUser = isType<User>({
  id: isNumber,
  name: isString,
  email: isString,
});

const result = await safeGet({ guard: isUser })('/users/1');

if (result.status === Status.SUCCESS) {
  console.log('User:', result.data); // Fully typed as User
} else {
  console.log('Error:', result.code, result.message);
}
```

**Installation:**

```bash
npm install guardz-axios guardz axios
```

### Type Guard Generator: `guardz-generator`

Automatically generate type guards from your TypeScript interfaces and type aliases.

**Key Features:**

- **Automatic generation** from TypeScript interfaces and type aliases
- **Generic support** for complex type structures
- **Advanced recursion detection** for self-referencing types
- **Cross-file references** for multi-file type systems
- **CLI and programmatic APIs** for flexible integration

```bash
# Generate type guards for all exported interfaces
npx guardz-generator generate "src/**/*.ts"

# Generate for a specific type
npx guardz-generator generate "src/**/*.ts" -t UserDTO
```

**Installation:**

```bash
npm install guardz-generator
```

## 📦 Installation

```bash
npm install guardz
# or
yarn add guardz
```

## Quick Start: Error Messages in Action

See Guardz's error handling in action with a simple example:

```typescript
import { isType, isString, isNumber } from 'guardz';

const errors: string[] = [];
const isUser = isType({
  name: isString,
  age: isNumber,
});

const user = { name: 123, age: "30" }; // Invalid data
const isValid = isUser(user, {
  identifier: 'user',
  callbackOnError: (error) => errors.push(error),
});

console.log(errors);
// Output: [
//   'Expected user.name (123) to be "string"',
//   'Expected user.age ("30") to be "number"'
// ]
```

## Usage

### Basic Type Guards

Start with simple primitive type checking:

```typescript
import { isString } from 'guardz';

const data: unknown = getDataFromSomewhere();

if (isString(data)) {
  // data type is narrowed to string
  console.log(data.toUpperCase());
}
```

### Object Type Guards

Create type guards for complex object structures:

```typescript
import { isType, isString } from 'guardz';
const data: unknown = getDataFromSomewhere();

// Build type guard function
const isUser = isType({
  name: isString,
  age: isString,
});

if (isUser(data)) {
  // data type is narrowed to { name: string, age: string }
  console.log(`Name: ${data.name}`);
  console.log(`Age: ${data.age}`);
}
```

### Object Type Guard Aliases

Guardz provides aliases for `isType` with more intuitive names:

```typescript
import { isObject, isObjectWith, isString, isNumber, isBoolean } from 'guardz';

// Using isObject (shorter, more concise)
const isUser = isObject({
  id: isNumber,
  name: isString,
  email: isString,
  isActive: isBoolean,
});

// Using isObjectWith (more descriptive)
const isProduct = isObjectWith({
  sku: isString,
  name: isString,
  price: isNumber,
  inStock: isBoolean,
});

// All three are functionally equivalent:
// isType, isObject, and isObjectWith
```

### Array Type Guards

Validate arrays with specific item types:

```typescript
import { isArrayWithEachItem, isNumber } from 'guardz';

const data: unknown = getDataFromSomewhere();
if (isArrayWithEachItem(isNumber)(data)) {
  // data type is narrowed to number[]
  console.log(data.map(item => item.toFixed(2)));
}
```

### Object Property Type Guards

Validate object properties with specific value types:

```typescript
import { isObjectWithEachItem, isNumber } from 'guardz';

const data: unknown = getDataFromSomewhere();
if (isObjectWithEachItem(isNumber)(data)) {
  // data type is narrowed to Record<string, number | undefined>
  console.log(data.something?.toFixed(2));
}
```

### Union Type Guards

Handle multiple possible types:

```typescript
import { isNumber, isString, isOneOfTypes } from 'guardz';

const data: unknown = getDataFromSomewhere();
if (isOneOfTypes<number | string>(isNumber, isString)(data)) {
  // data type is narrowed to string | number
  return isNumber(data) ? data.toFixed(2) : data;
}
```

### Composite Type Guards

Handle complex type relationships like intersections and extensions:

```typescript
import {
  isIntersectionOf,
  isExtensionOf,
  isType,
  isString,
  isNumber,
} from 'guardz';

// For intersection types (Type A & Type B)
interface Person {
  name: string;
  age: number;
}

interface Employee {
  employeeId: string;
  department: string;
}

interface Manager {
  teamSize: number;
  reportsTo: string;
}

const isPerson = isType<Person>({ name: isString, age: isNumber });
const isEmployee = isType<Employee>({
  employeeId: isString,
  department: isString,
});
const isManager = isType<Manager>({ teamSize: isNumber, reportsTo: isString });

// Single type guard
const isPersonOnly = isIntersectionOf(isPerson);
// Type: TypeGuardFn<Person>

// Two type guards - exact intersection type
const isPersonEmployee = isIntersectionOf(isPerson, isEmployee);
// Type: TypeGuardFn<Person & Employee>

// Three type guards - exact intersection type
const isPersonEmployeeManager = isIntersectionOf(isPerson, isEmployee, isManager);
// Type: TypeGuardFn<Person & Employee & Manager>

const data: unknown = getDataFromSomewhere();
if (isPersonEmployeeManager(data)) {
  // data type is narrowed to Person & Employee & Manager
  console.log(`${data.name} manages ${data.teamSize} people in ${data.department}`);
}

// For inheritance patterns (Interface B extends Interface A)
interface Manager extends Person {
  employeeId: string;
  department: string;
  managedTeamSize: number;
}

const isManagerFull = isType<Manager>({
  name: isString,
  age: isNumber,
  employeeId: isString,
  department: isString,
  managedTeamSize: isNumber,
});

const isManager = isExtensionOf(isPerson, isManagerFull);

if (isManager(data)) {
  // data type is narrowed to Manager
  console.log(`Manager ${data.name} manages ${data.managedTeamSize} people`);
}
```

### Nullable Type Guards

Handle null values:

```typescript
import { isNullOr, isString } from 'guardz';

const data: unknown = getDataFromSomewhere();
if (isNullOr(isString)(data)) {
  // data type is narrowed to string | null
  return data?.toUpperCase();
}
```

### Optional Type Guards

Handle undefined values:

```typescript
import { isUndefinedOr, isString } from 'guardz';

const data: unknown = getDataFromSomewhere();
if (isUndefinedOr(isString)(data)) {
  // data type is narrowed to string | undefined
  return data?.toUpperCase();
}
```

### Combined Nullable and Optional Types

Handle both null and undefined values:

```typescript
import { isUndefinedOr, isNullOr, isNilOr, isString } from 'guardz';

// Method 1: Using isNilOr (recommended for brevity)
const data: unknown = getDataFromSomewhere();
if (isNilOr(isString)(data)) {
  // data type is narrowed to string | null | undefined
  return data?.toUpperCase();
}

// Method 2: Explicit composition (equivalent to isNilOr)
if (isUndefinedOr(isNullOr(isString))(data)) {
  // data type is narrowed to string | undefined | null
  return data?.toUpperCase();
}
```

### Complex Nested Type Guards

Create type guards for deeply nested structures:

```typescript
import {
  isUndefinedOr,
  isString,
  isEnum,
  isEqualTo,
  isNumber,
  isOneOfTypes,
  isArrayWithEachItem,
  isType,
} from 'guardz';

enum PriceTypeEnum {
  FREE = 'free',
  PAID = 'paid',
}

type Book = {
  title: string;
  price: PriceTypeEnum;
  author: {
    name: string;
    email?: string;
  };
  chapters: Array<{
    content: string;
    startPage: number;
  }>;
  rating: Array<{
    userId: string;
    average: number | 'N/A';
  }>;
};

const data: unknown = getDataFromSomewhere();

const isBook = isType<Book>({
  title: isString,
  price: isEnum(PriceTypeEnum),
  author: isType({
    name: isString,
    email: isUndefinedOr(isString),
  }),
  chapters: isArrayWithEachItem(
    isType({
      content: isString,
      startPage: isNumber,
    })
  ),
  rating: isArrayWithEachItem(
    isType({
      userId: isString,
      average: isOneOfTypes<number | 'N/A'>(isNumber, isEqualTo('N/A')),
    })
  ),
});

if (isBook(data)) {
  // data type is narrowed to Book
  return data;
}
```

### Guard with Tolerance

Use `guardWithTolerance` when you want to proceed with potentially invalid data while logging validation errors:

```typescript
import { isBook } from 'isBook'; // see previous example
import { guardWithTolerance } from 'guardz';

const data: unknown = getDataFromSomewhere();

// This will return the data as Book type even if validation fails,
// but will log errors if config is provided
const book = guardWithTolerance(data, isBook, {
  identifier: 'book',
  callbackOnError: error => console.error('Validation error:', error),
});
```

### Additional Type Guards

#### Assertion Type Guards

Use `isAsserted` when you need TypeScript type assertion without runtime validation. This is particularly useful for:

- **External library types** that don't provide type guards
- **API responses** where you trust the type but need TypeScript assertion
- **Testing scenarios** where you want to bypass runtime validation
- **Legacy code integration** where type safety is needed but runtime checks aren't feasible

```typescript
import { isAsserted } from 'guardz';

// Basic usage with external library types
import type { ExternalApiResponse } from 'some-external-lib';
const isExternalResponse = isAsserted<ExternalApiResponse>;

const data: unknown = { id: 123, name: 'test' };
if (isExternalResponse(data)) {
  // TypeScript knows data is ExternalApiResponse
  console.log(data.id); // No type error
  console.log(data.name); // No type error
}
```

**Complex nested types:**

```typescript
interface UserProfile {
  id: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  metadata: Record<string, unknown>;
}

const isUserProfile = isAsserted<UserProfile>;
const profile: unknown = {
  id: 'user-123',
  preferences: { theme: 'dark', notifications: true },
  metadata: { lastLogin: new Date() }
};

if (isUserProfile(profile)) {
  // Full type safety for nested properties
  console.log(profile.preferences.theme); // 'light' | 'dark'
  console.log(profile.metadata.lastLogin); // unknown
}
```

**Combining with other type guards:**

```typescript
import { isType, isString, isNumber, isExtensionOf } from 'guardz';

interface ValidatedUser {
  name: string;
  age: number;
}

interface ExternalUser extends ValidatedUser {
  externalId: string;
  metadata: unknown;
}

const isValidatedUser = isType<ValidatedUser>({
  name: isString,
  age: isNumber
});

const isExternalUser = isExtensionOf(
  isValidatedUser,
  isAsserted<Omit<ExternalUser, keyof ValidatedUser>>
);

const user: unknown = {
  name: 'John',
  age: 30,
  externalId: 'ext-123',
  metadata: { source: 'api' }
};

if (isExternalUser(user)) {
  // TypeScript knows user is ExternalUser
  console.log(user.externalId); // string
  console.log(user.metadata); // unknown
}
```

#### Integer Validation

Validate that a value is an integer number:

```typescript
import { isInteger } from 'guardz';

const data: unknown = getDataFromSomewhere();
if (isInteger(data)) {
  // data type is narrowed to number
  console.log(`User ID: ${data}`); // Safe to use as integer
}
```

#### Tuple Validation

Validate fixed-length arrays with specific types at each position:

```typescript
import { isTuple, isString, isNumber } from 'guardz';

const data: unknown = getDataFromSomewhere();
// Check for [string, number] tuple
if (isTuple([isString, isNumber])(data)) {
  // data type is narrowed to [string, number]
  const [name, age] = data;
  console.log(`${name} is ${age} years old`);
}
```

#### BigInt Validation

Validate BigInt values for large numbers:

```typescript
import { isBigInt } from 'guardz';

const data: unknown = getDataFromSomewhere();
if (isBigInt(data)) {
  // data type is narrowed to bigint
  console.log(`Large number: ${data}`);
}
```

#### Web API Type Guards

Validate Web API objects with environment-aware detection:

```typescript
import {
  isFile,
  isFileList,
  isBlob,
  isFormData,
  isURL,
  isURLSearchParams,
} from 'guardz';

// File validation (browser environment)
const fileInput: unknown = getFileInput();
if (isFile(fileInput)) {
  // fileInput type is narrowed to File
  console.log(`File name: ${fileInput.name}, size: ${fileInput.size}`);
}

// FileList validation (browser environment)
const fileList: unknown = getFileList();
if (isFileList(fileList)) {
  // fileList type is narrowed to FileList
  console.log(`Number of files: ${fileList.length}`);
  for (let i = 0; i < fileList.length; i++) {
    console.log(`File ${i}: ${fileList[i].name}`);
  }
}

// Blob validation
const blob: unknown = getBlob();
if (isBlob(blob)) {
  // blob type is narrowed to Blob
  console.log(`Blob size: ${blob.size}, type: ${blob.type}`);
}

// FormData validation
const formData: unknown = getFormData();
if (isFormData(formData)) {
  // formData type is narrowed to FormData
  console.log(`Form entries: ${Array.from(formData.entries())}`);
}

// URL validation
const url: unknown = getURL();
if (isURL(url)) {
  // url type is narrowed to URL
  console.log(`Protocol: ${url.protocol}, hostname: ${url.hostname}`);
}

// URLSearchParams validation
const searchParams: unknown = getSearchParams();
if (isURLSearchParams(searchParams)) {
  // searchParams type is narrowed to URLSearchParams
  console.log(`Query string: ${searchParams.toString()}`);
}
```

**Environment Detection**: These Web API type guards automatically detect whether the APIs are available in the current environment (browser vs Node.js) and provide appropriate error messages.

#### Function and Collection Type Guards

Validate functions and collection objects:

```typescript
import { isFunction, isMap, isSet, isError } from 'guardz';

// Function validation
const func: unknown = getFunction();
if (isFunction(func)) {
  // func type is narrowed to Function
  console.log(`Function name: ${func.name}`);
}

// Map validation
const map: unknown = getMap();
if (isMap(map)) {
  // map type is narrowed to Map
  console.log(`Map size: ${map.size}`);
}

// Set validation
const set: unknown = getSet();
if (isSet(set)) {
  // set type is narrowed to Set
  console.log(`Set size: ${set.size}`);
}

// Error validation
const error: unknown = getError();
if (isError(error)) {
  // error type is narrowed to Error
  console.log(`Error message: ${error.message}`);
}
```

#### Additional Number Type Guards

Validate specific number ranges:

```typescript
import { isNonPositiveNumber, isNegativeNumber } from 'guardz';

// Non-positive numbers (≤ 0) - includes zero
const data1: unknown = getDataFromSomewhere();
if (isNonPositiveNumber(data1)) {
  // data1 type is narrowed to NonPositiveNumber
  console.log(`Value is zero or negative: ${data1}`);
}

// Negative numbers (< 0) - excludes zero
const data2: unknown = getDataFromSomewhere();
if (isNegativeNumber(data2)) {
  // data2 type is narrowed to NegativeNumber
  console.log(`Value is strictly negative: ${data2}`);
}
```

#### Integer-Specific Type Guards

Validate integers with specific range constraints:

```typescript
import {
  isPositiveInteger,
  isNegativeInteger,
  isNonNegativeInteger,
  isNonPositiveInteger,
} from 'guardz';

// Positive integers (> 0 and whole numbers)
const userId: unknown = getUserInput();
if (isPositiveInteger(userId)) {
  // userId type is narrowed to PositiveInteger
  console.log(`User ID: ${userId}`); // Safe for database primary keys
}

// Non-negative integers (≥ 0 and whole numbers)
const arrayIndex: unknown = getArrayIndex();
if (isNonNegativeInteger(arrayIndex)) {
  // arrayIndex type is narrowed to NonNegativeInteger
  console.log(`Array index: ${arrayIndex}`); // Safe for 0-based indexing
}

// Negative integers (< 0 and whole numbers)
const errorCode: unknown = getErrorCode();
if (isNegativeInteger(errorCode)) {
  // errorCode type is narrowed to NegativeInteger
  console.log(`Error code: ${errorCode}`); // Safe for negative error codes
}

// Non-positive integers (≤ 0 and whole numbers)
const floorLevel: unknown = getFloorLevel();
if (isNonPositiveInteger(floorLevel)) {
  // floorLevel type is narrowed to NonPositiveInteger
  console.log(`Floor level: ${floorLevel}`); // Safe for ground level and basements
}
```

## 🛑 Error Handling: Three Powerful Modes

One of Guardz's most powerful features is its **detailed error messages** with **three distinct error reporting modes**. Every type guard can provide actionable, field-specific error messages that tell you:

- **What failed** (the value and its field)
- **Where it failed** (the property path)
- **What was expected** (the type or constraint)

### Error Modes

Guardz provides three error reporting modes to suit different use cases:

#### 1. **Single Error Mode** (Default - Fastest)
Stops at the first validation failure for maximum performance.

```typescript
import { isType, isString, isNumber } from 'guardz';

const errors: string[] = [];
const isUser = isType({
  id: isNumber,
  name: isString,
  email: isString,
});

const user = { id: "1", name: 123, email: true };
const isValid = isUser(user, {
  identifier: 'user',
  callbackOnError: (error) => errors.push(error),
  errorMode: 'single' // Default mode
});

console.log(errors);
// Output: ['Expected user.id ("1") to be "number"']
// Only the first error is reported
```

#### 2. **Multi Error Mode** (Comprehensive)
Collects all validation errors as strings.

```typescript
const errors: string[] = [];
const isValid = isUser(user, {
  identifier: 'user',
  callbackOnError: (error) => errors.push(error),
  errorMode: 'multi'
});

console.log(errors);
// Output: [
//   'Expected user.id ("1") to be "number"',
//   'Expected user.name (123) to be "string"',
//   'Expected user.email (true) to be "string"'
// ]
// All errors are collected
```

#### 3. **JSON Error Mode** (Structured)
Provides a structured JSON tree with detailed validation information.

```typescript
const errors: string[] = [];
const isValid = isUser(user, {
  identifier: 'user',
  callbackOnError: (error) => errors.push(error),
  errorMode: 'json'
});

console.log(errors);
// Output: [
//   'Expected user.id ("1") to be "number"',
//   'Expected user.name (123) to be "string"',
//   'Expected user.email (true) to be "string"',
//   '{
//     "user": {
//       "valid": false,
//       "value": {
//         "id": {
//           "valid": false,
//           "value": "1",
//           "expectedType": "number"
//         },
//         "name": {
//           "valid": false,
//           "value": 123,
//           "expectedType": "string"
//         },
//         "email": {
//           "valid": false,
//           "value": true,
//           "expectedType": "string"
//         }
//       }
//     }
//   }'
// ]
// Individual errors + structured JSON tree
```

### Error Message Format

Every error message follows a clear, consistent format:

```
Expected {identifier} ({value}) to be "{expectedType}"
```

**Examples:**

- `Expected user.age ("30") to be "number"`
- `Expected items ([]) to be "NonEmptyArray"`
- `Expected config.port ("abc") to be "PositiveInteger"`
- `Expected user.details.email (123) to be "string"`

### How to Use

Every type guard accepts an optional config with an `identifier`, `callbackOnError`, and `errorMode`:

```typescript
const errors: string[] = [];
const config = {
  identifier: 'user',
  callbackOnError: (error: string) => errors.push(error),
  errorMode: 'single' as const, // 'single' | 'multi' | 'json'
};

const isUser = isType({ name: isString, age: isNumber });
const result = isUser({ name: 'John', age: '30' }, config);
// errors now contains: [ 'Expected user.age ("30") to be "number"' ]
```

### Performance Considerations

- **Single Mode**: Fastest - stops at first error (default for production)
- **Multi Mode**: Medium - collects all errors as strings
- **JSON Mode**: Most detailed - provides structured tree (best for debugging)

### Why Error Messages Matter

- **Debugging**: Instantly see which field failed and why
- **User Feedback**: Show clear, actionable error messages in your UI
- **Logging/Monitoring**: Integrate with your error tracking systems
- **Testing**: Assert on specific error messages in your tests
- **Performance**: Choose the right mode for your use case
- **Development Experience**: Clear feedback speeds up development and reduces frustration

### Advanced: Nested and Multiple Errors

Guardz tracks errors even in deeply nested structures, using dot/bracket notation for property paths:

- `Expected user.details.age ("thirty") to be "number"`
- `Expected users[2].email (123) to be "string"`
- `Expected config.database.connection.pool.max ("10") to be "number"`

---

## 🔄 Functional Programming Features

Guardz is built with functional programming principles, providing:

### Pure Functions
All type guards are pure functions with no side effects and predictable outputs.

### Higher-Order Functions (HoF)
Type guards can be composed and combined using Higher-Order Functions:

```typescript
import { isType, isString, isNumber, isArrayWithEachItem } from 'guardz';

// Compose type guards
const isUser = isType({
  name: isString,
  age: isNumber,
});

const isUserList = isArrayWithEachItem(isUser);

// Use composed guards
const users: unknown = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 }
];

if (isUserList(users)) {
  // users is typed as User[]
  users.forEach(user => console.log(`${user.name} is ${user.age}`));
}
```

### Immutable Data
All validation functions create new data structures without mutating inputs.

### Functional Composition
Logic flows through function composition rather than imperative statements.

---

## API Reference

Below is a comprehensive list of all type guards provided by `guardz`.

### Core Functions

- **isType<T>(propsTypesToCheck: { [P in keyof T]: TypeGuardFn<T[P]> }): TypeGuardFn<T>**
  Creates a type guard function for a specific object shape `T`. It checks if a value is a non-null object and verifies that each property specified in `propsTypesToCheck` conforms to its corresponding type guard function.

- **isObject<T>(propsTypesToCheck: { [P in keyof T]: TypeGuardFn<T[P]> }): TypeGuardFn<T>**
  Alias for `isType` - provides a shorter, more concise name for creating type guards that validate object structures.

- **isObjectWith<T>(propsTypesToCheck: { [P in keyof T]: TypeGuardFn<T[P]> }): TypeGuardFn<T>**
  Alias for `isType` - provides a more descriptive name for creating type guards that validate object structures with specific properties.

- **guardWithTolerance<T>(data: unknown, typeGuardFn: TypeGuardFn<T>, config?: Nullable<TypeGuardFnConfig>): T**
  Validates data using the provided type guard function. If validation fails, it still returns the data as the expected type but logs errors through the config callback.

### Error Configuration

- **TypeGuardFnConfig**
  ```typescript
  interface TypeGuardFnConfig {
    readonly callbackOnError: (errorMessage: string) => void;
    readonly identifier: string;
    readonly errorMode?: 'single' | 'multi' | 'json';
  }
  ```

### Primitive Type Guards

- **isAny** - Always returns true for any value
- **isBoolean** - Checks if a value is a boolean
- **isDate** - Checks if a value is a Date object
- **isDefined** - Checks if a value is not null or undefined
- **isNil** - Checks if a value is null or undefined
- **isNumber** - Checks if a value is a valid number (excludes NaN)
- **isString** - Checks if a value is a string
- **isUnknown** - Always returns true for any value

### Array Type Guards

- **isArrayWithEachItem** - Checks if a value is an array where each item matches a specific type
- **isNonEmptyArray** - Checks if a value is a non-empty array
- **isNonEmptyArrayWithEachItem** - Checks if a value is a non-empty array where each item matches a specific type
- **isTuple** - Checks if a value is a tuple (fixed-length array) with specific types at each position

### Object Type Guards

- **isNonNullObject** - Checks if a value is a non-null object (excludes arrays)
- **isObject** - Alias for `isType` - creates type guards for object structures (shorter name)
- **isObjectWith** - Alias for `isType` - creates type guards for object structures (descriptive name)
- **isObjectWithEachItem** - Checks if a value is an object where each property value matches a specific type
- **isPartialOf** - Checks if a value is a partial object matching a specific type

### String Type Guards

- **isNonEmptyString** - Checks if a value is a non-empty string

### Number Type Guards

- **isNonNegativeNumber** - Checks if a value is a non-negative number (≥ 0)
- **isPositiveNumber** - Checks if a value is a positive number (> 0)
- **isNonPositiveNumber** - Checks if a value is a non-positive number (≤ 0)
- **isNegativeNumber** - Checks if a value is a negative number (< 0)
- **isInteger** - Checks if a value is an integer number
- **isPositiveInteger** - Checks if a value is a positive integer (> 0 and whole number)
- **isNegativeInteger** - Checks if a value is a negative integer (< 0 and whole number)
- **isNonNegativeInteger** - Checks if a value is a non-negative integer (≥ 0 and whole number)
- **isNonPositiveInteger** - Checks if a value is a non-positive integer (≤ 0 and whole number)

### BigInt Type Guards

- **isBigInt** - Checks if a value is a BigInt

### Web API Type Guards

- **isFile** - Checks if a value is a File object (browser environment)
- **isFileList** - Checks if a value is a FileList object (browser environment)
- **isBlob** - Checks if a value is a Blob object
- **isFormData** - Checks if a value is a FormData object
- **isURL** - Checks if a value is a URL object
- **isURLSearchParams** - Checks if a value is a URLSearchParams object

### Function and Collection Type Guards

- **isFunction** - Checks if a value is a function
- **isMap** - Checks if a value is a Map object
- **isSet** - Checks if a value is a Set object
- **isError** - Checks if a value is an Error object or subclass

### Union Type Guards

- **isOneOf** - Checks if a value matches one of several specific values
- **isOneOfTypes** - Checks if a value matches one of several type guards

### Composite Type Guards

- **isIntersectionOf** - Validates a value against multiple type guards (intersection types: `A & B`). Supports 1-10 type guards with exact intersection type inference.
- **isExtensionOf** - Validates inheritance patterns where one type extends another (`interface B extends A`)

### Nullable/Optional Type Guards

- **isNullOr** - Checks if a value is null or matches a specific type
- **isUndefinedOr** - Checks if a value is undefined or matches a specific type
- **isNilOr** - Checks if a value is null, undefined, or matches a specific type (equivalent to `isUndefinedOr(isNullOr(...))`)

### Special Type Guards

- **isEnum** - Checks if a value matches any value from an enum
- **isEqualTo** - Checks if a value exactly equals a specific value
- **isAsserted** - Always returns true and asserts value is T (for external types without runtime validation)

### Utility Types

- **NonEmptyArray<T>** - Type for non-empty arrays
- **NonEmptyString** - Type for non-empty strings
- **NonNegativeNumber** - Type for non-negative numbers (≥ 0)
- **NonPositiveNumber** - Type for non-positive numbers (≤ 0)
- **NegativeNumber** - Type for negative numbers (< 0)
- **Nullable<T>** - Type for values that can be null
- **PositiveNumber** - Type for positive numbers (> 0)
- **Integer** - Type for integer numbers
- **PositiveInteger** - Type for positive integers (> 0 and whole number)
- **NegativeInteger** - Type for negative integers (< 0 and whole number)
- **NonNegativeInteger** - Type for non-negative integers (≥ 0 and whole number)
- **NonPositiveInteger** - Type for non-positive integers (≤ 0 and whole number)

## Contributing

We welcome contributions! Whether you're fixing a bug, adding a new feature, or improving documentation, your help is appreciated.

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add some amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Setup

```bash
# Clone the repository
git clone https://github.com/thiennp/guardz.git
cd guardz

# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build
```

### Code Style

- Follow the existing code style and formatting
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🛠️ Ecosystem Packages

The Guardz ecosystem consists of three complementary packages:

### 📦 `guardz` (Core)

The foundation package providing comprehensive type guards with detailed error handling and functional programming patterns.

**Features:**

- 60+ built-in type guards
- Comprehensive error messages with 3 modes (single, multi, json)
- Functional programming with Higher-Order Functions
- Custom error handling
- Zero dependencies
- Full TypeScript support

### 🌐 `guardz-axios`

Type-safe HTTP client with runtime validation built on top of Axios.

**Features:**

- Type-safe HTTP requests
- Multiple API patterns
- Comprehensive error handling
- Retry logic with backoff strategies
- Tolerance mode for graceful degradation

**[📖 Read the full documentation →](https://github.com/thiennp/guardz/tree/main/guardz-axios)**

### 🔧 `guardz-generator`

Automatically generate type guards from TypeScript interfaces and type aliases.

**Features:**

- Automatic generation from TypeScript types
- Generic support for complex structures
- Advanced recursion detection
- Cross-file references
- CLI and programmatic APIs

**[📖 Read the full documentation →](https://github.com/thiennp/guardz/tree/main/guardz-generator)**

## Support

### Getting Help

- 📖 **Documentation** - This README contains comprehensive examples
- 🐛 **Issues** - Report bugs or request features on [GitHub Issues](https://github.com/thiennp/guardz/issues)
- 💬 **Discussions** - Ask questions and share ideas on [GitHub Discussions](https://github.com/thiennp/guardz/discussions)

### Show Your Support

If you find this library helpful, consider:

- ⭐ **Starring** the repository on GitHub
- 🍺 **Buying me a beer** - [PayPal](https://paypal.me/thiennp)
- 📢 **Sharing** with your team and community
