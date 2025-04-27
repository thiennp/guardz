# guardz

A simple and lightweight TypeScript type guard library.

## Installation

```bash
npm install guardz
# or
yarn add guardz
```

## Usage

```typescript
import { isString, isNumber, isNonNullObject } from 'guardz';

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

// Add more examples of your specific guards here
```

## Available Guards

*   `isAny(value: unknown): value is any`
*   `isArrayWithEachItem(value: unknown, itemGuard: TypeGuardFn<T>): value is T[]`
*   `isBoolean(value: unknown): value is boolean`
*   `isDate(value: unknown): value is Date`
*   `isDefined<T>(value: T | undefined): value is T`
*   `isEnum<T extends object>(value: unknown, enumObject: T): value is T[keyof T]`
*   `isEqualTo<T>(value: unknown, comparisonValue: T): value is T`
*   `isNil(value: unknown): value is null | undefined`
*   `isNonNullObject(value: unknown): value is Record<number | string, unknown>`
*   `isNonEmptyArray<T>(value: unknown): value is [T, ...T[]]`
*   `isNonEmptyArrayWithEachItem<T>(value: unknown, itemGuard: TypeGuardFn<T>): value is [T, ...T[]]`
*   `isNonEmptyString(value: unknown): value is string`
*   `isNonNegativeNumber(value: unknown): value is number`
*   `isNullOr<T>(value: unknown, nextGuard: TypeGuardFn<T>): value is T | null`
*   `isNumber(value: unknown): value is number`
*   `isObjectWithEachItem<V>(value: unknown, valueGuard: TypeGuardFn<V>): value is Record<string, V>`
*   `isOneOf<T extends readonly unknown[]>(value: unknown, allowedValues: T): value is T[number]`
*   `isOneOfTypes<T extends readonly TypeGuardFn<unknown>[]>(value: unknown, guards: T): value is GuardedType<T[number]>`
*   `isPartialOf<T extends object>(value: unknown, shape: { [K in keyof T]: TypeGuardFn<T[K]> }): value is Partial<T>`
*   `isString(value: unknown): value is string`
*   `isUndefinedOr<T>(value: unknown, nextGuard: TypeGuardFn<T>): value is T | undefined`
*   `guardWithTolerance<T>(guardFn: TypeGuardFn<T>, tolerance?: number | undefined): TypeGuardFn<T>`
*   `// ... Potentially others depending on exports`

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT 