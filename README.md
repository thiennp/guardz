# guardz

[![NPM Version](https://img.shields.io/npm/v/guardz)](https://www.npmjs.com/package/guardz)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/thiennp/guardz/actions/workflows/ci.yml/badge.svg)](https://github.com/thiennp/guardz/actions/workflows/ci.yml)

A simple and lightweight TypeScript type guard library.

The core function `isType` allows you to easily create type guards for complex object structures by composing simpler guards.

## Installation

```bash
npm install guardz
# or
yarn add guardz
```

## Usage

### Simple usage with primitive type-guard function
Problem:

- It could be simple
```typescript
import { isString } from 'guardz';

const data: unknown = getDataFromSomewhere();

if (isString(data)) { // data type is narrowed to string
  console.log(data.toUpperCase());
}
```

- Or complicated
```typescript
import { isType, isString } from 'guardz';
const data: unknown = getDataFromSomewhere();

// Build typeguard function
const isUser = isType({
  name: isString,
  age: isString,
})

if (isUser(data)) { // data type is narrowed to { name: string, age: string }
  console.log(`Name: ${data.name}`);
  console.log(`Age: ${data.age}`);
}
```

- For Array
```typescript
import { isArrayWithEachItem, isNumber } from 'guardz';

// Example using isArrayWithEachItem
const data: unknown = getDataFromSomewhere()
if (isArrayWithEachItem(isNumber)(data)) { // data type is narrowed to number[]
  console.log(data.map((item) => item.toFixed(2)))
}
```

- For Record
```typescript
import { isObjectWithEachItem, isNumber } from 'guardz';

// Example using isObjectWithEachItem
const data: unknown = getDataFromSomewhere()
if (isObjectWithEachItem(isNumber)(data)) { // data type is narrowed to Record<string, number | undefined>
  console.log(data.something?.toFixed(2))
}
```

- Union Type
```typescript
import { isNumber, isString, isOneOfType } from 'guardz';

// Example using isOneOfType
const data: unknown = getDataFromSomewhere()
if (isOneOfType<number | string>(isNumber, isString)(data)) { // data type is narrowed to string | number
  return isNumber(a) ? a.toFix(2) : a;
}
```


- Nullable type
```typescript
import { isNullOr, isString } from 'guardz';

// Example using isArrayWithEachItem
const data: unknown = getDataFromSomewhere()
if (isNullOr(isString)(data)) { // data type is narrowed to string | null
  return a?.toUpperCase();
}
```

- Optional type
```typescript
import { isUndefinedOr, isString } from 'guardz';

// Example using isUndefinedOr
const data: unknown = getDataFromSomewhere()
if (isUndefinedOr(isString)(data)) { // data type is narrowed to string | undefined
  return a?.toUpperCase();
}
```

- Or even both
```typescript
import { isUndefinedOr, isString } from 'guardz';

// Example using isUndefinedOr
const data: unknown = getDataFromSomewhere()
if (isUndefinedOr(isNullOr(isString))(data)) { // data type is narrowed to string | undefined | null
  return a?.toUpperCase();
}
```

or complex type
```typescript
import { isUndefinedOr, isString, isEnum, isEqualTo, isNumber, isOneOfType, isArrayWithEachItem, isType } from 'guardz';

enum PriceTypeEnum {
  FREE = 'free',
  PAID = 'paid'
}

// Example using isUndefinedOr
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
    average: isOneOfType<number | 'N/A'>(isNumber, isEqualTo('N/A'))
  })),
})

if (isBook(data)) { // data type is narrowed to Book
  return data;
}
```

### Guard with tolerance
```typescript
import { isBook } from 'isBook'; // see previous example
import { guardWithTolerance } from 'guardz';



## API Reference

Below is a list of the core type guards provided by `guardz`.

*   **`isType<T>(propsTypesToCheck: { [P in keyof T]: TypeGuardFn<T[P]> }): TypeGuardFn<T>`**
    **(Core Function)** Creates a type guard function for a specific object shape `T`. It checks if a value is a non-null object and verifies that each property specified in `propsTypesToCheck` conforms to its corresponding type guard function.

*   **`guardWithTolerance<T>(data: unknown, typeGuardFn: TypeGuardFn<T>, config?: Nullable<TypeGuardFnConfig>): T
    Check if data type match typeGuardFn, otherwise assert type of data (even though it is wrong), but log the error via config

*   **`isAny`**
*   **`isArrayWithEachItem`**
*   **`isBoolean`**
*   **`isDate`**
*   **`isDefined`**
*   **`isEnum`**
*   **`isEqualTo`**
*   **`isNil`**
*   **`isNonEmptyArrayWithEachItem`**
*   **`isNonEmptyString`**
*   **`isNonNegativeNumber`**
*   **`isNullOr`**
*   **`isNumber`**
*   **`isObjectWithEachItem`**
*   **`isOneOf`**
*   **`isOneOfTypes`**
*   **`isString`**
*   **`isUndefinedOr`**
*   **`isUnknown`**


some utility types
*   **`NonEmptyArray`**
*   **`NonEmptyString`**
*   **`NonNegativeNumber`**
*   **`Nullable`**
*   **`PositiveNumber`**



For more detailed API documentation generated from the source code comments, please see the [TypeDoc generated documentation](docs/index.html) (available after running `npm run docs`).

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT

---

## Support

If you find this library helpful, consider buying me a beer! 🍺

[Buy me a coffee](https://paypal.me/thiennp)
