import {
  isNestedType,
  isString,
  isNumber,
  isBoolean,
  isArrayWithEachItem,
  isDate,
  isOneOfTypes,
  isEqualTo,
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
      theme: 'light' | 'dark';
      notifications: {
        email: boolean;
        push: boolean;
        sms: boolean;
      };
    };
  };
  settings: {
    language: string;
    timezone: string;
    privacy: {
      shareData: boolean;
      allowTracking: boolean;
    };
  };
}

const isComplexUser = isNestedType<ComplexUser>({
  id: isNumber,
  profile: {
    name: isString,
    email: isString,
    preferences: {
      theme: isOneOfTypes(isEqualTo('light'), isEqualTo('dark')),
      notifications: {
        email: isBoolean,
        push: isBoolean,
        sms: isBoolean,
      },
    },
  },
  settings: {
    language: isString,
    timezone: isString,
    privacy: {
      shareData: isBoolean,
      allowTracking: isBoolean,
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
        sms: true,
      },
    },
  },
  settings: {
    language: 'en',
    timezone: 'UTC',
    privacy: {
      shareData: false,
      allowTracking: true,
    },
  },
};

console.log('Valid complex user:', isComplexUser(validComplexUser)); // true
console.log();

// Example 3: Mixed nested objects and arrays
console.log('3. Mixed Nested Objects and Arrays:');
interface UserWithContacts {
  name: string;
  contacts: Array<{
    type: 'email' | 'phone' | 'social';
    value: string;
    isPrimary: boolean;
  }>;
  metadata: {
    createdAt: Date;
    tags: string[];
    preferences: {
      theme: string;
      notifications: boolean;
    };
  };
}

const isUserWithContacts = isNestedType<UserWithContacts>({
  name: isString,
  contacts: [{
    type: isOneOfTypes(
      isEqualTo('email'),
      isEqualTo('phone'),
      isEqualTo('social')
    ),
    value: isString,
    isPrimary: isBoolean,
  }],
  metadata: {
    createdAt: isDate,
    tags: isArrayWithEachItem(isString),
    preferences: {
      theme: isString,
      notifications: isBoolean,
    },
  },
});

const validUserWithContacts: UserWithContacts = {
  name: 'Bob Johnson',
  contacts: [
    { type: 'email', value: 'bob@example.com', isPrimary: true },
    { type: 'phone', value: '555-1234', isPrimary: false },
    { type: 'social', value: '@bobjohnson', isPrimary: false },
  ],
  metadata: {
    createdAt: new Date(),
    tags: ['developer', 'admin'],
    preferences: {
      theme: 'light',
      notifications: true,
    },
  },
};

console.log('Valid user with contacts:', isUserWithContacts(validUserWithContacts)); // true
console.log();

// Example 4: Comparison with traditional isType approach
console.log('4. Comparison with Traditional isType Approach:');

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

// Example 5: Error handling demonstration
console.log('5. Error Handling:');

const errors: string[] = [];
const config = {
  callbackOnError: (error: string) => errors.push(error),
  identifier: 'user',
  errorMode: 'multi' as const,
};

const invalidComplexUser = {
  id: '1', // should be number
  profile: {
    name: 'Jane Smith',
    email: 'jane@example.com',
    preferences: {
      theme: 'blue', // should be 'light' or 'dark'
      notifications: {
        email: 'yes', // should be boolean
        push: false,
        sms: true,
      },
    },
  },
  settings: {
    language: 'en',
    timezone: 'UTC',
    privacy: {
      shareData: 'no', // should be boolean
      allowTracking: true,
    },
  },
};

const result = isComplexUser(invalidComplexUser, config);
console.log('Validation result:', result); // false
console.log('Error count:', errors.length);
console.log('First few errors:');
errors.slice(0, 3).forEach((error, index) => {
  console.log(`  ${index + 1}. ${error}`);
});
console.log();

// Example 6: Backward compatibility
console.log('6. Backward Compatibility:');

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