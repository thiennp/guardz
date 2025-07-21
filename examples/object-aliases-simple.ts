#!/usr/bin/env ts-node

/**
 * Simple example demonstrating the new isObject and isObjectWith aliases
 * 
 * This example directly imports the functions to avoid browser-specific type issues.
 */

import { isObject } from '../src/typeguards/isObject';
import { isObjectWith } from '../src/typeguards/isObjectWith';
import { isString } from '../src/typeguards/isString';
import { isNumber } from '../src/typeguards/isNumber';
import { isBoolean } from '../src/typeguards/isBoolean';

console.log('🛡️  Guardz Object Aliases Example\n');

// Example 1: Using isObject (shorter, more concise name)
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

const isUser = isObject<User>({
  id: isNumber,
  name: isString,
  email: isString,
  isActive: isBoolean,
});

console.log('📝 Example 1: Using isObject alias');
const validUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  isActive: true,
};

if (isUser(validUser)) {
  console.log('✅ Valid user:', validUser.name);
} else {
  console.log('❌ Invalid user');
}

// Example 2: Using isObjectWith (more descriptive name)
interface Product {
  sku: string;
  name: string;
  price: number;
  inStock: boolean;
}

const isProduct = isObjectWith<Product>({
  sku: isString,
  name: isString,
  price: isNumber,
  inStock: isBoolean,
});

console.log('\n📦 Example 2: Using isObjectWith alias');
const validProduct = {
  sku: 'PROD-001',
  name: 'Laptop',
  price: 999.99,
  inStock: true,
};

if (isProduct(validProduct)) {
  console.log('✅ Valid product:', validProduct.name, `($${validProduct.price})`);
} else {
  console.log('❌ Invalid product');
}

// Example 3: Error handling with structured error messages
console.log('\n🔍 Example 3: Error handling with structured messages');

const errors: string[] = [];
const config = {
  identifier: 'user',
  callbackOnError: (error: string) => errors.push(error),
};

const invalidUser = {
  id: '1', // should be number
  name: 'John Doe',
  email: 'john@example.com',
  isActive: true,
};

isUser(invalidUser, config);

if (errors.length > 0) {
  console.log('❌ Validation errors:');
  errors.forEach(error => console.log(`   - ${error}`));
} else {
  console.log('✅ No validation errors');
}

// Example 4: Nested objects
console.log('\n🏗️  Example 4: Nested objects');

interface Address {
  street: string;
  city: string;
  zipCode: string;
}

interface Customer {
  id: number;
  name: string;
  address: Address;
}

const isAddress = isObject<Address>({
  street: isString,
  city: isString,
  zipCode: isString,
});

const isCustomer = isObject<Customer>({
  id: isNumber,
  name: isString,
  address: isAddress,
});

const validCustomer = {
  id: 123,
  name: 'Jane Smith',
  address: {
    street: '123 Main St',
    city: 'Anytown',
    zipCode: '12345',
  },
};

if (isCustomer(validCustomer)) {
  console.log('✅ Valid customer:', validCustomer.name);
  console.log(`   Address: ${validCustomer.address.street}, ${validCustomer.address.city}`);
} else {
  console.log('❌ Invalid customer');
}

console.log('\n✨ All examples completed!');
console.log('\n💡 Key takeaways:');
console.log('   - isObject and isObjectWith are aliases for isType');
console.log('   - isObject provides a shorter, more concise name');
console.log('   - isObjectWith provides a more descriptive name');
console.log('   - Both maintain full functionality including error handling');
console.log('   - Both work with nested objects and complex types'); 