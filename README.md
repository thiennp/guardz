# Guardz

[![npm version](https://badge.fury.io/js/guardz.svg)](https://badge.fury.io/js/guardz)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![npm downloads](https://img.shields.io/npm/dm/guardz.svg)](https://npm-stat.com/charts.html?package=guardz)
[![bundle size](https://img.shields.io/bundlephobia/minzip/guardz)](https://bundlephobia.com/result?p=guardz)

A comprehensive TypeScript type guard library with advanced validation capabilities, error reporting, and performance optimizations.

## 🚀 Quick Start

### Installation

```bash
# npm
npm install guardz

# yarn
yarn add guardz

# pnpm
pnpm add guardz
```

### TypeScript Configuration

Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Basic Usage

```typescript
import { isNonEmptyString, isNumber, isString, isType } from 'guardz';

// Basic guard
const value: unknown = getUnknownValue();
if(isString(value)) {
  // TypeScript now knows value is a string - type narrowing in action
  console.log(value.length); // Safe to access string properties
}

// Simulate getting data from an external source (API, database, etc.)
const maybeUser: unknown = await getUserInfoFromServer();

// Define a type guard for user type checking
const isUser = isType<UserDTO>({
  id: isNumber,
  name: isNonEmptyString,
  email: isNonEmptyString,
});

// Use type guard for type narrowing
if (isUser(maybeUser)) {
  // TypeScript now knows maybeUser is a valid UserDTO
  console.log(maybeUser.id);
  console.log(maybeUser.name);
  console.log(maybeUser.email);
}

```

## 🎯 Type Guards vs Validators

**Guardz is a type guard library, not a validation library.**

Guardz focuses on providing lightweight, composable type guards that enable TypeScript's type narrowing while maintaining excellent performance. For a detailed explanation of the differences between type guards and validators, see [this comprehensive guide](https://nguyenphongthien.medium.com/distinguishing-type-guards-and-validators-in-typescript-a-practical-and-conceptual-guide-88def286a777).


## ✨ Features

- **Comprehensive Type Guards**: 50+ built-in type guards for all JavaScript types
- **Advanced Type Narrowing**: Array type guards, object type guards, union types, and more
- **TypeScript Integration**: Seamless type narrowing with exact type inference
- **Performance Optimized**: Fast type guards with minimal overhead
- **TypeScript First**: Full type safety with precise type inference
- **Zero Dependencies**: Lightweight with no external dependencies
- **Tree Shaking**: Optimized for bundle size with tree shaking support

## 📖 Basic Examples

### Basic Type Guards

```typescript
import { isString, isNumber, isBoolean, isSymbol, isArrayWithEachItem, isObject } from 'guardz';

isString('hello');        // true
isNumber(42);             // true
isBoolean(true);          // true
isSymbol(Symbol('a'));    // true
isArrayWithEachItem(isNumber)([1, 2, 3]);     // true
isObject({ a: 1 });       // true
```

#### isSymbol Example

```typescript
import { isSymbol } from 'guardz';

const value: unknown = Symbol('test');
if (isSymbol(value)) {
  // value is now typed as symbol
  console.log(value.toString());
}
```

### Object Type Guards

```typescript
import { isType, isString, isNumber, isPositiveInteger, isUndefinedOr } from 'guardz';

interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
}

const isUser = isType<User>({
  id: isPositiveInteger,
  name: isString,
  email: isString,
  age: isUndefinedOr(isNumber), // Handle optional property
});

const user = { id: 1, name: 'John', email: 'john@example.com' };
console.log(isUser(user)); // true
```

### Array Type Guards

```typescript
import { isArrayWithEachItem, isString, isNumber } from 'guardz';

const isStringArray = isArrayWithEachItem(isString);
const isNumberArray = isArrayWithEachItem(isNumber);

console.log(isStringArray(['a', 'b', 'c'])); // true
console.log(isNumberArray([1, 2, 3])); // true
```

### Array Utilities

```typescript
import { isString, isNumber, isType, by } from 'guardz';

const isUser = isType({ name: isString, age: isNumber });

const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: '30' }, // invalid
  { name: 'Charlie', age: 35 },
];

// ❌ This won't work due to parameter mismatch
// const validUsers = users.filter(isUser);

// ✅ Use by for simple filtering
const validUsers = users.filter(by(isUser));
console.log('Valid users:', validUsers);
```

### Union Types

```typescript
import { isOneOfTypes, isString, isNumber, isBoolean } from 'guardz';

const isPrimitive = isOneOfTypes(isString, isNumber, isBoolean);

console.log(isPrimitive('hello')); // true
console.log(isPrimitive(42));      // true
console.log(isPrimitive(true));    // true
console.log(isPrimitive({}));      // false
```

### Error Handling

```typescript
import { isType, isString, isNumber } from 'guardz';

const errors: string[] = [];
const config = {
  identifier: 'user',
  callbackOnError: (error: string) => errors.push(error),
  errorMode: 'multi', // 'single' | 'multi' | 'json'
};

const isUser = isType({
  name: isString,
  age: isNumber,
});

const invalidUser = { name: 123, age: 'thirty' };
const result = isUser(invalidUser, config);

console.log(result); // false
console.log(errors); // ['user.name: Expected string, got number (123)', 'user.age: Expected number, got string ("thirty")']
```

### Pattern Validation

```typescript
import { isRegex, isPattern } from 'guardz';
import type { Pattern } from 'guardz';

// Validate RegExp objects
const patterns: unknown[] = [/^[a-z]+$/, new RegExp('\\d+'), 'not a regex'];
patterns.forEach(pattern => {
  if (isRegex(pattern)) {
    console.log(`Valid RegExp: ${pattern.source} (flags: ${pattern.flags})`);
  }
});

// Create branded types for pattern-matched strings
type Email = Pattern<'Email'>;
type PhoneNumber = Pattern<'PhoneNumber'>;
type URL = Pattern<'URL'>;

const isEmail = isPattern<'Email'>(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const isPhoneNumber = isPattern<'PhoneNumber'>('^\\+?[\\d\\s\\-()]{10,}$');
const isUrl = isPattern<'URL'>('^https?:\\/\\/.+');

// Validate strings against patterns
const email: unknown = 'user@example.com';
if (isEmail(email)) {
  // email is now typed as Email (branded string)
  console.log(`Valid email: ${email}`);
}

const phone: unknown = '+1-555-123-4567';
if (isPhoneNumber(phone)) {
  // phone is now typed as PhoneNumber (branded string)
  console.log(`Valid phone: ${phone}`);
}

// Type safety with branded types
function processEmail(email: Email) {
  // This function only accepts validated email strings
  console.log(`Processing email: ${email}`);
}

function processPhoneNumber(phone: PhoneNumber) {
  // This function only accepts validated phone number strings
  console.log(`Processing phone: ${phone}`);
}

// These work with type safety:
const validEmail: unknown = 'user@example.com';
if (isEmail(validEmail)) {
  processEmail(validEmail); // TypeScript knows this is safe
}

// These would cause TypeScript errors:
// processEmail('invalid-email'); // Error: Argument of type 'string' is not assignable to parameter of type 'Email'
// processPhoneNumber('123'); // Error: Argument of type 'string' is not assignable to parameter of type 'PhoneNumber'
```

## 🎯 Common Use Cases

### API Response Validation

```typescript
import { isType, isString, isNumber, isArrayWithEachItem, isOneOf } from 'guardz';

interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message: string;
  timestamp: number;
}

const isUserResponse = isType<ApiResponse<User>>({
  data: isType({
    id: isNumber,
    name: isString,
    email: isString,
  }),
  status: isOneOf('success', 'error'), // Use isOneOf for exact values
  message: isString,
  timestamp: isNumber,
});

// Validate API responses
const response = await fetch('/api/users/1');
const data = await response.json();

if (isUserResponse(data)) {
  console.log('Valid user:', data.data.name);
} else {
  console.log('Invalid response format');
}
```

### Form Data Validation

```typescript
import { isType, isString, isNumber, isPositiveInteger } from 'guardz';

interface RegistrationForm {
  username: string;
  email: string;
  age: number;
  password: string;
}

const isRegistrationForm = isType<RegistrationForm>({
  username: isString,
  email: isString, // Could add email regex validation
  age: isPositiveInteger,
  password: isString,
});

const formData = {
  username: 'john_doe',
  email: 'john@example.com',
  age: 25,
  password: 'secure123',
};

if (isRegistrationForm(formData)) {
  // Process valid form data
  await registerUser(formData);
} else {
  // Handle validation errors
  showValidationErrors(errors);
}
```

### Database Result Validation

```typescript
import { isType, isString, isNumber, isDate } from 'guardz';

interface DatabaseUser {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

const isDatabaseUser = isType<DatabaseUser>({
  id: isNumber,
  username: isString,
  email: isString,
  created_at: isString,
  updated_at: isString,
});

// Validate database results
const users = await db.query('SELECT * FROM users');
const validUsers = users.filter(isDatabaseUser);
```

### Configuration Validation

```typescript
import { isType, isString, isNumber, isBoolean } from 'guardz';

interface AppConfig {
  port: number;
  database: {
    host: string;
    port: number;
    name: string;
  };
  features: {
    auth: boolean;
    caching: boolean;
  };
}

const isAppConfig = isType<AppConfig>({
  port: isNumber,
  database: isType({
    host: isString,
    port: isNumber,
    name: isString,
  }),
  features: isType({
    auth: isBoolean,
    caching: isBoolean,
  }),
});

// Validate environment configuration
const config = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    name: process.env.DB_NAME || 'myapp',
  },
  features: {
    auth: process.env.AUTH_ENABLED === 'true',
    caching: process.env.CACHE_ENABLED === 'true',
  },
};

if (!isAppConfig(config)) {
  throw new Error('Invalid configuration');
}
```

## 🔧 Advanced Features

### Reusable Type Guard Patterns

Create reusable type guard functions for consistent validation patterns:

```typescript
import { isString, isNumber, isPositiveInteger, isType } from 'guardz';

// Create semantic type guards using existing functions
const isUserId = isPositiveInteger; // Already a reusable type guard
const isEmail = isString; // Already a reusable type guard
const isName = isString; // Already a reusable type guard

// Use them consistently across your application
interface User {
  id: number;        // Uses isUserId (isPositiveInteger)
  name: string;      // Uses isName (isString)
  email: string;     // Uses isEmail (isString)
}

const isUser = isType<User>({
  id: isUserId,
  name: isName,
  email: isEmail,
});
```

### Generic Types

For complex generic types with conditional properties, use factory functions with `isType`:

```typescript
import { isType, isString, isNumber, isUndefinedOr } from 'guardz';

// Define generic types with conditional properties
type ApiKeysSelect<T extends boolean = true> = {
  name: T extends true ? string : string | undefined;
  collectionPermissions: T extends true ? string : string | undefined;
  updatedAt: T extends true ? string : string | undefined;
  createdAt: T extends true ? string : string | undefined;
  enableAPIKey: T extends true ? boolean : boolean | undefined;
  apiKey: T extends true ? string : string | undefined;
  apiKeyIndex: T extends true ? number : number | undefined;
};

// Create type guard factory for generic types
export const isApiKeysSelect = <T extends boolean = true>(
  typeGuardT: TypeGuardFn<T>,
): TypeGuardFn<ApiKeysSelect<T>> =>
  isType<ApiKeysSelect<T>>({
    name: isUndefinedOr(typeGuardT),
    collectionPermissions: isUndefinedOr(typeGuardT),
    updatedAt: isUndefinedOr(typeGuardT),
    createdAt: isUndefinedOr(typeGuardT),
    enableAPIKey: isUndefinedOr(typeGuardT),
    apiKey: isUndefinedOr(typeGuardT),
    apiKeyIndex: isUndefinedOr(typeGuardT),
  });

// Usage
const isRequiredApiKeys = isApiKeysSelect(isString);
const isOptionalApiKeys = isApiKeysSelect(isUndefinedOr(isString));
```

**💡 Pro Tip**: For complex generic type validation with multiple conditional properties, consider using [guardz-generator](https://github.com/thiennp/guardz-generator) which automatically generates type guards for generic types and handles conditional properties efficiently.

#### Advanced Generic Patterns

```typescript
// Multiple generic parameters
type Container<T, U, V extends boolean = true> = {
  primary: T;
  secondary: U;
  metadata: V extends true ? { timestamp: number; version: string } : undefined;
};

// Factory for multiple generic parameters
export const isContainer = <T, U, V extends boolean = true>(
  primaryGuard: TypeGuardFn<T>,
  secondaryGuard: TypeGuardFn<U>,
  metadataGuard?: TypeGuardFn<{ timestamp: number; version: string }>,
): TypeGuardFn<Container<T, U, V>> =>
  isType<Container<T, U, V>>({
    primary: primaryGuard,
    secondary: secondaryGuard,
    metadata: metadataGuard ? isUndefinedOr(metadataGuard) : undefined,
  });

// Usage
const isStringNumberContainer = isContainer(isString, isNumber);
const isStringNumberContainerWithMetadata = isContainer(
  isString,
  isNumber,
  isType({ timestamp: isNumber, version: isString })
);
```

### Performance Optimizations

```typescript
import { isType, isString, isNumber, isArrayWithEachItem } from 'guardz';

// Optimized for repeated validation
const isUser = isType({
  id: isNumber,
  name: isString,
  tags: isArrayWithEachItem(isString),
});

// Reuse the same guard instance
const users = [/* large array of user objects */];
const validUsers = users.filter(isUser); // Fast validation

// Use appropriate error modes for performance
const fastConfig = { errorMode: 'single' }; // Fastest
const detailedConfig = { errorMode: 'multi' }; // More detailed
const treeConfig = { errorMode: 'json' }; // Most detailed
```

## 🔄 Migration Guide

### From Zod

```typescript
// Zod
import { z } from 'zod';
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

// Guardz
import { isType, isNumber, isString } from 'guardz';
const isUser = isType({
  id: isNumber,
  name: isString,
  email: isString, // Add custom email validation if needed
});
```

### From Joi

```typescript
// Joi
import Joi from 'joi';
const userSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
});

// Guardz
import { isType, isNumber, isString } from 'guardz';
const isUser = isType({
  id: isNumber,
  name: isString,
  email: isString,
});
```

### From Yup

```typescript
// Yup
import * as yup from 'yup';
const userSchema = yup.object({
  id: yup.number().required(),
  name: yup.string().required(),
  email: yup.string().email().required(),
});

// Guardz
import { isType, isNumber, isString } from 'guardz';
const isUser = isType({
  id: isNumber,
  name: isString,
  email: isString,
});
```

## 🛠️ Troubleshooting

### Common Issues

#### TypeScript Errors

**Problem**: `Type 'unknown' is not assignable to parameter of type 'TypeGuardFn<T>'`

**Solution**: Ensure you're using the correct type guard function:

```typescript
// ❌ Wrong
const isUser = isType({
  id: isNumber, // This is correct
  name: 'string', // ❌ This is wrong - should be isString
});

// ✅ Correct
const isUser = isType({
  id: isNumber,
  name: isString, // ✅ Use the type guard function
});
```

#### Performance Issues

**Problem**: Validation is slow with large objects

**Solution**: Use appropriate error modes and optimize validation:

```typescript
// ❌ Slow - collects all errors
const result = isUser(data, { errorMode: 'multi' });

// ✅ Fast - stops at first error
const result = isUser(data, { errorMode: 'single' });

// ✅ Fastest - no error collection
const result = isUser(data);
```

#### Bundle Size Issues

**Problem**: Large bundle size

**Solution**: Use tree shaking and import only what you need:

```typescript
// ❌ Imports everything
import * as guardz from 'guardz';

// ✅ Only imports what you need
import { isType, isString, isNumber } from 'guardz';
```

### Debugging

Enable detailed error reporting:

```typescript
const errors: string[] = [];
const config = {
  identifier: 'user',
  callbackOnError: (error: string) => {
    errors.push(error);
    console.log('Validation error:', error);
  },
  errorMode: 'multi',
};

const result = isUser(data, config);
console.log('All errors:', errors);
```

## ⚡ Performance Tips

### Error Mode Selection

- **`single`** (default): Fastest, stops at first error
- **`multi`**: Medium speed, collects all errors with details
- **`json`**: Slowest, provides hierarchical error tree structure

### Validation Strategies

```typescript
// For production - fast validation
const isUserFast = isType({
  id: isNumber,
  name: isString,
  email: isString,
});

// For development - detailed errors
const isUserDev = isType({
  id: isNumber,
  name: isString,
  email: isString,
});

// Usage
const config = process.env.NODE_ENV === 'production' 
  ? undefined 
  : { errorMode: 'multi', callbackOnError: console.error };
```

### Caching Type Guards

```typescript
// Create type guards once, reuse them
const isUser = isType({
  id: isNumber,
  name: isString,
  email: isString,
});

// Reuse the same guard instance
const validateUsers = (users: unknown[]) => {
  return users.filter(isUser);
};
```

## 🔧 API Reference

### Primitive Type Guards

- **`isString`** - Validates that a value is a string
- **`isNumber`** - Validates that a value is a valid number (excludes NaN)
- **`isBoolean`** - Validates that a value is a boolean
- **`isBigInt`** - Validates that a value is a BigInt
- **`isFunction`** - Validates that a value is a function (including regular functions, arrow functions, class constructors, and methods)
- **`isSymbol`** - Validates that a value is a Symbol

### Special Type Guards

- **`isAsserted`** - Always returns true and asserts value is T (useful for 3rd party types without runtime validation)
- **`isEnum`** - Creates a type guard that checks if a value matches any value from an enum
- **`isEqualTo`** - Creates a type guard that checks if a value is exactly equal to a specific value using strict equality (===)
- **`isRegex`** - Validates that a value is a RegExp object
- **`isPattern<P>`** - Creates a type guard that validates strings against a regex pattern and returns a branded type

### Array Type Guards

- **`isArrayWithEachItem<T>(typeGuard: TypeGuardFn<T>)`** - Creates a type guard that validates arrays where each item matches a specific type
- **`isNonEmptyArray`** - Validates that a value is a non-empty array
- **`isNonEmptyArrayWithEachItem<T>(typeGuard: TypeGuardFn<T>)`** - Creates a type guard that validates non-empty arrays where each item matches a specific type

### Object Type Guards

- **`isNonNullObject`** - Validates that a value is a non-null object (excludes arrays)
- **`isType<T>(schema: Record<string, TypeGuardFn<any>>)`** - Creates a type guard that validates objects against a schema
- **`isObject<T>(schema: Record<string, TypeGuardFn<any>>)`** - Alias for isType - creates a type guard for a specific object shape
- **`isObjectWith<T>(schema: Record<string, TypeGuardFn<any>>)`** - Alias for isType - validates objects with specific properties
- **`isObjectWithEachItem<T>(typeGuard: TypeGuardFn<T>)`** - Creates a type guard that validates plain objects where each property value matches a specific type (only checks enumerable own properties)

### Number Type Guards

- **`isInteger`** - Validates that a value is an integer (whole number)
- **`isPositiveInteger`** - Validates that a value is a positive integer (greater than 0 and a whole number)
- **`isNegativeInteger`** - Validates that a value is a negative integer (less than 0 and a whole number)
- **`isNonNegativeInteger`** - Validates that a value is a non-negative integer (0 or greater and a whole number)
- **`isNonPositiveInteger`** - Validates that a value is a non-positive integer (0 or less and a whole number)
- **`isPositiveNumber`** - Validates that a value is a positive number (greater than 0)
- **`isNegativeNumber`** - Validates that a value is a negative number (less than 0)
- **`isNonNegativeNumber`** - Validates that a value is a non-negative number (0 or greater)
- **`isNonPositiveNumber`** - Validates that a value is a non-positive number (0 or less)
- **`isNumeric`** - Validates that a value is numeric (a number or a string that can be converted to a number)
- **`isDateLike`** - Validates that a value can be treated as a Date (Date object, date string, or numeric timestamp)

### String Type Guards

- **`isNonEmptyString`** - Validates that a value is a non-empty string (trims whitespace, so strings containing only whitespace are considered empty)

### Null/Undefined Type Guards

- **`isNil`** - Validates that a value is null or undefined
- **`isNullOr`** - Creates a type guard that validates if a value is either null or matches a specific type
- **`isUndefinedOr`** - Creates a type guard that validates if a value is either undefined or matches a specific type
- **`isNilOr`** - Creates a type guard that validates if a value is either of type T, null, or undefined

### Union Type Guards

- **`isOneOf`** - Creates a type guard that checks if a value matches one of several specific values using strict equality (===)
- **`isOneOfTypes`** - Creates a type guard that checks if a value matches at least one of several type guards

### Web API Type Guards

- **`isDate`** - Validates that a value is a valid Date object (excludes invalid dates like `new Date("invalid")`)
- **`isError`** - Validates that a value is an Error object
- **`isBlob`** - Validates that a value is a Blob object
- **`isFile`** - Validates that a value is a File object
- **`isFileList`** - Validates that a value is a FileList object
- **`isFormData`** - Validates that a value is a FormData object
- **`isURL`** - Validates that a value is a URL object
- **`isURLSearchParams`** - Validates that a value is a URLSearchParams object

### Collection Type Guards

- **`isMap`** - Validates that a value is a Map object
- **`isSet`** - Validates that a value is a Set object
- **`isIndexSignature`** - Creates a type guard that validates objects with index signatures (objects with dynamic keys of a specific type and values of a specific type)

### Utility Type Guards

- **`isUnknown`** - Always returns true (useful for unknown types)
- **`isAny`** - Always returns true (useful for any types)
- **`isDefined`** - Validates that a value is defined (not null/undefined)
- **`isBooleanLike`** - Validates that a value can be treated as a boolean (boolean, "true"/"false", "1"/"0", or 1/0)
- **`isExtensionOf`** - Creates a type guard for types that extend a base type by combining a base type guard with validation for additional properties (useful for inheritance patterns)
- **`isIntersectionOf`** - Creates a type guard that validates a value against multiple type guards, ensuring the value satisfies all of them
- **`isPartialOf`** - Creates a type guard that validates partial objects matching a specific type (allows missing properties)
- **`isTuple`** - Creates a type guard that validates tuples (fixed-length arrays with specific types at each position)

### Schema Type Guards

- **`isSchema`** - Creates a type guard function for object schemas with improved nested type support (automatically handles nested structures)
- **`isShape`** - Alias for isSchema
- **`isNestedType`** - Alias for isSchema

### Advanced Type Guards

- **`isBranded`** - Creates a type guard function for a branded type using a predicate function (validates and narrows to branded types)
- **`guardWithTolerance`** - Validates data against a type guard but returns the data regardless of validation result (useful for logging errors while proceeding with potentially invalid data)

### Type Guard Error Generation

- **`generateTypeGuardError`** - Generates error messages for type guard failures

### Utility Types

- **`PredicateFn`** - A predicate function that validates a value and returns true if valid, false otherwise

### Type Converters

- **`toNumber`** - Converts a Numeric value to a number (safely converts validated numeric values)
- **`toDate`** - Converts a DateLike value to a Date object (safely converts validated date values)
- **`toBoolean`** - Converts a BooleanLike value to a boolean (safely converts validated boolean values)

### Validation Types

- **`ValidationError`** - Error type for validation failures with path, expected type, actual value, and message
- **`ValidationTree`** - Tree structure for hierarchical validation errors
- **`ValidationResult`** - Result type for validation operations with validity status and errors
- **`ValidationContext`** - Context type for validation operations with path and configuration

### Branded Types

- **`Branded<T, B>`** - Branded type with a specific brand identifier (supports string and unique symbol brands)
- **`BrandSymbols`** - Predefined brand symbols for common use cases
- **`BrandedWith<T, K>`** - Utility type to create branded types with predefined symbols
- **`NonEmptyArray<T>`** - Array type that cannot be empty
- **`NonEmptyString`** - String type that cannot be empty
- **`PositiveNumber`** - Number type that must be positive
- **`NegativeNumber`** - Number type that must be negative
- **`NonNegativeNumber`** - Number type that must be non-negative
- **`NonPositiveNumber`** - Number type that must be non-positive
- **`PositiveInteger`** - Integer type that must be positive
- **`NegativeInteger`** - Integer type that must be negative
- **`NonNegativeInteger`** - Integer type that must be non-negative
- **`NonPositiveInteger`** - Integer type that must be non-positive
- **`Integer`** - Integer type
- **`Nullable<T>`** - Type that can be null
- **`Numeric`** - Numeric type (number or string that can be converted to number)
- **`DateLike`** - Date-like type (Date object, date string, or numeric timestamp)
- **`BooleanLike`** - Boolean-like type (boolean, "true"/"false", "1"/"0", or 1/0)
- **`Pattern<P>`** - Branded string type that matches a specific regex pattern

## 🛠️ Error Generation

Guardz provides detailed error reporting with configurable error handling:

```typescript
import { isType, isString, isNumber } from 'guardz';

const errors: string[] = [];
const config = {
  identifier: 'user',
  callbackOnError: (error: string) => errors.push(error),
  errorMode: 'multi', // 'single' | 'multi' | 'json'
};

const isUser = isType({
  name: isString,
  age: isNumber,
});

const invalidUser = { name: 123, age: 'thirty' };
const result = isUser(invalidUser, config);

console.log(errors);
// [
//   'user.name: Expected string, got number (123)',
//   'user.age: Expected number, got string ("thirty")'
// ]
```

### Error Modes

- **`single`** - Basic error messages (default)
- **`multi`** - Detailed error messages with values
- **`json`** - Hierarchical error tree structure

## 🎯 Utility Types

Guardz provides utility types for enhanced type safety:

```typescript
import type { TypeGuardFn, TypeGuardFnConfig } from 'guardz';

// TypeGuardFn<T> - Type guard function type
// TypeGuardFnConfig - Configuration for type guards
```

## 🔐 Unique Symbol Branded Types

Guardz supports branded types with unique symbols for enhanced type safety:

```typescript
import { isBranded, Branded, BrandSymbols, type BrandedWith } from 'guardz';

// Custom unique symbol brands
const UserIdBrand = Symbol('UserId');
type UserId = Branded<number, typeof UserIdBrand>;

const isUserId = isBranded<UserId>((value) => {
  return typeof value === 'number' && value > 0 && Number.isInteger(value);
});

// Predefined brand symbols
type Email = BrandedWith<string, 'Email'>;
const isEmail = isBranded<Email>((value) => {
  if (typeof value !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
});

// Usage
const id: unknown = 123;
if (isUserId(id)) {
  // id is now typed as UserId (number & { readonly brand: typeof UserIdBrand })
  console.log(id);
}
```



## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/thiennp/guardz.git
cd guardz
npm install
npm test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📚 Documentation

- **API Reference**: [GitHub README](https://github.com/thiennp/guardz#readme)
- **Showcases**: [Complete TypeScript Examples](docs/showcases.md) - All possible TypeScript cases and real-world scenarios
- **Examples**: [Practical Usage Examples](examples/) - Ready-to-run code samples
- **CHANGELOG**: [Version History](CHANGELOG.md) - Latest updates and changes

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/thiennp/guardz/issues)
- **Discussions**: [GitHub Discussions](https://github.com/thiennp/guardz/discussions)
- **Email**: nguyenphongthien@gmail.com

## 🔗 Related Projects

- **[guardz-generator](https://github.com/thiennp/guardz-generator)** - Code generator for complex type guards and generic types
- **[guardz-cli](https://github.com/thiennp/guardz-cli)** - Command-line interface for Guardz
- **[guardz-vscode](https://github.com/thiennp/guardz-vscode)** - VS Code extension for Guardz

## 🙏 Acknowledgments

Thanks to all contributors and the TypeScript community for making this project possible.

---

**Made with ❤️ by the Guardz Team**
