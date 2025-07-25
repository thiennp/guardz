import {
  isSchema,
  isShape,
  isNestedType,
  isString,
  isNumber,
  isBoolean,
} from '../src';

console.log('=== Schema-based Type Validation ===\n');

// Example 1: Using isSchema (main function)
console.log('1. Using isSchema:');
interface User {
  name: string;
  age: number;
  address: {
    street: string;
    city: string;
    zipCode: number;
  };
}

const isUserSchema = isSchema<User>({
  name: isString,
  age: isNumber,
  address: {
    street: isString,
    city: isString,
    zipCode: isNumber,
  },
});

const validUser: User = {
  name: 'John Doe',
  age: 30,
  address: {
    street: '123 Main St',
    city: 'Springfield',
    zipCode: 12345,
  },
};

console.log('Valid user with isSchema:', isUserSchema(validUser)); // true
console.log();

// Example 2: Using isShape (alias)
console.log('2. Using isShape (alias):');
const isUserShape = isShape<User>({
  name: isString,
  age: isNumber,
  address: {
    street: isString,
    city: isString,
    zipCode: isNumber,
  },
});

console.log('Valid user with isShape:', isUserShape(validUser)); // true
console.log();

// Example 3: Using isNestedType (alias)
console.log('3. Using isNestedType (alias):');
const isUserNested = isNestedType<User>({
  name: isString,
  age: isNumber,
  address: {
    street: isString,
    city: isString,
    zipCode: isNumber,
  },
});

console.log('Valid user with isNestedType:', isUserNested(validUser)); // true
console.log();

// Example 4: All aliases are functionally equivalent
console.log('4. All aliases are functionally equivalent:');
const invalidUser = {
  name: 'John Doe',
  age: 30,
  address: {
    street: '123 Main St',
    city: 'Springfield',
    zipCode: '12345', // should be number
  },
};

console.log('Invalid user with isSchema:', isUserSchema(invalidUser)); // false
console.log('Invalid user with isShape:', isUserShape(invalidUser)); // false
console.log('Invalid user with isNestedType:', isUserNested(invalidUser)); // false
console.log();

// Example 5: Comparison with traditional isType approach
console.log('5. Comparison with traditional isType approach:');
import { isType } from '../src';

// Traditional approach (requires explicit isType calls)
const isAddress = isType({
  street: isString,
  city: isString,
  zipCode: isNumber,
});

const isTraditionalUser = isType({
  name: isString,
  age: isNumber,
  address: isAddress,
});

// New schema approach (more concise)
const isSchemaUser = isSchema({
  name: isString,
  age: isNumber,
  address: {
    street: isString,
    city: isString,
    zipCode: isNumber,
  },
});

console.log('Traditional approach:', isTraditionalUser(validUser)); // true
console.log('Schema approach:', isSchemaUser(validUser)); // true
console.log('Both approaches produce the same result!');
console.log();

// Example 6: Flexibility in naming
console.log('6. Flexibility in naming:');
console.log('Choose the name that best fits your use case:');
console.log('- Use isSchema for general schema validation');
console.log('- Use isShape for object shape validation');
console.log('- Use isNestedType for nested structure validation');
console.log('- All three are functionally identical!'); 