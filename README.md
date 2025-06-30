# 🛡️ Guardz

[![NPM Version](https://img.shields.io/npm/v/guardz)](https://www.npmjs.com/package/guardz)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/thiennp/guardz/actions/workflows/ci.yml/badge.svg)](https://github.com/thiennp/guardz/actions/workflows/ci.yml)

A simple and lightweight TypeScript type guard library for runtime type validation.

> **Runtime type guards, powered by TypeScript — not reinventing types, just enforcing them.**

Guardz is a minimal, composable runtime type-checking library for TypeScript.  
It does **one thing** and does it well: **assert that values match your types, without the weight of a full schema validator.**

- ✅ Zero transformation  
- ✅ Fully type-safe  
- ✅ Human-readable guards  
- ✅ Tiny and dependency-free  
---

## 🚀 Why Guardz?

TypeScript types vanish at runtime. That’s where Guardz steps in.  
Unlike schema validators that require re-declaring types, Guardz uses **your existing TS types as the source of truth**, matching values without coercion.

📚 [Read: "Assert Nothing, Guard Everything"](https://medium.com/p/0b3e4388ae78)

---

## 📦 Installation

```bash
npm install guardz
# or
yarn add guardz
```

## Usage

### Basic Type Guards

Start with simple primitive type checking:

```typescript
import { isString } from 'guardz';

const data: unknown = getDataFromSomewhere();

if (isString(data)) { // data type is narrowed to string
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
})

if (isUser(data)) { // data type is narrowed to { name: string, age: string }
  console.log(`Name: ${data.name}`);
  console.log(`Age: ${data.age}`);
}
```

### Array Type Guards

Validate arrays with specific item types:

```typescript
import { isArrayWithEachItem, isNumber } from 'guardz';

const data: unknown = getDataFromSomewhere()
if (isArrayWithEachItem(isNumber)(data)) { // data type is narrowed to number[]
  console.log(data.map((item) => item.toFixed(2)))
}
```

### Object Property Type Guards

Validate object properties with specific value types:

```typescript
import { isObjectWithEachItem, isNumber } from 'guardz';

const data: unknown = getDataFromSomewhere()
if (isObjectWithEachItem(isNumber)(data)) { // data type is narrowed to Record<string, number | undefined>
  console.log(data.something?.toFixed(2))
}
```

### Union Type Guards

Handle multiple possible types:

```typescript
import { isNumber, isString, isOneOfTypes } from 'guardz';

const data: unknown = getDataFromSomewhere()
if (isOneOfTypes<number | string>(isNumber, isString)(data)) { // data type is narrowed to string | number
  return isNumber(data) ? data.toFixed(2) : data;
}
```

### Nullable Type Guards

Handle null values:

```typescript
import { isNullOr, isString } from 'guardz';

const data: unknown = getDataFromSomewhere()
if (isNullOr(isString)(data)) { // data type is narrowed to string | null
  return data?.toUpperCase();
}
```

### Optional Type Guards

Handle undefined values:

```typescript
import { isUndefinedOr, isString } from 'guardz';

const data: unknown = getDataFromSomewhere()
if (isUndefinedOr(isString)(data)) { // data type is narrowed to string | undefined
  return data?.toUpperCase();
}
```

### Combined Nullable and Optional Types

Handle both null and undefined values:

```typescript
import { isUndefinedOr, isNullOr, isString } from 'guardz';

const data: unknown = getDataFromSomewhere()
if (isUndefinedOr(isNullOr(isString))(data)) { // data type is narrowed to string | undefined | null
  return data?.toUpperCase();
}
```

### Complex Nested Type Guards

Create type guards for deeply nested structures:

```typescript
import { isUndefinedOr, isString, isEnum, isEqualTo, isNumber, isOneOfTypes, isArrayWithEachItem, isType } from 'guardz';

enum PriceTypeEnum {
  FREE = 'free',
  PAID = 'paid'
}

type Book = {
  title: string;
  price: PriceTypeEnum,
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
  }>
}

const data: unknown = getDataFromSomewhere()

const isBook = isType<Book>({
  title: isString,
  price: isEnum(PriceTypeEnum),
  author: isType({
    name: isString,
    email: isUndefinedOr(isString),
  }),
  chapters: isArrayWithEachItem(isType({
    content: isString,
    startPage: isNumber,
  })),
  rating: isArrayWithEachItem(isType({
    userId: isString,
    average: isOneOfTypes<number | 'N/A'>(isNumber, isEqualTo('N/A'))
  })),
})

if (isBook(data)) { // data type is narrowed to Book
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
  callbackOnError: (error) => console.error('Validation error:', error)
});
```

## API Reference

Below is a comprehensive list of all type guards provided by `guardz`.

### Core Functions

- **isType<T>(propsTypesToCheck: { [P in keyof T]: TypeGuardFn<T[P]> }): TypeGuardFn<T>**
  Creates a type guard function for a specific object shape `T`. It checks if a value is a non-null object and verifies that each property specified in `propsTypesToCheck` conforms to its corresponding type guard function.

- **guardWithTolerance<T>(data: unknown, typeGuardFn: TypeGuardFn<T>, config?: Nullable<TypeGuardFnConfig>): T**
  Validates data using the provided type guard function. If validation fails, it still returns the data as the expected type but logs errors through the config callback.

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

### Object Type Guards

- **isNonNullObject** - Checks if a value is a non-null object (excludes arrays)
- **isObjectWithEachItem** - Checks if a value is an object where each property value matches a specific type
- **isPartialOf** - Checks if a value is a partial object matching a specific type

### String Type Guards

- **isNonEmptyString** - Checks if a value is a non-empty string

### Number Type Guards

- **isNonNegativeNumber** - Checks if a value is a non-negative number
- **isPositiveNumber** - Checks if a value is a positive number

### Union Type Guards

- **isOneOf** - Checks if a value matches one of several specific values
- **isOneOfTypes** - Checks if a value matches one of several type guards

### Nullable/Optional Type Guards

- **isNullOr** - Checks if a value is null or matches a specific type
- **isUndefinedOr** - Checks if a value is undefined or matches a specific type

### Special Type Guards

- **isEnum** - Checks if a value matches any value from an enum
- **isEqualTo** - Checks if a value exactly equals a specific value

### Utility Types

- **NonEmptyArray<T>** - Type for non-empty arrays
- **NonEmptyString** - Type for non-empty strings
- **NonNegativeNumber** - Type for non-negative numbers
- **Nullable<T>** - Type for values that can be null
- **PositiveNumber** - Type for positive numbers

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
