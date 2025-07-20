# GuardZ Examples

> **Structured error messages and custom error handling are core features of GuardZ.**
> Every type guard can provide detailed, field-specific error messages for debugging, user feedback, and logging.

This folder contains comprehensive examples demonstrating how to use the GuardZ TypeScript type guard library, with a special focus on error handling.

## Why Error Handling is Core

- 🛑 **Structured error messages**: Instantly know what failed, where, and why.
- 🔗 **Custom error handling**: Integrate with your logging, monitoring, or UI error display with a simple callback.
- 🧩 **Field-level and nested errors**: Get precise error paths for deeply nested objects.

## Examples Overview

### 1. `basic-usage.ts`

Demonstrates fundamental type guard functions for primitive types and shows how to use error handling.

### 2. `array-validation.ts`

Shows how to validate arrays and tuples, and how to collect errors for each item.

### 3. `number-validation.ts`

Comprehensive number validation examples, including error reporting for invalid numbers.

### 4. `string-validation.ts`

String validation and formatting examples, with error handling for invalid strings.

### 5. `union-and-composite.ts`

Advanced type composition examples, including error aggregation for union/intersection types.

### 6. `nullable-and-special.ts`

Nullable and special type guard examples, with error messages for null/undefined handling.

### 7. `utility-types.ts`

Demonstrates GuardZ utility types and how to combine them with runtime error reporting.

### 8. `web-api-validation.ts`

Web API type guard examples for File, FileList, Blob, FormData, URL, and URLSearchParams validation with environment-aware detection.

### 9. `advanced-features.ts`

Advanced features and best practices, including custom error handlers, error aggregation, and error handling in deeply nested structures.

## Running the Examples

### Prerequisites

Make sure you have the required dependencies installed:

```bash
npm install
```

### Method 1: Run Individual Examples (Recommended)

Use ts-node with path alias resolution to run any example:

```bash
# Basic usage example
npx ts-node -r tsconfig-paths/register examples/basic-usage.ts

# Array validation example
npx ts-node -r tsconfig-paths/register examples/array-validation.ts

# Number validation example
npx ts-node -r tsconfig-paths/register examples/number-validation.ts

# String validation example
npx ts-node -r tsconfig-paths/register examples/string-validation.ts

# Union and composite types example
npx ts-node -r tsconfig-paths/register examples/union-and-composite.ts

# Nullable and special types example
npx ts-node -r tsconfig-paths/register examples/nullable-and-special.ts

# Utility types example
npx ts-node -r tsconfig-paths/register examples/utility-types.ts

# Web API validation example
npx ts-node -r tsconfig-paths/register examples/web-api-validation.ts

# Advanced features example
npx ts-node -r tsconfig-paths/register examples/advanced-features.ts
```

### Method 2: Run All Examples at Once

Execute all examples sequentially:

```bash
npx ts-node -r tsconfig-paths/register examples/run-all.ts
```

### Method 3: Using TypeScript Compiler (Alternative)

If you prefer to compile first, then run:

```bash
# Compile and run a single example
npx tsc examples/basic-usage.ts && node examples/basic-usage.js

# Compile and run all examples
npx tsc examples/run-all.ts && node examples/run-all.js
```

### Important Notes

- **Path Aliases**: The `-r tsconfig-paths/register` flag is **required** to resolve the `@/` path aliases used in the GuardZ source code
- **Error Output**: Each example demonstrates structured error handling - watch the console output to see detailed error messages
- **Type Safety**: All examples are fully type-safe and will show TypeScript errors if you modify them incorrectly

## Key Concepts Demonstrated

### 1. Structured Error Handling (Core Feature)

Every type guard can provide detailed, field-specific error messages:

```typescript
import { isString, isNumber } from '../src';

const errors: string[] = [];
const config = {
  identifier: 'user',
  callbackOnError: (error: string) => errors.push(error),
};

const isUser = isType({ name: isString, age: isNumber });
const result = isUser({ name: 'John', age: '30' }, config);
// errors now contains: [ 'Expected user.age ("30") to be "number"' ]
```

- **Debugging**: Instantly see which field failed and why
- **User Feedback**: Show clear, actionable error messages in your UI
- **Logging/Monitoring**: Integrate with your error tracking systems
- **Testing**: Assert on specific error messages in your tests

### 2. Type Guard Functions

Type guards validate data at runtime and provide TypeScript type narrowing.

### 3. Higher-Order Type Guards

Reusable type guards for complex validation.

### 4. Union and Intersection Types

Combine multiple type guards for complex validation and error aggregation.

### 5. Utility Types

Use branded types for compile-time safety, combined with runtime error reporting.

## Best Practices

1. **Always use error handling in production**: Pass a config with `callbackOnError` to every type guard.
2. **Aggregate errors for user feedback**: Collect all errors and display them in your UI or logs.
3. **Test error messages**: Assert on specific error messages in your tests for robust validation.

## See Also

- Main [README.md](../README.md) for API and philosophy
