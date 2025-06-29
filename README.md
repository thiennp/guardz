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

```typescript
import { isString, isNumber, isNonNullObject, isArrayWithEachItem, isPartialOf, isType, isBoolean } from 'guardz';

const data: unknown = getDataFromSomewhere();

if (isString(data)) {
  // data is now typed as string
  console.log(data.toUpperCase());
}

if (isNonNullObject(data)) {
  if (isString(data.name)) {
    console.log(`Name: ${data.name}`);
  }
  if (isNumber(data.age)) {
    console.log(`Age: ${data.age}`);
  }
}

// Example using isArrayWithEachItem
const maybeNumbers: unknown = [1, 2, '3', 4];
if (isArrayWithEachItem(maybeNumbers, isNumber)) {
  // maybeNumbers is now typed as number[]
  const sum = maybeNumbers.reduce((acc, num) => acc + num, 0);
  console.log('Sum:', sum); // This block won't execute due to '3'
} else {
  console.log('Input is not an array of numbers');
}

// Example using isPartialOf
interface User { 
  id: number;
  name: string;
  isAdmin?: boolean;
}

const partialUserData: unknown = { name: 'Alice', isAdmin: true };
const userShape = { 
  id: isNumber,
  name: isString,
  isAdmin: isBoolean // Note: This checks if the property exists AND is a boolean
  // Or use: isUndefinedOr(isBoolean) if isAdmin can be undefined
};

if (isPartialOf(partialUserData, userShape)) {
  // partialUserData is now typed as Partial<User>
  console.log('Valid partial user data:', partialUserData.name);
  if (partialUserData.isAdmin) {
    console.log('User is an admin');
  }
}

// Using isType for object validation
interface User {
  id: number;
  name: string;
  isActive: boolean;
  tags: string[];
}

const isUser = isType<User>({
  id: isNumber,
  name: isString,
  isActive: isBoolean,
  tags: isArrayWithEachItem(isString) // isArrayWithEachItem returns a TypeGuardFn<string[]>
});

const potentialUser: unknown = { id: 123, name: 'Alice', isActive: true, tags: ['a', 'b'] };

if (isUser(potentialUser)) {
  // potentialUser is now typed as User
  console.log(`User ${potentialUser.name} has tags: ${potentialUser.tags.join(', ')}`);
} else {
  console.log('Invalid user structure');
}

// Add more examples of your specific guards here
```

## API Reference

Below is a list of the core type guards provided by `guardz`.

*   **`isType<T>(propsTypesToCheck: { [P in keyof T]: TypeGuardFn<T[P]> }): TypeGuardFn<T>`**
    **(Core Function)** Creates a type guard function for a specific object shape `T`. It checks if a value is a non-null object and verifies that each property specified in `propsTypesToCheck` conforms to its corresponding type guard function.

*   **`guardWithTolerance<T>(baseGuard: TypeGuardFn<T>, refinement: (value: T) => boolean): TypeGuardFn<T>`**
    Creates a new type guard function that first checks using the `baseGuard` (e.g., `isNumber`). If the `baseGuard` passes, it then applies the additional `refinement` check function to the value (which must now conform to type `T`). Returns `true` only if both checks pass.

*   **`isAny(value: unknown): value is any`**
    Always returns `true`. Useful as a placeholder or in complex conditional types.

*   **`isArrayWithEachItem<T>(value: unknown, itemGuard: TypeGuardFn<T>): value is T[]`**
    Checks if `value` is an array and every item in the array passes the `itemGuard`.

*   **`isBoolean(value: unknown): value is boolean`**
    Checks if `value` is a boolean (`true` or `false`).

*   **`isDate(value: unknown): value is Date`**
    Checks if `value` is a Date object.

*   **`isDefined<T>(value: T | undefined): value is T`**
    Checks if `value` is not `undefined`.

*   **`isEnum<T extends object>(value: unknown, enumObject: T): value is T[keyof T]`**
    Checks if `value` is a valid value of the provided TypeScript enum `enumObject`.

*   **`isEqualTo<T>(value: unknown, comparisonValue: T): value is T`**
    Checks if `value` is strictly equal (`===`) to `comparisonValue`.

*   **`isNil(value: unknown): value is null | undefined`**
    Checks if `value` is `null` or `undefined`.

*   **`isNonNullObject(value: unknown): value is Record<number | string, unknown>`**
    Checks if `value` is an object, but not `null` and not an array.

*   **`isNonEmptyArray<T>(value: unknown): value is [T, ...T[]]`**
    Checks if `value` is an array with at least one element.

*   **`isNonEmptyArrayWithEachItem<T>(value: unknown, itemGuard: TypeGuardFn<T>): value is [T, ...T[]]`**
    Checks if `value` is a non-empty array and every item passes the `itemGuard`.

*   **`isNonEmptyString(value: unknown): value is string`**
    Checks if `value` is a string with length greater than 0.

*   **`isNonNegativeNumber(value: unknown): value is number`**
    Checks if `value` is a number greater than or equal to 0.

*   **`isNullOr<T>(value: unknown, nextGuard: TypeGuardFn<T>): value is T | null`**
    Checks if `value` is `null` or passes the `nextGuard`.

*   **`isNumber(value: unknown): value is number`**
    Checks if `value` is a number (and not `NaN`).

*   **`isObjectWithEachItem<V>(value: unknown, valueGuard: TypeGuardFn<V>): value is Record<string, V>`**
    Checks if `value` is a non-null object and every value within the object passes the `valueGuard`.

*   **`isOneOf<T extends readonly unknown[]>(value: unknown, allowedValues: T): value is T[number]`**
    Checks if `value` is strictly equal (`===`) to one of the `allowedValues` in the provided array.

*   **`isOneOfTypes<T extends readonly TypeGuardFn<unknown>[]>(value: unknown, guards: T): value is GuardedType<T[number]>`**
    Checks if `value` passes at least one of the type guards provided in the `guards` array.

*   **`isPartialOf<T extends object>(value: unknown, shape: { [K in keyof T]: TypeGuardFn<T[K]> }): value is Partial<T>`**
    Checks if `value` is an object and all *existing* properties in `value` match the types defined by the corresponding type guards in the `shape` object.

*   **`isString(value: unknown): value is string`**
    Checks if `value` is a string.

*   **`isUndefinedOr<T>(value: unknown, nextGuard: TypeGuardFn<T>): value is T | undefined`**
    Checks if `value` is `undefined` or passes the `nextGuard`.

*Note: The exact types `TypeGuardFn` and `GuardedType` would depend on your internal definitions, typically involving predicates like `value is T`.*

For more detailed API documentation generated from the source code comments, please see the [TypeDoc generated documentation](docs/index.html) (available after running `npm run docs`).

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT 