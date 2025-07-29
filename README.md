# 🛡️ Guardz

[![NPM Version](https://img.shields.io/npm/v/guardz)](https://www.npmjs.com/package/guardz)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/thiennp/guardz/actions/workflows/ci.yml/badge.svg)](https://github.com/thiennp/guardz/actions/workflows/ci.yml)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/guardz)](https://bundlephobia.com/package/guardz)
[![GitHub Sponsors](https://img.shields.io/github/sponsors/thiennp?style=flat)](https://github.com/sponsors/thiennp)

**Lightweight, zero-dependency TypeScript type guards for runtime validation with structured error handling.**

> **The easiest way to add runtime type safety to your TypeScript projects — works with React, Angular, Vue, Node.js, and more. No complex schemas, no heavy dependencies.**

**Perfect for:** TypeScript runtime type checking, e.g. React form validation, Node.js API validation, Express middleware validation, Next.js server-side props, Angular services, Vue.js composition API, and any TypeScript project needing lightweight runtime validation.

## 📋 Table of Contents

- [🚀 Quick Start](#-quick-start)
- [🔧 Creating Custom Guards](#-creating-custom-guards)
- [✨ Features](#-features)
- [📦 Installation](#-installation)
- [🎯 Core Concepts](#-core-concepts)
- [📖 Examples](#-examples)
- [🔧 API Reference](#-api-reference)
- [🔄 Type Converters](#-type-converters)
- [⚡ Performance](#-performance)
- [🌐 Ecosystem](#-ecosystem)
- [🎯 For Best Results: Use guardz-generator](#-for-best-results-use-guardz-generator)
- [🤝 Contributing](#-contributing)

---

## 🚀 Quick Start

**Get started in 30 seconds:**

```typescript
import { isSchema, isString, isNumber } from 'guardz';

// Define your type guard
const isUser = isSchema({
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

**With branded types and converters:**

```typescript
import { isSchema, isString, isNumeric, toNumber } from 'guardz';

const isUser = isSchema({
  name: isString,
  age: isNumeric, // Accepts both numbers and numeric strings
});

const data: unknown = { name: 'John', age: '25' };
if (isUser(data)) {
  const age = toNumber(data.age); // Convert to real number
  console.log(age.toFixed(2)); // "25.00"
}
```

**With custom branded types:**

```typescript
import { isBranded, type Branded, isSchema, isString } from 'guardz';

// Define custom branded types
type Email = Branded<string, 'Email'>;
type UserId = Branded<number, 'UserId'>;

// Create custom type guards
const isEmail = isBranded<Email>((value) => {
  if (typeof value !== 'string' || !value.includes('@')) {
    throw new Error('Invalid email format');
  }
});

const isUserId = isBranded<UserId>((value) => {
  if (typeof value !== 'number' || value <= 0) {
    throw new Error('User ID must be a positive number');
  }
});

// Use in schemas
const isUser = isSchema({
  id: isUserId,
  email: isEmail,
  name: isString,
});

const data: unknown = { id: 123, email: 'user@example.com', name: 'John' };
if (isUser(data)) {
  // data.id is typed as UserId, data.email is typed as Email
  console.log(data.id);    // number & { __brand: 'UserId' }
  console.log(data.email); // string & { __brand: 'Email' }
}
```

---

## 🎯 **Schema-Based Validation with `isSchema`**

**`isSchema` is the recommended way to validate objects** - it provides better support for nested structures and improved error messages compared to `isType`.

### **Key Benefits of `isSchema`:**
- ✅ **Automatic nested type handling** - No need for explicit `isType` calls for each level
- ✅ **Better error messages** - More descriptive validation failures for nested structures
- ✅ **Inline object definitions** - Define nested objects directly in the schema
- ✅ **Array support** - Handle arrays of objects with inline definitions
- ✅ **Backward compatible** - Works with existing type guard patterns

### **Basic Usage:**
```typescript
import { isSchema, isString, isNumber, isBoolean } from 'guardz';

// Simple object validation
const isUser = isSchema({
  name: isString,
  age: isNumber,
  active: isBoolean,
});

// Nested object validation (no need for explicit isType calls)
const isUserProfile = isSchema({
  id: isNumber,
  name: isString,
  address: {
    street: isString,
    city: isString,
    zipCode: isNumber,
  },
  preferences: {
    theme: isString,
    notifications: isBoolean,
  },
});

// Array validation with inline object definitions
const isUserList = isSchema({
  users: [{
    id: isNumber,
    name: isString,
    email: isString,
  }],
  total: isNumber,
});
```

### **Complex Nested Structures:**
```typescript
import { isSchema, isString, isNumber, isBoolean } from 'guardz';

const isComplexUser = isSchema({
  id: isNumber,
  profile: {
    name: isString,
    email: isString,
    contacts: [{
      type: isString,
      value: isString,
    }],
  },
  settings: {
    theme: isString,
    notifications: {
      email: isBoolean,
      push: isBoolean,
      sms: isBoolean,
    },
  },
  metadata: {
    createdAt: isString,
    updatedAt: isString,
    tags: [isString],
  },
});
```

### **Error Handling with `isSchema`:**
```typescript
const errors: string[] = [];
const config = {
  identifier: 'user',
  callbackOnError: (error: string) => errors.push(error),
};

const invalidData = {
  name: 'John',
  age: '30', // Should be number
  address: {
    street: '123 Main St',
    city: 'Anytown',
    zipCode: 'ABC123', // Should be number
  },
};

isUserProfile(invalidData, config);
// errors: [
//   'Expected user.age ("30") to be "number"',
//   'Expected user.address.zipCode ("ABC123") to be "number"'
// ]
```

### **Aliases for Flexibility:**
```typescript
import { isSchema, isShape, isNestedType } from 'guardz';

// All three are equivalent - choose the name that fits your style
const isUser1 = isSchema({ name: isString, age: isNumber });
const isUser2 = isShape({ name: isString, age: isNumber });
const isUser3 = isNestedType({ name: isString, age: isNumber });
```

---

## 🔧 **Creating Custom Guards**

For most use cases, we recommend using `guardz-generator` to automatically generate type guards from your TypeScript interfaces. However, when you need custom validation logic or are working with third-party types, you can create custom guards.

**When to create custom guards:**
- ✅ You need custom validation logic beyond type checking
- ✅ You're working with third-party types that can't be generated
- ✅ You need performance optimizations for specific use cases
- ✅ You want to add business logic validation

### **Using `isBranded` for Custom Type Guards**

The `isBranded` utility allows you to create custom type guards for branded types with your own validation logic. This is perfect for creating domain-specific types with custom validation rules.

#### **Basic Pattern:**
```typescript
import { isBranded, type Branded } from 'guardz';

// Define a branded type
type UserId = Branded<number, 'UserId'>;

// Create a type guard with custom validation
const isUserId = isBranded<UserId>((value) => {
  if (typeof value !== 'number' || value <= 0 || !Number.isInteger(value)) {
    throw new Error('UserId must be a positive integer');
  }
});

// Usage
const data: unknown = 123;
if (isUserId(data)) {
  // data is now typed as UserId
  console.log(data); // number & { __brand: 'UserId' }
}
```

#### **Email Validation Example:**
```typescript
type Email = Branded<string, 'Email'>;

const isEmail = isBranded<Email>((value) => {
  if (typeof value !== 'string') {
    throw new Error('Email must be a string');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    throw new Error('Invalid email format');
  }
});

// Usage with error handling
const errors: string[] = [];
const config = {
  callbackOnError: (error: string) => errors.push(error),
  identifier: 'email'
};

isEmail('invalid-email', config); // false, adds error to array
```

#### **Complex Validation Example:**
```typescript
type Age = Branded<number, 'Age'>;

const isAge = isBranded<Age>((value) => {
  if (typeof value !== 'number') {
    throw new Error('Age must be a number');
  }
  if (!Number.isInteger(value)) {
    throw new Error('Age must be an integer');
  }
  if (value < 0) {
    throw new Error('Age cannot be negative');
  }
  if (value > 150) {
    throw new Error('Age cannot exceed 150');
  }
});
```

#### **Password Validation Example:**
```typescript
type Password = Branded<string, 'Password'>;

const isPassword = isBranded<Password>((value) => {
  if (typeof value !== 'string') {
    throw new Error('Password must be a string');
  }
  if (value.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(value)) {
    throw new Error('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(value)) {
    throw new Error('Password must contain at least one lowercase letter');
  }
  if (!/\d/.test(value)) {
    throw new Error('Password must contain at least one digit');
  }
});
```

#### **API Response Validation:**
```typescript
type ApiResponse<T> = Branded<T, 'ApiResponse'>;

const isValidApiResponse = isBranded<ApiResponse<any>>((value) => {
  if (typeof value !== 'object' || value === null) {
    throw new Error('API response must be an object');
  }
  if (!('status' in value) || typeof value.status !== 'number') {
    throw new Error('API response must have a numeric status');
  }
  if (!('data' in value)) {
    throw new Error('API response must have data property');
  }
});
```

#### **URL Validation:**
```typescript
type URL = Branded<string, 'URL'>;

const isURL = isBranded<URL>((value) => {
  if (typeof value !== 'string') {
    throw new Error('URL must be a string');
  }
  try {
    new URL(value);
  } catch {
    throw new Error('Invalid URL format');
  }
});
```

#### **Integration with Schema Validation:**
```typescript
import { isSchema, isString, isNumber } from 'guardz';

// Use branded types in schemas
const isUser = isSchema({
  id: isUserId,        // Custom branded type guard
  email: isEmail,      // Custom branded type guard
  age: isAge,          // Custom branded type guard
  name: isString,      // Built-in type guard
  active: isNumber,    // Built-in type guard
});

// Usage
const userData: unknown = {
  id: 123,
  email: 'user@example.com',
  age: 25,
  name: 'John Doe',
  active: 1
};

if (isUser(userData)) {
  // All properties are properly typed with branded types
  console.log(userData.id);    // UserId
  console.log(userData.email); // Email
  console.log(userData.age);   // Age
}
```

#### **Error Handling with Branded Types:**
```typescript
function validateUserInput(data: {
  userId: unknown;
  email: unknown;
  age: unknown;
}) {
  const errors: string[] = [];
  const config = {
    callbackOnError: (error: string) => errors.push(error),
  };

  // Validate each field with custom branded types
  if (!isUserId(data.userId, { ...config, identifier: 'userId' })) {
    return { valid: false, errors };
  }

  if (!isEmail(data.email, { ...config, identifier: 'email' })) {
    return { valid: false, errors };
  }

  if (!isAge(data.age, { ...config, identifier: 'age' })) {
    return { valid: false, errors };
  }

  return { 
    valid: true, 
    data: data as { userId: UserId; email: Email; age: Age } 
  };
}
```

### **Benefits of `isBranded`:**

- **🎯 Type Safety**: Provides proper TypeScript type narrowing
- **🔧 Custom Logic**: Full control over validation rules
- **📝 Clear Errors**: Descriptive error messages for validation failures
- **🔄 Integration**: Works seamlessly with existing guardz utilities
- **⚡ Performance**: Lightweight and efficient validation
- **🛡️ Branded Types**: Prevents type confusion in your codebase

### **When to Use `isBranded`:**

- ✅ **Domain-specific validation** (emails, passwords, IDs)
- ✅ **Business rule validation** (age limits, format requirements)
- ✅ **API response validation** (status codes, data structures)
- ✅ **Form validation** (complex input requirements)
- ✅ **Data transformation validation** (ensuring data integrity)

**Basic pattern for traditional custom guards:**
```typescript
import { isSchema, isString, isNumber } from 'guardz';

export function isCustomType(value: unknown): value is CustomType {
  return isSchema<CustomType>({
    // Define your validation schema here
    id: isNumber,
    name: isString,
  })(value);
}
```

See the [Examples](#-examples) section for more detailed patterns including recursive types.

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
import { isSchema, isString, isNumber, isBoolean } from 'guardz';

interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

const isUser = isSchema<User>({
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
import { isSchema, isString, isNumber, isArray } from 'guardz';

const isAddress = isSchema({
  street: isString,
  city: isString,
  zipCode: isString,
});

const isUserProfile = isSchema({
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
import { isSchema, isString, isNumber, isArray } from 'guardz';

const isStringArray = isArray(isString);
const isNumberArray = isArray(isNumber);

const isUserList = isSchema({
  users: isArray(isSchema({
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

### **Custom Guards**

```typescript
import { isType, isString, isNumber, isBoolean, type TypeGuardFnConfig } from 'guardz';

// Simple custom guard
export function isUser(value: unknown, config?: TypeGuardFnConfig): value is User {
  return isType<User>({
    id: isNumber,
    name: isString,
    email: isString,
    isActive: isBoolean,
  })(value, config);
}

// With optional fields
export function isProfile(value: unknown, config?: TypeGuardFnConfig): value is Profile {
  return isType<Profile>({
    name: isString,
    age: isNumber,
    bio: isUndefinedOr(isString), // Optional field
  })(value, config);
}
```

### **Recursive Types**

```typescript
import { isType, isString, isNumber, isUndefinedOr, isArrayWithEachItem, type TypeGuardFnConfig } from 'guardz';

// Simple recursive type
interface Comment {
  id: number;
  text: string;
  replies?: Comment[]; // Optional recursive array
}

export function isComment(value: unknown, config?: TypeGuardFnConfig): value is Comment {
  return isType<Comment>({
    id: isNumber,
    text: isString,
    replies: isUndefinedOr(isArrayWithEachItem(isComment)),
  })(value, config);
}
```

### **Index Signature Validation**

```typescript
import { isIndexSignature, isString, isNumber, isBoolean, isOneOfTypes } from 'guardz';

// String-keyed objects with number values
const isStringNumberMap = isIndexSignature(isString, isNumber);

// Number-keyed objects with boolean values  
const isNumberBooleanMap = isIndexSignature(isNumber, isBoolean);

// Complex value types
const isStringUnionMap = isIndexSignature(
  isString, 
  isOneOfTypes(isString, isNumber, isBoolean)
);

// Usage examples
const userAges = { alice: 25, bob: 30, charlie: 35 };
const featureFlags = { 1: true, 2: false, 3: true };
const mixedData = { name: "John", age: 30, active: true };

console.log(isStringNumberMap(userAges)); // true
console.log(isNumberBooleanMap(featureFlags)); // true
console.log(isStringUnionMap(mixedData)); // true

// Type narrowing
if (isStringNumberMap(userAges)) {
  // TypeScript knows userAges is { [key: string]: number }
  Object.entries(userAges).forEach(([name, age]) => {
    console.log(`${name}: ${age * 2}`); // Safe arithmetic
  });
}
```

### **Combining Index Signatures with Specific Properties**

```typescript
import { isIndexSignature, isIntersectionOf, isType, isString, isNumber, isBoolean } from 'guardz';

interface Config {
  [key: string]: string | number | boolean;
  name: string;
  version: string;
  debug: boolean;
}

// Define the index signature part
const isStringIndex = isIndexSignature(isString, isOneOfTypes(isString, isNumber, isBoolean));

// Define the specific properties
const isConfigProperties = isType({
  name: isString,
  version: isString,
  debug: isBoolean
});

// Combine them using intersection
const isConfig = isIntersectionOf(isStringIndex, isConfigProperties);

const config: unknown = {
  name: "myApp",
  version: "1.0.0",
  debug: true,
  apiUrl: "https://api.example.com",
  timeout: 5000
};

if (isConfig(config)) {
  // TypeScript knows config has both specific properties AND index signature
  console.log(config.name); // string
  console.log(config.apiUrl); // string | number | boolean
}
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
- **`isSchema<T>(schema)`** - Validate objects with improved nested type support (recommended)
  - Automatically handles nested object structures
  - Better error messages for nested validation failures
  - Supports inline object definitions and arrays
- **`isShape<T>(schema)`** - Alias for `isSchema` (alternative naming)
- **`isNestedType<T>(schema)`** - Alias for `isSchema` (alternative naming)
- **`isType<T>(schema)`** - Legacy object validation (use `isSchema` for better nested support)
  - Requires explicit `isType` calls for nested objects
  - Simpler but less powerful than `isSchema`
- **`isObject`** - Check if value is a plain object
- **`isObjectWith<T>(properties)`** - Validate object has specific properties
- **`isObjectWithEachItem<T>(itemGuard)`** - Validate objects where all values match a type guard
- **`isPartialOf<T>(schema)`** - Validate objects that match a partial schema

#### **Primitive Type Guards**
- **`isString`** - Check if value is a string
- **`isNonEmptyString`** - Check if value is a non-empty string
- **`isNumber`** - Check if value is a number
- **`isNumeric`** - Check if value is numeric (number or string number)
- **`isPositiveNumber`** - Check if value is a positive number
- **`isNegativeNumber`** - Check if value is a negative number
- **`isNonNegativeNumber`** - Check if value is a non-negative number
- **`isNonPositiveNumber`** - Check if value is a non-positive number
- **`isInteger`** - Check if value is an integer
- **`isPositiveInteger`** - Check if value is a positive integer
- **`isNegativeInteger`** - Check if value is a negative integer
- **`isNonNegativeInteger`** - Check if value is a non-negative integer
- **`isNonPositiveInteger`** - Check if value is a non-positive integer
- **`isBooleanLike`** - Check if value is boolean-like (boolean, "true"/"false", 1/0)
- **`isDateLike`** - Check if value is date-like (Date, date string, timestamp)
- **`isBoolean`** - Check if value is a boolean
- **`isNull`** - Check if value is null
- **`isUndefined`** - Check if value is undefined
- **`isDefined`** - Check if value is not null or undefined
- **`isSymbol`** - Check if value is a symbol
- **`isBigInt`** - Check if value is a BigInt

#### **Array Type Guards**
- **`isArrayWithEachItem<T>(itemGuard)`** - Validate arrays where all items match a type guard
- **`isNonEmptyArray`** - Check if value is a non-empty array
- **`isNonEmptyArrayWithEachItem<T>(itemGuard)`** - Validate non-empty arrays where all items match a type guard
- **`isTuple<T>(itemGuards)`** - Validate tuples with specific item types
- **`isArray<T>(itemGuard)`** - Validate arrays with item validation
- **`isArrayBuffer`** - Check if value is an ArrayBuffer
- **`isDataView`** - Check if value is a DataView

#### **Function Type Guards**
- **`isFunction`** - Check if value is a function
- **`isAsyncFunction`** - Check if value is an async function
- **`isGeneratorFunction`** - Check if value is a generator function

#### **Date & Time Type Guards**
- **`isDate`** - Check if value is a Date object
- **`isDateLike`** - Check if value is date-like (Date, date string, timestamp)

#### **Collection Type Guards**
- **`isMap<K, V>(keyGuard, valueGuard)`** - Validate Map objects
- **`isSet<T>(itemGuard)`** - Validate Set objects
- **`isIndexSignature<K, V>(keyGuard, valueGuard)`** - Validate objects with index signatures

#### **Web API Type Guards**
- **`isFile`** - Check if value is a File object
- **`isFileList`** - Check if value is a FileList object
- **`isBlob`** - Check if value is a Blob object
- **`isFormData`** - Check if value is a FormData object
- **`isURL`** - Check if value is a URL object
- **`isURLSearchParams`** - Check if value is a URLSearchParams object

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
- **`guardWithTolerance<T>(guard, tolerance)`** - Create type guards with tolerance for approximate matching

#### **Custom Type Guards**
- **`isBranded<T>(validation)`** - Create custom type guards for branded types with custom validation logic
  - Takes a validation function that throws an error if validation fails
  - Returns a type guard function that validates and narrows to the branded type
  - Perfect for domain-specific validation (emails, passwords, IDs, etc.)
- **`Branded<T, B>`** - Type helper for creating branded types with specific brand identifiers
  - Creates types like `T & { __brand: B }` for type safety
  - Prevents type confusion in your codebase

#### **Type Converters**
- **`toNumber(value: Numeric)`** - Convert Numeric branded type to number
- **`toDate(value: DateLike)`** - Convert DateLike branded type to Date object
- **`toBoolean(value: BooleanLike)`** - Convert BooleanLike branded type to boolean

### **Utility Types**

Guardz exports several utility types for enhanced type safety:

#### **Branded Types for Enhanced Type Safety**

Guardz provides branded types that work seamlessly with type guards to provide both compile-time and runtime type safety:

```typescript
import { isNumeric, isDateLike, isBooleanLike } from 'guardz';
import type { Numeric, DateLike, BooleanLike } from 'guardz';

// Numeric values (numbers and numeric strings)
const validateNumeric = (value: unknown): Numeric | null => {
  if (isNumeric(value)) {
    return value; // TypeScript knows this is Numeric
  }
  return null;
};

// Date-like values (Date objects, date strings, timestamps)
const validateDateLike = (value: unknown): DateLike | null => {
  if (isDateLike(value)) {
    return value; // TypeScript knows this is DateLike
  }
  return null;
};

// Boolean-like values (booleans, boolean strings, boolean numbers)
const validateBooleanLike = (value: unknown): BooleanLike | null => {
  if (isBooleanLike(value)) {
    return value; // TypeScript knows this is BooleanLike
  }
  return null;
};

// Usage examples
const numericValue = validateNumeric("123"); // Numeric | null
const dateValue = validateDateLike("2023-01-01"); // DateLike | null
const boolValue = validateBooleanLike("true"); // BooleanLike | null
```

**Benefits of branded types:**
- ✅ **Compile-time safety** - TypeScript prevents invalid assignments
- ✅ **Runtime validation** - Type guards ensure data integrity
- ✅ **Semantic meaning** - Clear intent about what the value represents
- ✅ **Flexible input** - Accept multiple input types while maintaining type safety



```typescript
// Array types
type NonEmptyArray<T> = [T, ...T[]];
type NonEmptyString = string & { readonly length: number };

// Number types
type PositiveNumber = number & { readonly __brand: 'PositiveNumber' };
type NegativeNumber = number & { readonly __brand: 'NegativeNumber' };
type NonNegativeNumber = number & { readonly __brand: 'NonNegativeNumber' };
type NonPositiveNumber = number & { readonly __brand: 'NonPositiveNumber' };
type Integer = number & { readonly __brand: 'Integer' };
type PositiveInteger = number & { readonly __brand: 'PositiveInteger' };
type NegativeInteger = number & { readonly __brand: 'NegativeInteger' };
type NonNegativeInteger = number & { readonly __brand: 'NonNegativeInteger' };
type NonPositiveInteger = number & { readonly __brand: 'NonPositiveInteger' };

// Utility type guards with branded types
type Numeric = (number | string) & { readonly __brand: 'Numeric' };
type DateLike = (Date | string | number) & { readonly __brand: 'DateLike' };
type BooleanLike = (boolean | string | number) & { readonly __brand: 'BooleanLike' };

// Nullable types
type Nullable<T> = T | null;
```

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

## 🔄 **Type Converters**

Guardz provides utility functions to safely convert branded types to their real types. These converters are designed to work seamlessly with the branded types and type guards.

### **Available Converters**

#### **`toNumber(value: Numeric): number`**
Converts a Numeric branded type to a number.

```typescript
import { toNumber, isNumeric } from 'guardz';

// Safe conversion after validation
const data: unknown = "123";
if (isNumeric(data)) {
  const num = toNumber(data); // TypeScript knows this is safe
  console.log(num.toFixed(2)); // "123.00"
}

// Works with both string and number inputs
const num1 = toNumber("100"); // 100
const num2 = toNumber(200);   // 200
const num3 = toNumber("3.14"); // 3.14
```

#### **`toDate(value: DateLike): Date`**
Converts a DateLike branded type to a Date object.

```typescript
import { toDate, isDateLike } from 'guardz';

// Safe conversion after validation
const data: unknown = "2023-01-01";
if (isDateLike(data)) {
  const date = toDate(data); // TypeScript knows this is safe
  console.log(date.toISOString()); // "2023-01-01T00:00:00.000Z"
}

// Works with different input types
const date1 = toDate(new Date()); // Returns the same Date object
const date2 = toDate("2023-01-01"); // Creates Date from string
const date3 = toDate(1672531200000); // Creates Date from timestamp
```

#### **`toBoolean(value: BooleanLike): boolean`**
Converts a BooleanLike branded type to a boolean.

```typescript
import { toBoolean, isBooleanLike } from 'guardz';

// Safe conversion after validation
const data: unknown = "true";
if (isBooleanLike(data)) {
  const bool = toBoolean(data); // TypeScript knows this is safe
  console.log(bool); // true
}

// Works with different input types
const bool1 = toBoolean(true);     // true
const bool2 = toBoolean("true");   // true
const bool3 = toBoolean("1");      // true
const bool4 = toBoolean(1);        // true
const bool5 = toBoolean(false);    // false
const bool6 = toBoolean("false");  // false
const bool7 = toBoolean("0");      // false
const bool8 = toBoolean(0);        // false
```

### **Real-World Usage Examples**

#### **Form Processing**
```typescript
import { isSchema, isString, isNumeric, isDateLike, isBooleanLike, toNumber, toDate, toBoolean } from 'guardz';

const isFormData = isSchema({
  name: isString,
  age: isNumeric,
  birthDate: isDateLike,
  isActive: isBooleanLike,
});

const processForm = (formData: unknown) => {
  if (isFormData(formData)) {
    // Convert to real types for processing
    const processedData = {
      name: formData.name,
      age: toNumber(formData.age),
      birthDate: toDate(formData.birthDate),
      isActive: toBoolean(formData.isActive),
    };
    
    // Now you can use the real types
    console.log(processedData.age.toFixed(2));
    console.log(processedData.birthDate.getFullYear());
    console.log(processedData.isActive);
    
    return processedData;
  }
  return null;
};
```

#### **API Response Processing**
```typescript
import { isSchema, isString, isNumeric, isDateLike, toNumber, toDate } from 'guardz';

const isApiResponse = isSchema({
  id: isNumeric,
  name: isString,
  createdAt: isDateLike,
  updatedAt: isDateLike,
});

const processApiResponse = (response: unknown) => {
  if (isApiResponse(response)) {
    return {
      id: toNumber(response.id),
      name: response.name,
      createdAt: toDate(response.createdAt),
      updatedAt: toDate(response.updatedAt),
    };
  }
  throw new Error('Invalid API response');
};
```

#### **Configuration Parsing**
```typescript
import { isSchema, isNumeric, isBooleanLike, toNumber, toBoolean } from 'guardz';

const isConfig = isSchema({
  port: isNumeric,
  debug: isBooleanLike,
  timeout: isNumeric,
});

const parseConfig = (configData: unknown) => {
  if (isConfig(configData)) {
    return {
      port: toNumber(configData.port),
      debug: toBoolean(configData.debug),
      timeout: toNumber(configData.timeout),
    };
  }
  throw new Error('Invalid configuration');
};
```

### **Key Benefits**

- ✅ **Type Safety**: Guaranteed to work with branded types
- ✅ **Performance**: Minimal overhead for conversions
- ✅ **Flexibility**: Handle multiple input formats
- ✅ **Real-world Ready**: Perfect for form processing, API responses, and data transformation
- ✅ **Zero Dependencies**: Lightweight and efficient

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

## 🎯 **For Best Results: Use guardz-generator**

**💡 Pro Tip:** For the best developer experience, use `guardz-generator` to automatically generate type guards from your TypeScript interfaces. This ensures perfect type safety and eliminates manual guard creation.

```bash
npm install guardz-generator
```

**Why use guardz-generator?**
- ✅ **Automatic generation** from TypeScript interfaces
- ✅ **Perfect type safety** - no manual type mapping
- ✅ **Handles complex types** including unions, intersections, and generics
- ✅ **Supports recursive types** with proper circular reference handling
- ✅ **Zero configuration** - works out of the box
- ✅ **Framework agnostic** - generates guards for any TypeScript project

**Example with guardz-generator:**
```typescript
// Your TypeScript interface
interface Employee {
  id: number;
  name: string;
  manager?: Employee; // Recursive reference
  subordinates: Employee[];
}

// Generated automatically by guardz-generator
const isEmployee = isSchema<Employee>({
  id: isNumber,
  name: isString,
  manager: isUndefinedOr(isEmployee), // Handles optional recursive reference
  subordinates: isArrayWithEachItem(isEmployee), // Handles array of recursive references
});
```

**Get started with guardz-generator:**
```bash
# Install the generator
npm install guardz-generator

# Generate guards from your TypeScript files
npx guardz-generator src/types/*.ts --output src/guards/

# Use the generated guards
import { isEmployee } from './guards/employee.guard';
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
import { isSchema, isString, isNumber } from 'guardz';

// That's literally it. You're ready to go.
const isUser = isSchema({ name: isString, age: isNumber });
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
