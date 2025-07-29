# Guardz Examples

This directory contains comprehensive examples demonstrating Guardz's capabilities.

## Examples Overview

### Basic Examples
- **`basic-usage.ts`** - Essential type guard patterns and usage
- **`string-validation.ts`** - String-specific validation techniques
- **`number-validation.ts`** - Number validation with constraints
- **`array-validation.ts`** - Array validation patterns
- **`object-aliases-simple.ts`** - Object validation with type aliases

### Advanced Examples
- **`advanced-features.ts`** - Complex validation scenarios
- **`union-and-composite.ts`** - Union types and composite validation
- **`nullable-and-special.ts`** - Handling null, undefined, and special cases
- **`utility-types.ts`** - Utility type guard patterns

### Error Handling Examples
- **`error-modes-demo.ts`** - Different error reporting modes
- **`error-modes-comprehensive.ts`** - Comprehensive error handling
- **`multiple-errors-simple.ts`** - Multiple error collection
- **`json-tree-errors-simple.ts`** - Tree-structured error reporting

### Performance and Compatibility
- **`performance-optimizations.ts`** - Performance best practices
- **`backward-compatibility.ts`** - Backward compatibility patterns
- **`web-api-validation.ts`** - Web API type validation

## Running Examples

### Run All Examples
```bash
npm run examples
```

### Run Individual Examples
```bash
# Basic usage
npx ts-node examples/basic-usage.ts

# String validation
npx ts-node examples/string-validation.ts

# Advanced features
npx ts-node examples/advanced-features.ts

# Error handling
npx ts-node examples/error-modes-demo.ts
```

## Example Categories

### 🚀 Getting Started
Start with `basic-usage.ts` to understand core concepts.

### 🔧 Advanced Patterns
Explore `advanced-features.ts` and `union-and-composite.ts` for complex scenarios.

### 🛠️ Error Handling
Learn error reporting with `error-modes-demo.ts` and `error-modes-comprehensive.ts`.

### ⚡ Performance
Optimize your code with `performance-optimizations.ts`.

### 🌐 Web APIs
Handle web APIs with `web-api-validation.ts`.

## Contributing Examples

When adding new examples:

1. Follow the existing naming convention
2. Include comprehensive comments
3. Demonstrate real-world usage patterns
4. Add to the appropriate category in this README
5. Update the `run-all.ts` file to include your example

## Generic Types

For complex generic type validation, consider using [guardz-generator](https://github.com/your-org/guardz-generator) which handles generic types and conditional properties automatically.

Example pattern for generic types:
```typescript
import { isType, isString, isNumber, isUndefinedOr } from 'guardz';

// Define generic types with conditional properties
type ApiKeysSelect<T extends boolean = true> = {
  name: T extends true ? string : string | undefined;
  // ... other conditional properties
};

// Create type guard factory
export const isApiKeysSelect = <T extends boolean = true>(
  typeGuardT: TypeGuardFn<T>,
): TypeGuardFn<ApiKeysSelect<T>> =>
  isType<ApiKeysSelect<T>>({
    name: isUndefinedOr(typeGuardT),
    // ... other properties
  });
```
