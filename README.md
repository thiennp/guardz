# guardx

A simple and lightweight TypeScript type guard library.

## Installation

```bash
npm install guardx
# or
yarn add guardx
```

## Usage

```typescript
import { isString, isNumber, isObjectWithKeys } from 'guardx';

const data: unknown = getDataFromSomewhere();

if (isString(data)) {
  // data is now typed as string
  console.log(data.toUpperCase());
}

if (isObjectWithKeys(data, ['name', 'age'])) {
  // data is now typed as { name: unknown; age: unknown; } & Record<string | number | symbol, unknown>
  console.log(`Name: ${data.name}`);
  if (isNumber(data.age)) {
    // data.age is now typed as number
    console.log(`Age: ${data.age}`);
  }
}

// Add more examples of your specific guards here
```

## Available Guards

*   `isString(value: unknown): value is string`
*   `isNumber(value: unknown): value is number`
*   `isBoolean(value: unknown): value is boolean`
*   `// ... List other guards here`

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT 