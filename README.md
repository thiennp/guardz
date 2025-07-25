# 🛡️ Guardz

[![NPM Version](https://img.shields.io/npm/v/guardz)](https://www.npmjs.com/package/guardz)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/thiennp/guardz/actions/workflows/ci.yml/badge.svg)](https://github.com/thiennp/guardz/actions/workflows/ci.yml)
[![GitHub Sponsors](https://img.shields.io/github/sponsors/thiennp?style=flat)](https://github.com/sponsors/thiennp)

**The easiest way to add runtime type safety to your TypeScript projects.**

> **Lightweight, zero-dependency type guards that just work — no complex schemas, no heavy dependencies.**

- 🚀 **Super Simple** - Just import and use, no setup required
- 📦 **Tiny & Fast** - Zero dependencies, minimal bundle size
- 🎯 **Type-Safe** - Full TypeScript support with perfect type inference
- 🛡️ **Structured Errors** - Know exactly what failed and why
- 🔧 **Flexible** - Works with your existing code, no refactoring needed
- 🌐 **Ecosystem** - Extends to event handling, HTTP clients, and code generation  

---

## 🛑 Structured Error Handling (Core Feature)

**Guardz’s most important feature is its structured error reporting.**

- **What failed** (the value and its field)
- **Where it failed** (the property path)
- **What was expected** (the type or constraint)

**Why does this matter?**

> **Structured error reporting is critical for debugging, user feedback, and monitoring.**
> - Instantly see which field failed and why
> - Show clear, actionable error messages in your UI
> - Integrate with your error tracking systems
> - Assert on specific error messages in your tests

### Quick Example

```typescript
import { isType, isString, isNumber } from 'guardz';

const errors: string[] = [];
const config = {
  identifier: 'user',
  callbackOnError: (error: string) => errors.push(error),
  // errorMode: 'multi' (default) - collects all errors in a single message
};

const isUser = isType({ name: isString, age: isNumber });
const result = isUser({ name: 'John', age: '30' }, config);
// errors now contains: [ 'Expected user.age ("30") to be "number"' ]
```

### Visual Error Message Example

```
Expected user.age ("30") to be "number"
```

### Advanced: Nested and Multiple Errors
Guardz tracks errors even in deeply nested structures, using dot/bracket notation for property paths:
- `Expected user.details.age ("thirty") to be "number"`
- `Expected users[2].email (123) to be "string"`

### 🎯 **Default Multi-Mode Behavior**

Guardz uses **multi mode as the default** for better user experience and easier error detection:

```typescript
// By default, all validation errors are combined into a single message
const config = {
  identifier: 'user',
  callbackOnError: (error: string) => console.log(error),
  // errorMode: 'multi' (default)
};

const invalidUser = { 
  name: 123,        // should be string
  age: '30',        // should be number
  isActive: 'yes'   // should be boolean
};

isUser(invalidUser, config);
// Output: "Expected user.name (123) to be "string"; Expected user.age ("30") to be "number"; Expected user.isActive ("yes") to be "boolean""
```

**Benefits of Default Multi Mode:**
- 🚀 **Better UX** - Users see all validation issues at once
- 🔍 **Easier Debugging** - Complete picture of what needs to be fixed
- 📝 **Cleaner Logs** - Single error message instead of multiple callbacks
- 🎯 **Consistent Behavior** - No confusion about "first error only"
- ⚡ **Easy Detection** - All errors in one place for quick identification

### 🎯 **JSON Tree Error Feedback (Advanced)**

Guardz provides **structured JSON tree feedback** for comprehensive error analysis and debugging. This is especially powerful for complex nested objects and integration with monitoring systems. Unlike other modes, JSON tree shows **both valid and invalid branches**, making it perfect for analyzing complex DTOs with related fields.

#### **Basic JSON Tree Example**

```typescript
import { isType, isString, isNumber, isBoolean } from 'guardz';

const errors: string[] = [];
const config = {
  identifier: 'user',
  callbackOnError: (error: string) => errors.push(error),
  errorMode: 'json' as const, // Enable JSON tree mode
};

interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

const isUser = isType<User>({
  id: isNumber,
  name: isString,
  email: isString,
  isActive: isBoolean,
});

const invalidUser = {
  id: '1', // should be number
  name: 123, // should be string
  email: true, // should be string
  isActive: 'yes', // should be boolean
};

const result = isUser(invalidUser, config);

// errors[0] contains the JSON tree:
console.log(errors[0]);
```

**Output:**
```json
{
  "user": {
    "valid": false,
    "value": {
      "id": {
        "valid": false,
        "value": "1",
        "expectedType": "number"
      },
      "name": {
        "valid": false,
        "value": 123,
        "expectedType": "string"
      },
      "email": {
        "valid": false,
        "value": true,
        "expectedType": "string"
      },
      "isActive": {
        "valid": false,
        "value": "yes",
        "expectedType": "boolean"
      }
    }
  }
}
```

#### **Nested Object JSON Tree Example**

```typescript
import { isSchema, isString, isNumber, isBoolean } from 'guardz';

const errors: string[] = [];
const config = {
  identifier: 'user',
  callbackOnError: (error: string) => errors.push(error),
  errorMode: 'json' as const,
};

interface NestedUser {
  name: string;
  profile: {
    age: number;
    email: string;
  };
  settings: {
    notifications: boolean;
  };
}

const isNestedUser = isSchema<NestedUser>({
  name: isString,
  profile: {
    age: isNumber,
    email: isString,
  },
  settings: {
    notifications: isBoolean,
  },
});

const invalidUser = {
  name: 123, // should be string
  profile: {
    age: '25', // should be number
    email: true, // should be string
  },
  settings: {
    notifications: 'yes', // should be boolean
  },
};

const result = isNestedUser(invalidUser, config);
```

**Output:**
```json
{
  "user": {
    "valid": false,
    "value": {
      "name": {
        "valid": false,
        "value": 123,
        "expectedType": "string"
      },
      "profile": {
        "valid": false,
        "value": {
          "age": "25",
          "email": true
        },
        "expectedType": "object"
      },
      "settings": {
        "valid": false,
        "value": {
          "notifications": "yes"
        },
        "expectedType": "object"
      }
    }
  }
}
```

#### **Error Mode Configuration**

Guardz supports three error modes with **multi mode as the default** for better user experience and easier error detection:

```typescript
// Multi error mode (default) - collects all errors in a single message
const multiConfig = {
  callbackOnError: (error: string) => console.log(error),
  identifier: 'user',
  // errorMode: 'multi' (default)
};

// Single error mode - stops at first error (explicit)
const singleConfig = {
  callbackOnError: (error: string) => console.log(error),
  identifier: 'user',
  errorMode: 'single' as const,
};

// JSON tree mode - provides structured JSON feedback
const jsonConfig = {
  callbackOnError: (error: string) => console.log(error),
  identifier: 'user',
  errorMode: 'json' as const,
};
```

> **💡 Performance Note:** Single mode is fastest (fails fast), multi mode balances performance and usability, while JSON tree mode provides the most comprehensive analysis but has higher overhead.

#### **Integration with Monitoring Systems**

JSON tree feedback is perfect for integration with error monitoring and logging systems:

```typescript
import { isType, isString, isNumber } from 'guardz';

const config = {
  identifier: 'api_response',
  callbackOnError: (error: string) => {
    // Send to monitoring system
    monitoringService.captureError({
      type: 'validation_error',
      data: JSON.parse(error), // Parse JSON tree
      timestamp: new Date().toISOString(),
    });
  },
  errorMode: 'json' as const,
};

const isApiResponse = isType({
  status: isString,
  data: isType({
    id: isNumber,
    name: isString,
  }),
});

// Invalid API response
const invalidResponse = {
  status: 200, // should be string
  data: {
    id: '123', // should be number
    name: 456, // should be string
  },
};

const result = isApiResponse(invalidResponse, config);
```

#### **Template Literal Format**

The JSON tree is formatted as a template literal for easy debugging and logging:

```typescript
const jsonTreeError = errors[0];
const errorTree = JSON.parse(jsonTreeError);

// Access specific validation results
console.log('Root valid:', errorTree.user.valid);
console.log('Name field valid:', errorTree.user.value.name.valid);
console.log('Expected type for age:', errorTree.user.value.age.expectedType);
```

**Key Benefits of JSON Tree Feedback:**
- 🎯 **Structured Analysis** - Complete validation state in JSON format
- 🔍 **Deep Inspection** - See exactly which nested fields failed
- 📊 **Monitoring Integration** - Perfect for error tracking systems
- 🐛 **Debugging** - Clear visualization of validation failures
- 🔧 **Programmatic Access** - Parse and process validation results

---

## 🚀 Why Guardz?

TypeScript types vanish at runtime. That’s where Guardz steps in.  
Unlike schema validators that require re-declaring types, Guardz uses **your existing TS types as the source of truth**, matching values without coercion.

**But Guardz goes further:**
- 🛑 **Structured error messages**: Instantly know what failed, where, and why. Every type guard can provide detailed, field-specific error messages for debugging, logging, and user feedback.
- 🔗 **Custom error handling**: Integrate with your logging, monitoring, or UI error display with a simple callback.

📚 [Read: "Assert Nothing, Guard Everything"](https://medium.com/p/0b3e4388ae78)

## 🤝 Support Guardz

If you find Guardz helpful, consider supporting its development:

[![GitHub Sponsors](https://img.shields.io/github/sponsors/thiennp?style=flat)](https://github.com/sponsors/thiennp)

**Sponsor Tiers:**
- **$5/month** → Supporter
- **$20/month** → Coffee + shout-out  
- **$100/month** → Company Sponsor
- **$500+/month** → Integration/Consulting Call

Your support helps maintain and improve Guardz for the TypeScript community! ❤️

---

## 🚀 Guardz Ecosystem

Guardz is more than just a type guard library - it's a complete ecosystem for runtime type safety in TypeScript applications.

### Core Package: `guardz`
The foundation of the ecosystem, providing **lightweight, zero-dependency type guards** with structured error handling.

### HTTP Client: `guardz-axios`
Type-safe HTTP requests with runtime validation built on top of Axios.

**Key Features:**
- **Type-safe HTTP requests** with runtime validation
- **Multiple API patterns** for different use cases
- **Comprehensive error handling** with detailed feedback
- **Retry logic** with configurable backoff strategies
- **Tolerance mode** for graceful degradation

```typescript
import { safeGet } from 'guardz-axios';
import { isType, isString, isNumber } from 'guardz';

interface User {
  id: number;
  name: string;
  email: string;
}

const isUser = isType<User>({
  id: isNumber,
  name: isString,
  email: isString,
});

const result = await safeGet({ guard: isUser })('/users/1');

if (result.status === Status.SUCCESS) {
  console.log('User:', result.data); // Fully typed as User
} else {
  console.log('Error:', result.code, result.message);
}
```

**Installation:**
```bash
npm install guardz-axios guardz axios
```

### Type Guard Generator: `guardz-generator`
Automatically generate type guards from your TypeScript interfaces and type aliases.

**Key Features:**
- **Automatic generation** from TypeScript interfaces and type aliases
- **Generic support** for complex type structures
- **Advanced recursion detection** for self-referencing types
- **Cross-file references** for multi-file type systems
- **CLI and programmatic APIs** for flexible integration

```bash
# Generate type guards for all exported interfaces
npx guardz-generator generate "src/**/*.ts"

# Generate for a specific type
npx guardz-generator generate "src/**/*.ts" -t UserDTO
```

**Installation:**
```bash
npm install guardz-generator
```

## 📦 Installation

```bash
npm install guardz
# or
yarn add guardz
```

> **💡 Ecosystem Tip**: Guardz is part of a larger ecosystem including `guardz-event` for safe event handling, `guardz-axios` for type-safe HTTP clients, and `guardz-generator` for automatic type guard generation. See the [Ecosystem Packages](#-ecosystem-packages) section below.

### 📦 **Bundle Size & Performance**

Guardz is **incredibly lightweight**:

- **Bundle Size**: ~1.7KB gzipped (~11.7KB uncompressed)
- **Dependencies**: Zero (pure TypeScript)
- **Tree-shakeable**: Only import what you use
- **Runtime Performance**: Minimal overhead

```bash
# Check bundle size
npm install --save-dev bundle-analyzer
npx bundle-analyzer dist/index.js
```

## 🚀 Getting Started (It's Super Simple!)

Guardz is designed to be **incredibly easy to use**. If you know TypeScript, you already know Guardz.

### **Quick Start - 30 Seconds**

```typescript
import { isType, isString, isNumber } from 'guardz';

// That's it! You're ready to go.
const isUser = isType({
  name: isString,
  age: isNumber,
});

const data: unknown = { name: 'John', age: 30 };
if (isUser(data)) {
  // TypeScript knows this is safe
  console.log(data.name.toUpperCase()); // ✅ Works
  console.log(data.age.toFixed(2));     // ✅ Works
}
```

### **Why It's So Easy**

- 🎯 **No Setup Required** - Just import and use
- 📚 **Familiar Syntax** - Works exactly like TypeScript types
- 🔧 **Zero Configuration** - No complex schemas or setup
- ⚡ **Instant Results** - Start validating immediately

### **Why Guardz?**

**Guardz is designed for simplicity and zero friction:**

- 🚀 **Zero Setup** - Just import and use, no schema definitions required
- 📦 **Ultra Lightweight** - Zero dependencies, minimal bundle impact
- 🎯 **TypeScript Native** - Works directly with your existing types
- 🔧 **Drop-in Ready** - No refactoring needed, works with existing code
- 📚 **Familiar Syntax** - If you know TypeScript, you already know Guardz

**Perfect for projects that need runtime type safety without the complexity of schema validators.**

## 📖 Examples & Patterns

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

### Generic Type Guards

Create reusable type guard functions that wrap other type guards. This is useful for creating consistent validation patterns across your application:

```typescript
import { isGeneric, isString, isNumber, isType, isArrayWithEachItem } from 'guardz';

// Create reusable type guards
const isGenericString = isGeneric(isString);
const isGenericNumber = isGeneric(isNumber);

// Use them in different contexts
interface User {
  id: number;
  name: string;
  email: string;
}

const isUser = isType<User>({
  id: isGenericNumber,
  name: isGenericString,
  email: isGenericString,
});

const user: unknown = { id: 1, name: 'John', email: 'john@example.com' };
if (isUser(user)) {
  // All properties are properly typed
  console.log(user.id.toFixed(2)); // number methods available
  console.log(user.name.toUpperCase()); // string methods available
}

// Works with complex type guards too
const isGenericNumberArray = isGeneric(isArrayWithEachItem(isNumber));
const isGenericStringArray = isGeneric(isArrayWithEachItem(isString));

interface DataSet {
  numbers: number[];
  labels: string[];
}

const isDataSet = isType<DataSet>({
  numbers: isGenericNumberArray,
  labels: isGenericStringArray,
});

const dataset: unknown = {
  numbers: [1, 2, 3],
  labels: ['A', 'B', 'C']
};

if (isDataSet(dataset)) {
  // Type-safe array operations
  const sum = dataset.numbers.reduce((a, b) => a + b, 0);
  const upperLabels = dataset.labels.map(label => label.toUpperCase());
}

// Advanced: Creating domain-specific type guards
const isUserId = isGeneric(isNumber);
const isEmail = isGeneric(isString);
const isName = isGeneric(isString);

interface Employee {
  id: number;
  name: string;
  email: string;
  managerId?: number;
}

const isEmployee = isType<Employee>({
  id: isUserId,
  name: isName,
  email: isEmail,
  managerId: isGeneric(isNumber), // or use isUserId for consistency
});

// With error handling
const errors: string[] = [];
const config = {
  identifier: 'employee',
  callbackOnError: (error: string) => errors.push(error),
};

const invalidEmployee = { id: 'not-a-number', name: 'John', email: 'invalid-email' };
const result = isEmployee(invalidEmployee, config);
// errors contains: ['Expected employee.id ("not-a-number") to be "number"']
```

### Composite Type Guards

Handle complex type relationships like intersections and extensions:

```typescript
import { isIntersectionOf, isExtensionOf, isType, isString, isNumber, isArrayWithEachItem } from 'guardz';

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

// Supports 2-10 type guards with full type safety
interface Manager {
  managedTeamSize: number;
  level: string;
}

interface Admin {
  permissions: string[];
  accessLevel: number;
}

const isManager = isType<Manager>({ managedTeamSize: isNumber, level: isString });
const isAdmin = isType<Admin>({ permissions: isArrayWithEachItem(isString), accessLevel: isNumber });

// 3 type guards
const isPersonEmployeeManager = isIntersectionOf(isPerson, isEmployee, isManager);

// 4 type guards  
const isPersonEmployeeManagerAdmin = isIntersectionOf(isPerson, isEmployee, isManager, isAdmin);

if (isPersonEmployeeManagerAdmin(data)) {
  // data type is narrowed to Person & Employee & Manager & Admin
  console.log(`${data.name} manages ${data.managedTeamSize} people with ${data.permissions.length} permissions`);
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

Create type guards for deeply nested structures using the traditional `isType` approach:

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

### Simplified Nested Type Guards with `isSchema`

The new `isSchema` function provides a more concise way to handle nested structures:

```typescript
import { isSchema, isString, isEnum, isEqualTo, isNumber, isOneOfTypes, isArrayWithEachItem } from 'guardz';

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

// More concise with isSchema - no need for explicit isType calls
const isBook = isSchema<Book>({
  title: isString,
  price: isEnum(PriceTypeEnum),
  author: {
    name: isString,
    email: isUndefinedOr(isString),
  },
  chapters: [{
    content: isString,
    startPage: isNumber,
  }],
  rating: [{
    userId: isString,
    average: isOneOfTypes<number | 'N/A'>(isNumber, isEqualTo('N/A'))
  }],
})

if (isBook(data)) { // data type is narrowed to Book
  return data;
}
```

**Key benefits of `isSchema`:**
- **More concise**: No need for explicit `isType` calls for nested objects
- **Better readability**: Inline object definitions are more intuitive
- **Backward compatible**: Works with existing type guards
- **Same validation**: Produces identical validation results to `isType`
- **Multiple aliases**: Available as `isSchema`, `isShape`, and `isNestedType` for flexibility

### When to Use Generic Type Guards

Use `isGeneric` when you want to:

1. **Create reusable validation patterns** across your application
2. **Maintain consistency** in how you validate similar types
3. **Reduce code duplication** when the same type guard is used in multiple places
4. **Create domain-specific type guards** that have semantic meaning

**Example: Domain-specific type guards**
```typescript
import { isGeneric, isString, isNumber, isPositiveInteger } from 'guardz';

// Create semantic type guards for your domain
const isUserId = isGeneric(isPositiveInteger);
const isEmail = isGeneric(isString);
const isName = isGeneric(isString);
const isAge = isGeneric(isNumber);

// Use them consistently across your application
interface User {
  id: number;        // Uses isUserId
  name: string;      // Uses isName
  email: string;     // Uses isEmail
  age: number;       // Uses isAge
}

interface Employee extends User {
  employeeId: number; // Uses isUserId
  managerId?: number; // Uses isUserId
}

// All validation is consistent and semantic
const isUser = isType<User>({
  id: isUserId,
  name: isName,
  email: isEmail,
  age: isAge,
});
```

**Benefits:**
- **Semantic clarity**: `isUserId` is more meaningful than `isPositiveInteger`
- **Consistency**: Same validation logic across your codebase
- **Maintainability**: Change validation logic in one place
- **Type safety**: Full TypeScript support with proper type narrowing

**Best Practices:**
```typescript
// ✅ Good: Create semantic type guards
const isUserId = isGeneric(isPositiveInteger);
const isEmail = isGeneric(isString);
const isName = isGeneric(isString);

// ✅ Good: Use consistent naming
const isUserAge = isGeneric(isNumber);
const isEmployeeAge = isGeneric(isNumber); // Same validation, different context

// ✅ Good: Combine with other type guards
const isUserArray = isGeneric(isArrayWithEachItem(isUser));
const isEmailArray = isGeneric(isArrayWithEachItem(isEmail));

// ❌ Avoid: Unnecessary wrapping of simple types
const isString = isGeneric(isString); // Redundant
const isNumber = isGeneric(isNumber); // Redundant

// ✅ Good: Use for complex type guards
const isComplexObject = isGeneric(isType({
  id: isNumber,
  name: isString,
  metadata: isObjectWithEachItem(isString)
}));

// ✅ Good: Error handling works seamlessly
const errors: string[] = [];
const config = {
  identifier: 'user',
  callbackOnError: (error: string) => errors.push(error),
};

const isUserId = isGeneric(isPositiveInteger);
const invalidUser = { id: 'not-a-number', name: 'John' };
const result = isUserId(invalidUser.id, { ...config, identifier: 'user.id' });
// errors contains: ['Expected user.id ("not-a-number") to be "PositiveInteger"']
```

### Built-in Object Type Guards

Validate JavaScript's built-in object types with optional type checking for their contents:

```typescript
import { isMap, isSet, isWeakMap, isWeakSet, isRegExp, isSymbol, isPromise, isFunction, isTypedArray, isArrayBuffer, isDataView, isError } from 'guardz';

// Map validation with key/value type checking
const isStringNumberMap = isMap(isString, isNumber);
const userScores = new Map([['user1', 100], ['user2', 200]]);
if (isStringNumberMap(userScores)) {
  // userScores is typed as Map<string, number>
  userScores.forEach((score, user) => {
    console.log(`${user}: ${score.toFixed(2)}`);
  });
}

// Set validation with element type checking
const isStringSet = isSet(isString);
const validNames = new Set(['John', 'Jane', 'Bob']);
if (isStringSet(validNames)) {
  // validNames is typed as Set<string>
  validNames.forEach(name => console.log(name.toUpperCase()));
}

// RegExp validation
const data: unknown = /^[a-z]+$/i;
if (isRegExp(data)) {
  // data is typed as RegExp
  console.log(data.test('hello')); // true
  console.log(data.flags); // "i"
}

// Symbol validation
const data: unknown = Symbol('user-id');
if (isSymbol(data)) {
  // data is typed as Symbol
  console.log(typeof data); // "symbol"
}

// Promise validation
const data: unknown = Promise.resolve('hello');
if (isPromise(isString)(data)) {
  // data is typed as Promise<string>
  data.then(value => console.log(value.toUpperCase()));
}

// Function validation
const data: unknown = (x: number) => x * 2;
if (isFunction(data)) {
  // data is typed as Function
  console.log(data(5)); // 10
}

// WeakMap validation with key/value type checking
const isObjectNumberWeakMap = isWeakMap(isNonNullObject, isNumber);
const obj1 = {};
const obj2 = {};
const userScores = new WeakMap([[obj1, 100], [obj2, 200]]);
if (isObjectNumberWeakMap(userScores)) {
  // userScores is typed as WeakMap<object, number>
  console.log(userScores.get(obj1)); // 100
}

// WeakSet validation with element type checking
const isObjectWeakSet = isWeakSet(isNonNullObject);
const validObjects = new WeakSet([obj1, obj2]);
if (isObjectWeakSet(validObjects)) {
  // validObjects is typed as WeakSet<object>
  console.log(validObjects.has(obj1)); // true
}

// TypedArray validation with element type checking
const isNumberTypedArray = isTypedArray(isNumber);
const pixelData = new Uint8Array([255, 128, 0, 255]);
if (isNumberTypedArray(pixelData)) {
  // pixelData is typed as TypedArray<number>
  console.log(pixelData.length); // 4
  console.log(pixelData[0]); // 255
}

// ArrayBuffer validation
const buffer = new ArrayBuffer(16);
if (isArrayBuffer(buffer)) {
  // buffer is typed as ArrayBuffer
  console.log(buffer.byteLength); // 16
  const sliced = buffer.slice(0, 8);
  console.log(sliced.byteLength); // 8
}

// DataView validation
const view = new DataView(buffer);
if (isDataView(view)) {
  // view is typed as DataView
  console.log(view.byteLength); // 16
  view.setUint16(0, 12345);
  console.log(view.getUint16(0)); // 12345
}

// Error validation
const error = new Error("Something went wrong");
if (isError(error)) {
  // error is typed as Error
  console.log(error.message); // "Something went wrong"
  console.log(error.name); // "Error"
}
```

### Asserted Type Guards

Use `isAsserted<T>` when working with types from external libraries or APIs that don't provide runtime validation, but you want TypeScript type safety:

```typescript
import { isAsserted } from 'guardz';

// For external library types
import type { ExternalApiResponse } from 'some-external-lib';
const isExternalResponse = isAsserted<ExternalApiResponse>;

const data: unknown = { id: 123, name: 'test' };
if (isExternalResponse(data)) {
  // TypeScript knows data is ExternalApiResponse
  console.log(data.id); // No type error
  console.log(data.name); // No type error
}

// For complex nested types
interface UserProfile {
  id: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  metadata: Record<string, unknown>;
}

const isUserProfile = isAsserted<UserProfile>;
const profile: unknown = {
  id: 'user-123',
  preferences: { theme: 'dark', notifications: true },
  metadata: { lastLogin: new Date() }
};

if (isUserProfile(profile)) {
  // Full type safety for nested properties
  console.log(profile.preferences.theme); // 'light' | 'dark'
  console.log(profile.metadata.lastLogin); // unknown
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

- **isSchema<T>(schema: any): TypeGuardFn<T>**
  Creates a type guard function for object schemas with improved nested type support. Automatically handles nested type guards without requiring explicit `isType` calls for each level. Supports both inline object definitions and existing type guards.

- **isShape<T>(schema: any): TypeGuardFn<T>**
  Alias for `isSchema` - creates a type guard function for object shapes.

- **isNestedType<T>(schema: any): TypeGuardFn<T>**
  Alias for `isSchema` - creates a type guard function for nested object structures.

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

### Built-in Object Type Guards

- **isMap** - Checks if a value is a Map object, optionally validating key and value types
- **isSet** - Checks if a value is a Set object, optionally validating element types
- **isWeakMap** - Checks if a value is a WeakMap object, optionally validating key and value types
- **isWeakSet** - Checks if a value is a WeakSet object, optionally validating element types
- **isRegExp** - Checks if a value is a RegExp object
- **isSymbol** - Checks if a value is a Symbol
- **isPromise** - Checks if a value is a Promise object, optionally validating resolved value type
- **isFunction** - Checks if a value is a Function
- **isTypedArray** - Checks if a value is a TypedArray (Int8Array, Uint8Array, etc.), optionally validating element types
- **isArrayBuffer** - Checks if a value is an ArrayBuffer object
- **isDataView** - Checks if a value is a DataView object
- **isError** - Checks if a value is an Error object

### Union Type Guards

- **isOneOf** - Checks if a value matches one of several specific values
- **isOneOfTypes** - Checks if a value matches one of several type guards

### Composite Type Guards

- **isIntersectionOf** - Validates a value against multiple type guards (intersection types: `A & B & C & ...`) - supports 2-10 type guards with full type safety
- **isExtensionOf** - Validates inheritance patterns where one type extends another (`interface B extends A`)

### Nullable/Optional Type Guards

- **isNullOr** - Checks if a value is null or matches a specific type
- **isUndefinedOr** - Checks if a value is undefined or matches a specific type
- **isNilOr** - Checks if a value is null, undefined, or matches a specific type (equivalent to `isUndefinedOr(isNullOr(...))`)

### Special Type Guards

- **isAsserted** - Always returns true and asserts value is T (useful for 3rd party types without runtime validation)
- **isEnum** - Checks if a value matches any value from an enum
- **isEqualTo** - Checks if a value exactly equals a specific value
- **isGeneric** - Creates a reusable type guard function that wraps another type guard, useful for creating consistent validation patterns across your application

### Error Generation

- **generateTypeGuardError** - Generates standardized error messages for type guard failures with configurable formatting

### Configuration and Error Modes

Guardz provides flexible configuration options for error handling through the `TypeGuardFnConfig` interface:

```typescript
interface TypeGuardFnConfig {
  callbackOnError: (error: string) => void;
  identifier?: string;
  errorMode?: 'single' | 'multi' | 'json';
}
```

#### **Configuration Options**

- **`callbackOnError`** (required): Function called when validation errors occur
- **`identifier`** (optional): Prefix for error messages (e.g., 'user', 'api_response')
- **`errorMode`** (optional): Controls how errors are collected and formatted

#### **Error Modes**

##### **Multi Error Mode (default)**
Collects all validation errors in a single combined message - this is the **default behavior** for better user experience and easier error detection:

```typescript
const config = {
  callbackOnError: (error: string) => console.log(error),
  identifier: 'user',
  // errorMode: 'multi' (default)
};

// All errors are reported in a single combined message
// Output: "Expected user.name (123) to be "string"; Expected user.age ("30") to be "number""
```

**Best for:** General validation, user feedback, and debugging scenarios where you want to see all issues at once.

##### **Single Error Mode**
Stops validation at the first error encountered (must be explicitly specified):

```typescript
const config = {
  callbackOnError: (error: string) => console.log(error),
  identifier: 'user',
  errorMode: 'single' as const,
};

// Only the first error is reported
// Output: "Expected user.name (123) to be "string""
```

**Best for:** Performance-critical scenarios where you want to fail fast and avoid unnecessary validation overhead.

##### **JSON Tree Mode**
Provides structured JSON feedback for comprehensive error analysis:

```typescript
const config = {
  callbackOnError: (error: string) => console.log(error),
  identifier: 'user',
  errorMode: 'json' as const,
};

// Output: Structured JSON tree with complete validation state
// {
//   "user": {
//     "valid": false,
//     "value": {
//       "name": {
//         "valid": false,
//         "value": 123,
//         "expectedType": "string"
//       }
//     }
//   }
// }
```

**Best for:** Complex DTOs with related fields, monitoring systems, and scenarios where you need to see both valid and invalid branches for comprehensive analysis.

#### **Performance Considerations & When to Use Each Mode**

**🚀 Performance Comparison:**
- **Single Mode**: Fastest - stops at first error, minimal validation overhead
- **Multi Mode**: Moderate - validates all fields, combines errors efficiently  
- **JSON Tree Mode**: Most overhead - builds complete validation tree with all branches

**📋 Usage Guidelines:**

| Mode | Use When | Performance | Use Case |
|------|----------|-------------|----------|
| **Multi (Default)** | General validation, user feedback | Moderate | Most scenarios, debugging, form validation |
| **Single** | Performance-critical, fail-fast | Fastest | API validation, real-time validation, high-frequency operations |
| **JSON Tree** | Complex analysis, monitoring | Highest overhead | Complex DTOs, error tracking systems, debugging complex structures |

**💡 Pro Tips:**
- **Start with multi mode** (default) - it's the best balance of performance and usability
- **Use single mode** for high-frequency validation or when you only need to know if something is valid
- **Use JSON tree mode** when you need to analyze complex validation failures or integrate with monitoring systems

#### **Usage Examples**

```typescript
import { isType, isString, isNumber } from 'guardz';

// Basic error handling (defaults to multi mode)
const errors: string[] = [];
const basicConfig = {
  callbackOnError: (error: string) => errors.push(error),
  identifier: 'user',
};

// Single error mode
const singleErrors: string[] = [];
const singleConfig = {
  callbackOnError: (error: string) => singleErrors.push(error),
  identifier: 'user',
  errorMode: 'single' as const,
};

// JSON tree for monitoring
const jsonConfig = {
  callbackOnError: (error: string) => {
    const errorTree = JSON.parse(error);
    monitoringService.captureError({
      type: 'validation_error',
      data: errorTree,
      timestamp: new Date().toISOString(),
    });
  },
  identifier: 'api_response',
  errorMode: 'json' as const,
};

const isUser = isType({
  name: isString,
  age: isNumber,
});

// Use different configs for different scenarios
const invalidUser = { name: 123, age: '30' };

isUser(invalidUser, basicConfig);    // Combined errors (default)
isUser(invalidUser, singleConfig);   // Single error only
isUser(invalidUser, jsonConfig);     // JSON tree
```

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

## 🛠️ Ecosystem Packages

The Guardz ecosystem consists of four complementary packages:

### 📦 `guardz` (Core)
The foundation package providing comprehensive type guards with structured error handling.

**Features:**
- 50+ built-in type guards
- Structured error messages
- Custom error handling
- Zero dependencies
- Full TypeScript support

### 🎯 `guardz-event`
Safe event handling library with type validation, security checks, and error handling.

**Features:**
- Type-safe event handlers for browser events
- Multiple ergonomic APIs (onEvent, onMessage, safeHandler)
- Security features (origin validation, source validation)
- Tolerance mode for graceful degradation
- Built on top of guardz for robust runtime validation

**Quick Start:**
```typescript
import { onMessage, safeHandler } from 'guardz-event';

const isChatMessage = (data: unknown): data is { text: string; userId: string } => {
  return typeof data === 'object' && data !== null && 
         typeof (data as any).text === 'string' && 
         typeof (data as any).userId === 'string';
};

// Simple usage
window.addEventListener('message', onMessage(isChatMessage, {
  onSuccess: (data) => console.log('Received:', data.text),
  onError: (error) => console.error('Error:', error)
}));
```

**[📖 Read the full documentation →](https://github.com/thiennp/guardz/tree/main/guardz-event)**

### 🌐 `guardz-axios`
Type-safe HTTP client with runtime validation built on top of Axios.

**Features:**
- Type-safe HTTP requests
- Multiple API patterns
- Comprehensive error handling
- Retry logic with backoff strategies
- Tolerance mode for graceful degradation

**[📖 Read the full documentation →](https://github.com/thiennp/guardz/tree/main/guardz-axios)**

### 🔧 `guardz-generator`
Automatically generate type guards from TypeScript interfaces and type aliases.

**Features:**
- Automatic generation from TypeScript types
- Generic support for complex structures
- Advanced recursion detection
- Cross-file references
- CLI and programmatic APIs

**[📖 Read the full documentation →](https://github.com/thiennp/guardz/tree/main/guardz-generator)**

## 🎯 **Ready to Get Started?**

Guardz makes runtime type safety **incredibly simple**. No complex setup, no heavy dependencies, just pure TypeScript goodness.

```typescript
import { isType, isString, isNumber } from 'guardz';

// That's literally it. You're ready to go.
const isUser = isType({ name: isString, age: isNumber });
```

**Why developers love Guardz:**
- 🚀 **Zero friction** - Works immediately, no configuration needed
- 📦 **Ultra lightweight** - ~1.7KB gzipped, zero dependencies
- 🎯 **TypeScript native** - No generated types, no complex schemas
- 🔧 **Drop-in ready** - Works with your existing code
- 🛡️ **Smart defaults** - Multi-mode error handling for better UX out of the box
- ⚡ **Performance optimized** - Choose the right error mode for your use case

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
