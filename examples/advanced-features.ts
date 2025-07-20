import {
  guardWithTolerance,
  generateTypeGuardError,
  isType,
  isString,
  isNumber,
  isBoolean,
  isArrayWithEachItem,
  isNonNullObject,
} from '../src';

// --- Structured Error Handling is a Core Feature ---
// GuardZ provides detailed, field-specific error messages for every type guard.
// Use the config { identifier, callbackOnError } to collect and handle errors.

console.log('=== Structured Error Handling Example ===');
const errors: string[] = [];
const config = {
  identifier: 'user',
  callbackOnError: (error: string) => errors.push(error),
};

const isUser = isType({ name: isString, age: isNumber, email: isString });
const invalidUser = { name: 123, age: 'thirty', email: true };
const result = isUser(invalidUser, config);
console.log('Validation result:', result); // false
console.log('Collected errors:', errors); // [ ... ]

// ---

console.log('=== Advanced GuardZ Features ===');

// Guard with tolerance
console.log('\n=== Guard with Tolerance ===');

// guardWithTolerance validates data but always returns it cast to the expected type
// Useful when you want to log validation errors but still proceed with the data

const userData: unknown = { name: 'John', age: '30' }; // age is string, not number

// Use with error logging
const user = guardWithTolerance(
  userData,
  isType({
    name: isString,
    age: isNumber,
  }),
  {
    identifier: 'userData',
    callbackOnError: error => {
      console.warn('Validation failed:', error);
    },
  }
);

console.log('User data (with tolerance):', user);
console.log('User name:', user.name); // Works fine
console.log('User age type:', typeof user.age); // Still string, but cast as number

// Without error handling - just cast and proceed
const user2 = guardWithTolerance(
  userData,
  isType({
    name: isString,
    age: isNumber,
  })
);

console.log('User data (without error handling):', user2);

// Error generation
console.log('\n=== Error Generation ===');

// Custom error callback
function customErrorHandler(errorMessage: string) {
  console.log(`Validation Error: ${errorMessage}`);
}

// Using error generation with custom callback
const isUserWithErrors = isType({
  name: isString,
  age: isNumber,
  email: isString,
});

const complexInvalidUser = {
  name: 'Jane Smith',
  age: '25', // should be number
  address: {
    street: '456 Oak Ave',
    city: 'Somewhere',
    zipCode: 12345, // should be string
  },
  contacts: [
    { email: 'jane@example.com', phone: '555-9999' },
    { email: 123, phone: '555-8888' }, // email should be string
  ],
  isActive: 'yes', // should be boolean
};

// Advanced object validation with nested structures
console.log('\n=== Advanced Object Validation ===');

interface Address {
  street: string;
  city: string;
  zipCode: string;
}

interface Contact {
  email: string;
  phone: string;
}

interface Person {
  name: string;
  age: number;
  address: Address;
  contacts: Contact[];
  isActive: boolean;
}

// Create type guards for nested structures
const isAddress = isType({
  street: isString,
  city: isString,
  zipCode: isString,
});

const isContact = isType({
  email: isString,
  phone: isString,
});

const isPerson = isType({
  name: isString,
  age: isNumber,
  address: isAddress,
  contacts: isArrayWithEachItem(isContact),
  isActive: isBoolean,
});

// Valid person data
const validPerson: Person = {
  name: 'John Doe',
  age: 30,
  address: {
    street: '123 Main St',
    city: 'Anytown',
    zipCode: '12345',
  },
  contacts: [
    { email: 'john@example.com', phone: '555-1234' },
    { email: 'john.work@company.com', phone: '555-5678' },
  ],
  isActive: true,
};

console.log('Valid person:', isPerson(validPerson)); // true
console.log('Invalid person:', isPerson(complexInvalidUser)); // false

// Conditional validation based on object properties
console.log('\n=== Conditional Validation ===');

interface ConditionalUser {
  type: 'admin' | 'user';
  name: string;
  permissions?: string[];
  department?: string;
}

// Create conditional type guard
const isConditionalUser = (value: unknown): value is ConditionalUser => {
  if (!isNonNullObject(value)) return false;

  const obj = value as any;

  // Check required fields
  if (!isString(obj.type) || !isString(obj.name)) return false;

  // Check type-specific requirements
  if (obj.type === 'admin') {
    // Admin must have permissions array
    if (!Array.isArray(obj.permissions) || !obj.permissions.every(isString)) {
      return false;
    }
  } else if (obj.type === 'user') {
    // User must have department
    if (!isString(obj.department)) return false;
  } else {
    return false; // Invalid type
  }

  return true;
};

const validAdmin: ConditionalUser = {
  type: 'admin',
  name: 'Admin User',
  permissions: ['read', 'write', 'delete'],
};

const validUser: ConditionalUser = {
  type: 'user',
  name: 'Regular User',
  department: 'Engineering',
};

const invalidUser1 = {
  type: 'admin',
  name: 'Admin without permissions',
  // missing permissions
};

const invalidUser2 = {
  type: 'user',
  name: 'User without department',
  // missing department
};

console.log('Valid admin:', isConditionalUser(validAdmin)); // true
console.log('Valid user:', isConditionalUser(validUser)); // true
console.log('Invalid admin:', isConditionalUser(invalidUser1)); // false
console.log('Invalid user:', isConditionalUser(invalidUser2)); // false

// Performance optimization with memoization
console.log('\n=== Performance Optimization ===');

// Cache for type guard results
const typeGuardCache = new Map<string, boolean>();

function memoizedTypeGuard<T>(
  guard: (value: unknown) => value is T,
  value: unknown,
  cacheKey?: string
): value is T {
  const key = cacheKey ?? JSON.stringify(value);

  if (typeGuardCache.has(key)) {
    return typeGuardCache.get(key)!;
  }

  const result = guard(value);
  typeGuardCache.set(key, result);
  return result;
}

// Example usage with caching
const expensiveValidation = (value: unknown): value is string => {
  // Simulate expensive validation
  console.log('Performing expensive validation...');
  return isString(value);
};

const cachedValidation = (value: unknown): value is string => {
  return memoizedTypeGuard(expensiveValidation, value);
};

console.log('First call (expensive):', cachedValidation('test'));
console.log('Second call (cached):', cachedValidation('test'));
console.log('Third call (cached):', cachedValidation('test'));

console.log('\n=== Best Practices ===');
console.log('1. Use guardWithTolerance for approximate matching');
console.log('2. Implement custom error handling for better UX');
console.log('3. Create reusable type guards for complex structures');
console.log('4. Use conditional validation for polymorphic data');
console.log('5. Consider performance optimization for expensive validations');
console.log('6. Combine multiple type guards for comprehensive validation');
