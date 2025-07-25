import {
  isNestedType,
  isString,
  isNumber,
  isBoolean,
} from '../src';

console.log('=== Nested Type Validation with isNestedType ===\n');

// Example 1: Simple nested structure
console.log('1. Simple Nested Structure:');
interface UserWithAddress {
  name: string;
  age: number;
  address: {
    street: string;
    city: string;
    zipCode: number;
  };
}

const isUserWithAddress = isNestedType<UserWithAddress>({
  name: isString,
  age: isNumber,
  address: {
    street: isString,
    city: isString,
    zipCode: isNumber,
  },
});

const validUser: UserWithAddress = {
  name: 'John Doe',
  age: 30,
  address: {
    street: '123 Main St',
    city: 'Springfield',
    zipCode: 12345,
  },
};

console.log('Valid user:', isUserWithAddress(validUser)); // true

const invalidUser = {
  name: 'John Doe',
  age: 30,
  address: {
    street: '123 Main St',
    city: 'Springfield',
    zipCode: '12345', // should be number
  },
};

console.log('Invalid user:', isUserWithAddress(invalidUser)); // false
console.log();

// Example 2: Deeply nested structure
console.log('2. Deeply Nested Structure:');
interface ComplexUser {
  id: number;
  profile: {
    name: string;
    email: string;
    preferences: {
      theme: string;
      notifications: {
        email: boolean;
        push: boolean;
      };
    };
  };
}

const isComplexUser = isNestedType<ComplexUser>({
  id: isNumber,
  profile: {
    name: isString,
    email: isString,
    preferences: {
      theme: isString,
      notifications: {
        email: isBoolean,
        push: isBoolean,
      },
    },
  },
});

const validComplexUser: ComplexUser = {
  id: 1,
  profile: {
    name: 'Jane Smith',
    email: 'jane@example.com',
    preferences: {
      theme: 'dark',
      notifications: {
        email: true,
        push: false,
      },
    },
  },
};

console.log('Valid complex user:', isComplexUser(validComplexUser)); // true
console.log();

// Example 3: Comparison with traditional isType approach
console.log('3. Comparison with Traditional isType Approach:');

// Traditional approach (requires explicit isType calls)
import { isType } from '../src';

const isAddress = isType({
  street: isString,
  city: isString,
  zipCode: isNumber,
});

const isPreferences = isType({
  theme: isString,
  notifications: isBoolean,
});

const isTraditionalUser = isType({
  name: isString,
  age: isNumber,
  address: isAddress,
  preferences: isPreferences,
});

// New isNestedType approach (more concise)
const isNestedUser = isNestedType({
  name: isString,
  age: isNumber,
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

const testUser = {
  name: 'Alice',
  age: 25,
  address: {
    street: '456 Oak Ave',
    city: 'Somewhere',
    zipCode: 54321,
  },
  preferences: {
    theme: 'dark',
    notifications: true,
  },
};

console.log('Traditional approach:', isTraditionalUser(testUser)); // true
console.log('Nested approach:', isNestedUser(testUser)); // true
console.log('Both approaches produce the same result!');
console.log();

// Example 4: Backward compatibility
console.log('4. Backward Compatibility:');

// isNestedType works with existing type guards
const existingTypeGuard = isType({
  name: isString,
  age: isNumber,
});

const mixedUser = isNestedType({
  basic: existingTypeGuard,
  extra: {
    email: isString,
    isActive: isBoolean,
  },
});

const testMixedUser = {
  basic: { name: 'John', age: 30 },
  extra: { email: 'john@example.com', isActive: true },
};

console.log('Mixed approach:', mixedUser(testMixedUser)); // true
console.log('isNestedType is fully backward compatible!'); 