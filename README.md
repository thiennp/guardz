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
import { isString, isNumber, isType, isArrayWithEachItem } from 'guardz';

// Basic validation
const isValid = isString('hello'); // true

// Object validation
const isUser = isType({
  id: isNumber,
  name: isString,
  email: isString,
});

const user = { id: 1, name: 'John', email: 'john@example.com' };
console.log(isUser(user)); // true
```

## ✨ Features

- **Comprehensive Type Guards**: 50+ built-in type guards for all JavaScript types
- **Advanced Validation**: Array validation, object validation, union types, and more
- **Error Reporting**: Detailed error messages with configurable error handling
- **Performance Optimized**: Fast validation with minimal overhead
- **TypeScript First**: Full type safety with exact type inference
- **Zero Dependencies**: Lightweight with no external dependencies
- **Tree Shaking**: Optimized for bundle size with tree shaking support

## 📚 Documentation

### Basic Type Guards

```typescript
import { isString, isNumber, isBoolean, isArray, isObject } from 'guardz';

isString('hello');        // true
isNumber(42);            // true
isBoolean(true);         // true
isArray([1, 2, 3]);     // true
isObject({ key: 'value' }); // true
```

### Object Validation

```typescript
import { isType, isString, isNumber, isPositiveInteger } from 'guardz';

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
  age: isNumber, // optional
});

const user = { id: 1, name: 'John', email: 'john@example.com' };
console.log(isUser(user)); // true
```

### Array Validation

```typescript
import { isArrayWithEachItem, isString, isNumber } from 'guardz';

const isStringArray = isArrayWithEachItem(isString);
const isNumberArray = isArrayWithEachItem(isNumber);

console.log(isStringArray(['a', 'b', 'c'])); // true
console.log(isNumberArray([1, 2, 3])); // true
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
};

const isUser = isType({
  name: isString,
  age: isNumber,
});

const invalidUser = { name: 123, age: 'thirty' };
const result = isUser(invalidUser, config);

console.log(result); // false
console.log(errors); // ['user.name: Expected string, got number', 'user.age: Expected number, got string']
```

## 🎯 Common Use Cases

### API Response Validation

```typescript
import { isType, isString, isNumber, isArrayWithEachItem } from 'guardz';

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
  status: isString, // Could use isOneOf for exact values
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

**💡 Pro Tip**: For complex generic type validation with multiple conditional properties, consider using [guardz-generator](https://github.com/your-org/guardz-generator) which automatically generates type guards for generic types and handles conditional properties efficiently.

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
const fastConfig = { errorMode: 'simple' }; // Fastest
const detailedConfig = { errorMode: 'detailed' }; // More detailed
const treeConfig = { errorMode: 'tree' }; // Most detailed
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
const result = isUser(data, { errorMode: 'detailed' });

// ✅ Fast - stops at first error
const result = isUser(data, { errorMode: 'simple' });

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
  errorMode: 'detailed',
};

const result = isUser(data, config);
console.log('All errors:', errors);
```

## ⚡ Performance Tips

### Error Mode Selection

- **`simple`** (default): Fastest, stops at first error
- **`detailed`**: Medium speed, collects all errors with details
- **`tree`**: Slowest, provides hierarchical error structure

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
  : { errorMode: 'detailed', callbackOnError: console.error };
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

- **`isString`** - Validates string values
- **`isNumber`** - Validates number values
- **`isBoolean`** - Validates boolean values
- **`isBigInt`** - Validates BigInt values
- **`isSymbol`** - Validates Symbol values
- **`isFunction`** - Validates function values
- **`isObject`** - Validates object values (excluding null)

### Special Type Guards

- **`isAsserted`** - Always returns true and asserts value is T (useful for 3rd party types without runtime validation)
- **`isEnum`** - Checks if a value matches any value from an enum
- **`isEqualTo`** - Checks if a value exactly equals a specific value

### Array Type Guards

- **`isArray`** - Validates arrays
- **`isArrayWithEachItem<T>(typeGuard: TypeGuardFn<T>)`** - Validates arrays where each item matches a type guard
- **`isNonEmptyArray`** - Validates non-empty arrays
- **`isNonEmptyArrayWithEachItem<T>(typeGuard: TypeGuardFn<T>)`** - Validates non-empty arrays where each item matches a type guard

### Object Type Guards

- **`isObject`** - Validates objects (excluding null)
- **`isNonNullObject`** - Validates non-null objects
- **`isType<T>(schema: Record<string, TypeGuardFn<any>>)`** - Validates objects against a schema
- **`isObjectWith<T>(schema: Record<string, TypeGuardFn<any>>)`** - Validates objects with specific properties
- **`isObjectWithEachItem<T>(typeGuard: TypeGuardFn<T>)`** - Validates objects where each property value matches a type guard

### Number Type Guards

- **`isInteger`** - Validates integers
- **`isPositiveInteger`** - Validates positive integers
- **`isNegativeInteger`** - Validates negative integers
- **`isNonNegativeInteger`** - Validates non-negative integers
- **`isNonPositiveInteger`** - Validates non-positive integers
- **`isPositiveNumber`** - Validates positive numbers
- **`isNegativeNumber`** - Validates negative numbers
- **`isNonNegativeNumber`** - Validates non-negative numbers
- **`isNonPositiveNumber`** - Validates non-positive numbers

### String Type Guards

- **`isNonEmptyString`** - Validates non-empty strings

### Null/Undefined Type Guards

- **`isNil`** - Validates null or undefined
- **`isNullOr`** - Validates null or a specific type
- **`isUndefinedOr`** - Validates undefined or a specific type
- **`isNilOr`** - Validates null/undefined or a specific type

### Union Type Guards

- **`isOneOf`** - Validates if a value equals one of the provided values
- **`isOneOfTypes`** - Validates if a value matches one of the provided type guards

### Web API Type Guards

- **`isDate`** - Validates Date objects
- **`isError`** - Validates Error objects
- **`isMap`** - Validates Map objects
- **`isSet`** - Validates Set objects
- **`isBlob`** - Validates Blob objects
- **`isFile`** - Validates File objects
- **`isFileList`** - Validates FileList objects
- **`isFormData`** - Validates FormData objects
- **`isURL`** - Validates URL objects
- **`isURLSearchParams`** - Validates URLSearchParams objects

### Utility Type Guards

- **`isUnknown`** - Always returns true (useful for unknown types)
- **`isAny`** - Always returns true (useful for any types)
- **`isDefined`** - Validates defined values (not null/undefined)
- **`isExtensionOf`** - Validates if an object extends a base object
- **`isIntersectionOf`** - Validates if a value matches all provided type guards
- **`isPartialOf`** - Validates if an object is a partial of a base object
- **`isTuple`** - Validates tuples with specific types
- **`isType`** - Validates objects against a type schema

## 🛠️ Error Generation

Guardz provides detailed error reporting with configurable error handling:

```typescript
import { isType, isString, isNumber } from 'guardz';

const errors: string[] = [];
const config = {
  identifier: 'user',
  callbackOnError: (error: string) => errors.push(error),
  errorMode: 'detailed', // 'simple' | 'detailed' | 'tree'
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

- **`simple`** - Basic error messages
- **`detailed`** - Detailed error messages with values
- **`tree`** - Hierarchical error tree structure

## 🎯 Utility Types

Guardz provides utility types for enhanced type safety:

```typescript
import type { TypeGuardFn, TypeGuardFnConfig } from 'guardz';

// TypeGuardFn<T> - Type guard function type
// TypeGuardFnConfig - Configuration for type guards
```

## 📦 Installation

```bash
# npm
npm install guardz

# yarn
yarn add guardz

# pnpm
pnpm add guardz
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/your-org/guardz.git
cd guardz
npm install
npm test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Full API Reference](https://guardz.dev)
- **Issues**: [GitHub Issues](https://github.com/your-org/guardz/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/guardz/discussions)
- **Email**: support@guardz.dev

## 🔗 Related Projects

- **[guardz-generator](https://github.com/your-org/guardz-generator)** - Code generator for complex type guards and generic types
- **[guardz-cli](https://github.com/your-org/guardz-cli)** - Command-line interface for Guardz
- **[guardz-vscode](https://github.com/your-org/guardz-vscode)** - VS Code extension for Guardz

## 🙏 Acknowledgments

Thanks to all contributors and the TypeScript community for making this project possible.

---

**Made with ❤️ by the Guardz Team**