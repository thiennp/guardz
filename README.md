# 🛡️ Guardz

[![NPM Version](https://img.shields.io/npm/v/guardz)](https://www.npmjs.com/package/guardz)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/thiennp/guardz/actions/workflows/ci.yml/badge.svg)](https://github.com/thiennp/guardz/actions/workflows/ci.yml)

A simple and lightweight TypeScript type guard library for runtime type validation.

> **Runtime type guards, powered by TypeScript — not reinventing types, just enforcing them.**

### Sample
[Codesandbox](https://codesandbox.io/p/live/c8c7f6fd-480e-43f2-b211-bd9962f54be5)

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

### Composite Type Guards

Handle complex type relationships like intersections and extensions:

```typescript
import { isIntersectionOf, isExtensionOf, isType, isString, isNumber } from 'guardz';

// For intersection types (Type A & Type B)
interface Person {
  name: string;
  age: number;
}

interface Employee {
  employeeId: string;
  department: string;
}

type PersonEmployee = Person & Employee;

const isPerson = isType<Person>({ name: isString, age: isNumber });
const isEmployee = isType<Employee>({ employeeId: isString, department: isString });
const isPersonEmployee = isIntersectionOf(isPerson, isEmployee);

const data: unknown = getDataFromSomewhere();
if (isPersonEmployee(data)) { // data type is narrowed to PersonEmployee
  console.log(`${data.name} works in ${data.department}`);
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
  managedTeamSize: isNumber
});

const isManager = isExtensionOf(isPerson, isManagerFull);

if (isManager(data)) { // data type is narrowed to Manager
  console.log(`Manager ${data.name} manages ${data.managedTeamSize} people`);
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
import { isUndefinedOr, isNullOr, isNilOr, isString } from 'guardz';

// Method 1: Using isNilOr (recommended for brevity)
const data: unknown = getDataFromSomewhere()
if (isNilOr(isString)(data)) { // data type is narrowed to string | null | undefined
  return data?.toUpperCase();
}

// Method 2: Explicit composition (equivalent to isNilOr)
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

### Additional Type Guards

#### Integer Validation

Validate that a value is an integer number:

```typescript
import { isInteger } from 'guardz';

const data: unknown = getDataFromSomewhere();
if (isInteger(data)) { // data type is narrowed to number
  console.log(`User ID: ${data}`); // Safe to use as integer
}
```

#### Tuple Validation

Validate fixed-length arrays with specific types at each position:

```typescript
import { isTuple, isString, isNumber } from 'guardz';

const data: unknown = getDataFromSomewhere();
// Check for [string, number] tuple
if (isTuple([isString, isNumber])(data)) { // data type is narrowed to [string, number]
  const [name, age] = data;
  console.log(`${name} is ${age} years old`);
}
```

#### BigInt Validation

Validate BigInt values for large numbers:

```typescript
import { isBigInt } from 'guardz';

const data: unknown = getDataFromSomewhere();
if (isBigInt(data)) { // data type is narrowed to bigint
  console.log(`Large number: ${data}`);
}
```

#### Additional Number Type Guards

Validate specific number ranges:

```typescript
import { isNonPositiveNumber, isNegativeNumber } from 'guardz';

// Non-positive numbers (≤ 0) - includes zero
const data1: unknown = getDataFromSomewhere();
if (isNonPositiveNumber(data1)) { // data1 type is narrowed to NonPositiveNumber
  console.log(`Value is zero or negative: ${data1}`);
}

// Negative numbers (< 0) - excludes zero
const data2: unknown = getDataFromSomewhere();
if (isNegativeNumber(data2)) { // data2 type is narrowed to NegativeNumber
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
  isNonPositiveInteger 
} from 'guardz';

// Positive integers (> 0 and whole numbers)
const userId: unknown = getUserInput();
if (isPositiveInteger(userId)) { // userId type is narrowed to PositiveInteger
  console.log(`User ID: ${userId}`); // Safe for database primary keys
}

// Non-negative integers (≥ 0 and whole numbers) 
const arrayIndex: unknown = getArrayIndex();
if (isNonNegativeInteger(arrayIndex)) { // arrayIndex type is narrowed to NonNegativeInteger
  console.log(`Array index: ${arrayIndex}`); // Safe for 0-based indexing
}

// Negative integers (< 0 and whole numbers)
const errorCode: unknown = getErrorCode();
if (isNegativeInteger(errorCode)) { // errorCode type is narrowed to NegativeInteger
  console.log(`Error code: ${errorCode}`); // Safe for negative error codes
}

// Non-positive integers (≤ 0 and whole numbers)
const floorLevel: unknown = getFloorLevel();
if (isNonPositiveInteger(floorLevel)) { // floorLevel type is narrowed to NonPositiveInteger
  console.log(`Floor level: ${floorLevel}`); // Safe for ground level and basements
}
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
- **isTuple** - Checks if a value is a tuple (fixed-length array) with specific types at each position

### Object Type Guards

- **isNonNullObject** - Checks if a value is a non-null object (excludes arrays)
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

### Union Type Guards

- **isOneOf** - Checks if a value matches one of several specific values
- **isOneOfTypes** - Checks if a value matches one of several type guards

### Composite Type Guards

- **isIntersectionOf** - Validates a value against multiple type guards (intersection types: `A & B`)
- **isExtensionOf** - Validates inheritance patterns where one type extends another (`interface B extends A`)

### Nullable/Optional Type Guards

- **isNullOr** - Checks if a value is null or matches a specific type
- **isUndefinedOr** - Checks if a value is undefined or matches a specific type
- **isNilOr** - Checks if a value is null, undefined, or matches a specific type (equivalent to `isUndefinedOr(isNullOr(...))`)

### Special Type Guards

- **isEnum** - Checks if a value matches any value from an enum
- **isEqualTo** - Checks if a value exactly equals a specific value

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
