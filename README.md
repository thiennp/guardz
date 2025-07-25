# 🛡️ Guardz

[![NPM Version](https://img.shields.io/npm/v/guardz)](https://www.npmjs.com/package/guardz)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/thiennp/guardz/actions/workflows/ci.yml/badge.svg)](https://github.com/thiennp/guardz/actions/workflows/ci.yml)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/guardz)](https://bundlephobia.com/package/guardz)
[![GitHub Sponsors](https://img.shields.io/github/sponsors/thiennp?style=flat)](https://github.com/sponsors/thiennp)

**Lightweight, zero-dependency TypeScript type guards for runtime validation with structured error handling.**

> **The easiest way to add runtime type safety to your TypeScript projects — works with React, Angular, Vue, Node.js, and more. No complex schemas, no heavy dependencies.**

**Perfect for:** React form validation, Node.js API validation, TypeScript runtime type checking, Express middleware validation, Next.js server-side props, Angular services, Vue.js composition API, and any TypeScript project needing lightweight runtime validation.

## 📋 Table of Contents

- [🚀 Quick Start](#-quick-start)
- [✨ Features](#-features)
- [📦 Installation](#-installation)
- [🎯 Core Concepts](#-core-concepts)
- [📖 Examples](#-examples)
- [🔧 API Reference](#-api-reference)
- [⚡ Performance](#-performance)
- [🌐 Ecosystem](#-ecosystem)
- [🤝 Contributing](#-contributing)

---

## 🚀 Quick Start

**Get started in 30 seconds:**

```typescript
import { isType, isString, isNumber } from 'guardz';

// Define your type guard
const isUser = isType({
  name: isString,
  age: isNumber,
});

// Validate data
const data: unknown = { name: 'John', age: 30 };
if (isUser(data)) {
  // TypeScript knows this is safe
  console.log(data.name.toUpperCase()); // ✅ Works
  console.log(data.age.toFixed(2));     // ✅ Works
}
```

**With error handling:**

```typescript
const errors: string[] = [];
const config = {
  identifier: 'user',
  callbackOnError: (error: string) => errors.push(error),
};

const invalidData = { name: 'John', age: '30' }; // age should be number
isUser(invalidData, config);
// errors: ['Expected user.age ("30") to be "number"']
```

---

## ✨ Features

### 🎯 **Core Benefits**
- **🚀 Zero Setup** - Import and use immediately
- **📦 Ultra Lightweight** - ~1.7KB gzipped, zero dependencies
- **🎯 TypeScript Native** - Perfect type inference and safety
- **🛡️ Structured Errors** - Know exactly what failed and why
- **⚡ Performance Optimized** - Choose the right error mode for your use case

### 🔧 **Advanced Features**
- **📊 JSON Tree Feedback** - Comprehensive validation analysis
- **🎛️ Multiple Error Modes** - Single, multi, and JSON tree modes
- **🌐 Ecosystem Integration** - Event handling, HTTP clients, code generation
- **🔍 Nested Validation** - Deep object and array validation
- **📝 Template Literal Support** - Easy debugging and logging
- **🚀 Framework Agnostic** - Works with React, Angular, Vue, Node.js, and more

---

## 📦 Installation

```bash
npm install guardz
# or
yarn add guardz
# or
pnpm add guardz
```

### Bundle Size
- **Gzipped**: ~1.7KB
- **Uncompressed**: ~11.7KB
- **Dependencies**: Zero

---

## 🎯 Core Concepts

### **Structured Error Handling**

Guardz's most important feature is its structured error reporting:

- **What failed** (the value and its field)
- **Where it failed** (the property path)
- **What was expected** (the type or constraint)

```typescript
// Clear, actionable error messages
"Expected user.age ("30") to be "number""
"Expected user.details.email (123) to be "string""
"Expected users[2].isActive (null) to be "boolean""
```

### **Error Modes**

Guardz supports three error modes optimized for different use cases:

#### **Multi Mode (Default)**
Collects all validation errors in a single combined message:

```typescript
const config = {
  identifier: 'user',
  callbackOnError: (error: string) => console.log(error),
  // errorMode: 'multi' (default)
};

// Output: "Expected user.name (123) to be "string"; Expected user.age ("30") to be "number""
```

**Best for:** General validation, user feedback, and debugging scenarios.

#### **Single Mode**
Stops validation at the first error for maximum performance:

```typescript
const config = {
  identifier: 'user',
  callbackOnError: (error: string) => console.log(error),
  errorMode: 'single' as const,
};

// Output: "Expected user.name (123) to be "string""
```

**Best for:** Performance-critical scenarios and fail-fast validation.

#### **JSON Tree Mode**
Provides structured JSON feedback with complete validation state:

```typescript
const config = {
  identifier: 'user',
  callbackOnError: (error: string) => console.log(error),
  errorMode: 'json' as const,
};

// Output: Complete JSON tree with valid/invalid branches
```

**Best for:** Complex DTOs with related fields, monitoring systems, and comprehensive analysis.

### **Performance Considerations**

| Mode | Performance | Use Case |
|------|-------------|----------|
| **Single** | Fastest | High-frequency validation, API validation |
| **Multi** | Moderate | General validation, form validation |
| **JSON Tree** | Highest overhead | Complex analysis, monitoring systems |

---

## 📖 Examples

### **Basic Object Validation**

```typescript
import { isType, isString, isNumber, isBoolean } from 'guardz';

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

// Usage
const userData: unknown = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  isActive: true,
};

if (isUser(userData)) {
  // TypeScript knows this is a User
  console.log(userData.name.toUpperCase());
}
```

### **Nested Object Validation**

```typescript
import { isType, isString, isNumber, isArray } from 'guardz';

const isAddress = isType({
  street: isString,
  city: isString,
  zipCode: isString,
});

const isUserProfile = isType({
  name: isString,
  age: isNumber,
  address: isAddress,
  phoneNumbers: isArray(isString),
});

// Validates deeply nested structures
const profileData = {
  name: 'Jane',
  age: 30,
  address: {
    street: '123 Main St',
    city: 'New York',
    zipCode: '10001',
  },
  phoneNumbers: ['555-1234', '555-5678'],
};

if (isUserProfile(profileData)) {
  // Fully typed access
  console.log(profileData.address.city);
}
```

### **Array Validation**

```typescript
import { isType, isString, isNumber, isArray } from 'guardz';

const isStringArray = isArray(isString);
const isNumberArray = isArray(isNumber);

const isUserList = isType({
  users: isArray(isType({
    name: isString,
    age: isNumber,
  })),
  totalCount: isNumber,
});

// Validates array contents
const userList = {
  users: [
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 30 },
  ],
  totalCount: 2,
};
```

### **Union Types**

```typescript
import { isType, isString, isNumber, isOneOf } from 'guardz';

const isStatus = isOneOf(['active', 'inactive', 'pending'] as const);
const isId = isOneOf([isString, isNumber]); // string or number

const isEntity = isType({
  id: isId,
  status: isStatus,
  name: isString,
});
```

### **Error Handling with Configuration**

```typescript
import { isType, isString, isNumber } from 'guardz';

const errors: string[] = [];
const config = {
  identifier: 'api_response',
  callbackOnError: (error: string) => errors.push(error),
  errorMode: 'multi' as const, // default
};

const isApiResponse = isType({
  status: isString,
  data: isType({
    id: isNumber,
    name: isString,
  }),
});

const invalidResponse = {
  status: 200, // should be string
  data: {
    id: '123', // should be number
    name: 456, // should be string
  },
};

isApiResponse(invalidResponse, config);
// errors: [
//   'Expected api_response.status (200) to be "string"; Expected api_response.data.id ("123") to be "number"; Expected api_response.data.name (456) to be "string"'
// ]
```

### **JSON Tree for Monitoring**

```typescript
import { isType, isString, isNumber } from 'guardz';

const config = {
  identifier: 'user',
  callbackOnError: (error: string) => {
    const errorTree = JSON.parse(error);
    // Send to monitoring system
    monitoringService.captureError({
      type: 'validation_error',
      data: errorTree,
      timestamp: new Date().toISOString(),
    });
  },
  errorMode: 'json' as const,
};

const isUser = isType({
  name: isString,
  age: isNumber,
});

const invalidUser = {
  name: 123, // should be string
  age: '30', // should be number
};

isUser(invalidUser, config);
// Sends structured JSON tree to monitoring system
```

### **Framework Integration Examples**

#### **React & Next.js**

```typescript
import { isType, isString, isNumber } from 'guardz';

// Form validation in React
const isFormData = isType({
  email: isString,
  password: isString,
  age: isNumber,
});

const handleSubmit = (formData: unknown) => {
  const errors: string[] = [];
  const config = {
    identifier: 'form',
    callbackOnError: (error: string) => errors.push(error),
  };

  if (isFormData(formData, config)) {
    // TypeScript knows this is safe
    console.log('Valid form data:', formData.email);
  } else {
    console.log('Validation errors:', errors);
  }
};

// API response validation in Next.js
const isApiResponse = isType({
  data: isType({
    users: isArray(isType({
      id: isNumber,
      name: isString,
    })),
  }),
});

export async function getServerSideProps() {
  const response = await fetch('/api/users');
  const data: unknown = await response.json();
  
  if (isApiResponse(data)) {
    return { props: { users: data.data.users } };
  }
  
  return { props: { users: [] } };
}
```

#### **Angular**

```typescript
import { isType, isString, isNumber } from 'guardz';

// Service with type validation
@Injectable()
export class UserService {
  private isUser = isType({
    id: isNumber,
    name: isString,
    email: isString,
  });

  async getUser(id: number): Promise<User | null> {
    try {
      const response = await this.http.get(`/api/users/${id}`).toPromise();
      const data: unknown = response;
      
      if (this.isUser(data)) {
        return data; // Fully typed as User
      }
      
      console.error('Invalid user data received');
      return null;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      return null;
    }
  }
}
```

#### **Vue.js**

```typescript
import { isType, isString, isNumber } from 'guardz';

// Composition API with validation
export function useUserValidation() {
  const isUser = isType({
    id: isNumber,
    name: isString,
    email: isString,
  });

  const validateUser = (data: unknown): User | null => {
    const errors: string[] = [];
    const config = {
      identifier: 'user',
      callbackOnError: (error: string) => errors.push(error),
    };

    if (isUser(data, config)) {
      return data;
    }
    
    console.error('Validation errors:', errors);
    return null;
  };

  return { validateUser };
}

// In your Vue component
export default {
  setup() {
    const { validateUser } = useUserValidation();
    
    const handleUserData = (data: unknown) => {
      const user = validateUser(data);
      if (user) {
        // TypeScript knows this is a valid User
        console.log(user.name);
      }
    };

    return { handleUserData };
  },
};
```

#### **Node.js & Express**

```typescript
import { isType, isString, isNumber } from 'guardz';

// Express middleware for request validation
const isCreateUserRequest = isType({
  body: isType({
    name: isString,
    email: isString,
    age: isNumber,
  }),
});

const validateUserRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors: string[] = [];
  const config = {
    identifier: 'request',
    callbackOnError: (error: string) => errors.push(error),
  };

  if (isCreateUserRequest(req, config)) {
    // TypeScript knows req.body is properly typed
    console.log('Valid request body:', req.body.name);
    next();
  } else {
    res.status(400).json({ errors });
  }
};

// API route with validation
app.post('/users', validateUserRequest, (req: Request, res: Response) => {
  // req.body is guaranteed to be valid
  const { name, email, age } = req.body;
  // Create user logic...
});
```

---

## 🔧 API Reference

### **Core Type Guards**

#### **Object Validation**
- **`isType<T>(schema)`** - Validate objects against a schema
- **`isObject`** - Check if value is a plain object
- **`isObjectWith<T>(properties)`** - Validate object has specific properties

#### **Primitive Type Guards**
- **`isString`** - Check if value is a string
- **`isNumber`** - Check if value is a number
- **`isBoolean`** - Check if value is a boolean
- **`isNull`** - Check if value is null
- **`isUndefined`** - Check if value is undefined
- **`isSymbol`** - Check if value is a symbol
- **`isBigInt`** - Check if value is a BigInt

#### **Array Type Guards**
- **`isArray<T>(itemGuard)`** - Validate arrays with item validation
- **`isArrayBuffer`** - Check if value is an ArrayBuffer
- **`isDataView`** - Check if value is a DataView

#### **Function Type Guards**
- **`isFunction`** - Check if value is a function
- **`isAsyncFunction`** - Check if value is an async function
- **`isGeneratorFunction`** - Check if value is a generator function

#### **Date & Time Type Guards**
- **`isDate`** - Check if value is a Date object
- **`isValidDate`** - Check if value is a valid Date

#### **Collection Type Guards**
- **`isMap<K, V>(keyGuard, valueGuard)`** - Validate Map objects
- **`isSet<T>(itemGuard)`** - Validate Set objects
- **`isWeakMap`** - Check if value is a WeakMap
- **`isWeakSet`** - Check if value is a WeakSet

#### **RegExp Type Guards**
- **`isRegExp`** - Check if value is a RegExp object

#### **Error Type Guards**
- **`isError`** - Check if value is an Error object

#### **Union Type Guards**
- **`isOneOf<T>(values)`** - Check if value matches one of several values
- **`isOneOfTypes<T>(guards)`** - Check if value matches one of several type guards

#### **Composite Type Guards**
- **`isIntersectionOf<T>(guards)`** - Validate intersection types (A & B & C)
- **`isExtensionOf<T, U>(baseGuard, extensionGuard)`** - Validate inheritance patterns

#### **Nullable/Optional Type Guards**
- **`isNullOr<T>(guard)`** - Check if value is null or matches type
- **`isUndefinedOr<T>(guard)`** - Check if value is undefined or matches type
- **`isNilOr<T>(guard)`** - Check if value is null/undefined or matches type

#### **Special Type Guards**
- **`isAsserted<T>()`** - Always returns true (for 3rd party types)
- **`isEnum<T>(enumObj)`** - Check if value matches enum values
- **`isEqualTo<T>(value)`** - Check if value exactly equals specific value
- **`isGeneric<T>(guard)`** - Create reusable type guard functions

### **Configuration**

```typescript
interface TypeGuardFnConfig {
  callbackOnError: (error: string) => void;
  identifier?: string;
  errorMode?: 'single' | 'multi' | 'json';
}
```

- **`callbackOnError`** (required): Function called when validation errors occur
- **`identifier`** (optional): Prefix for error messages
- **`errorMode`** (optional): Controls error collection and formatting

---

## ⚡ Performance

### **Bundle Size**
- **Gzipped**: ~1.7KB
- **Uncompressed**: ~11.7KB
- **Tree-shakeable**: Only import what you use

### **Runtime Performance**
- **Single Mode**: Fastest - stops at first error
- **Multi Mode**: Moderate - validates all fields efficiently
- **JSON Tree Mode**: Highest overhead - builds complete validation tree

### **Benchmarks**
```bash
npm run test:performance
```

---

## 🌐 Ecosystem

Guardz is part of a comprehensive ecosystem for type-safe development:

### **🎯 `guardz-event`**
Safe event handling with type validation and security checks.

```bash
npm install guardz-event
```

### **🌐 `guardz-axios`**
Type-safe HTTP client with runtime validation.

```bash
npm install guardz-axios
```

### **🔧 `guardz-generator`**
Automatically generate type guards from TypeScript interfaces.

```bash
npm install guardz-generator
```

---

## 🚀 Developer Experience & AI Search Optimization

### **Why Developers Choose Guardz**

**🔍 AI Search Friendly:**
- **Framework Agnostic**: Works seamlessly with React, Angular, Vue, Node.js, Express, Next.js, NestJS
- **Build Tool Compatible**: Optimized for Webpack, Vite, Rollup, esbuild, SWC
- **Testing Framework Ready**: Perfect for Jest, Vitest, Cypress, Playwright
- **Cloud Platform Optimized**: Deploy on AWS, Azure, GCP, Vercel, Netlify
- **Modern Runtime Support**: Compatible with Node.js, Deno, Bun

**⚡ Performance Optimized:**
- **Tree-shakeable**: Only import what you use
- **Bundle size optimized**: ~1.7KB gzipped
- **Zero dependencies**: No bloat, no conflicts
- **Runtime efficient**: Minimal overhead with smart error modes

**🎯 Developer Productivity:**
- **Zero configuration**: Works out of the box
- **TypeScript native**: Perfect type inference
- **Familiar syntax**: If you know TypeScript, you know Guardz
- **Comprehensive examples**: Real-world usage patterns for every framework

### **Search Keywords for AI & Developers**

Guardz is optimized for discovery by AI search engines and developers looking for:

- **"TypeScript runtime validation"** - Core functionality
- **"React form validation"** - Frontend use cases
- **"Node.js API validation"** - Backend use cases
- **"Type guards for Express"** - Framework-specific needs
- **"Lightweight validation library"** - Performance-focused developers
- **"Zero dependency type checking"** - Bundle size conscious teams
- **"TypeScript schema validation"** - Alternative to Zod/Joi
- **"Runtime type safety"** - Core value proposition
- **"API response validation"** - Common use case
- **"Form validation TypeScript"** - Frontend validation needs

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Setup**

```bash
git clone https://github.com/thiennp/guardz.git
cd guardz
npm install
npm test
```

### **Code Style**
- Follow existing code style and formatting
- Add tests for new features
- Update documentation as needed

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🚀 Ready to Get Started?

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
- 🌐 **Framework agnostic** - Works with React, Angular, Vue, Node.js, and more
- 🔍 **AI search optimized** - Easy to discover and integrate

---

## 📞 Support

- 📖 **Documentation** - This README contains comprehensive examples
- 🐛 **Issues** - Report bugs on [GitHub Issues](https://github.com/thiennp/guardz/issues)
- 💬 **Discussions** - Ask questions on [GitHub Discussions](https://github.com/thiennp/guardz/discussions)

### **Show Your Support**
- ⭐ **Star** the repository on GitHub
- 🍺 **Buy me a beer** - [PayPal](https://paypal.me/thiennp)
- 📢 **Share** with your team and community
