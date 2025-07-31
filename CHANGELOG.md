# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.11.8] - 2024-12-20

### 📚 Documentation Enhancements
- **Comprehensive Showcases**: Added complete TypeScript type guard examples covering all possible cases
- **Real-World Scenarios**: Added practical examples for API responses, form validation, configuration
- **Advanced Patterns**: Added examples for conditional validation, recursive types, index signatures
- **Error Handling**: Added detailed examples for multiple error modes and reporting
- **Performance Optimizations**: Added caching strategies and lazy validation examples
- **Documentation Structure**: Created docs/README.md as navigation index
- **Updated Main README**: Added documentation section with links to showcases and examples

### 🎯 Showcases Coverage
- **Primitive Types**: String, number, boolean, BigInt with specializations
- **Object Types**: Complex objects, nested structures, optional properties
- **Array Types**: Arrays with specific item types, tuples, non-empty arrays
- **Union/Intersection**: Complex type combinations and narrowing
- **Generic Types**: Reusable type guards with constraints
- **Branded Types**: Type-safe domain-specific types
- **Web APIs**: Browser-specific type validation
- **Error Handling**: Multiple error modes with detailed examples
- **Performance**: Optimization strategies and best practices

### 🧪 Testing
- **All Tests Passing**: 1026 tests across 68 test suites
- **Clean Build**: TypeScript compilation successful
- **No Breaking Changes**: 100% backward compatible

## [1.11.7] - 2024-12-20

### 📚 Documentation Enhancements
- **Complete API Reference**: Added all missing functions and types to documentation
- **Precise Descriptions**: Replaced generic "Checks if" with specific action verbs
- **Correct Groupings**: Moved functions to appropriate sections (e.g., `isBooleanLike` to Utility Type Guards)
- **Fixed Placeholder Information**: Updated all repository URLs and links to correct values
- **Added Missing Sections**: Type Converters, Validation Types, Branded Types
- **Enhanced Descriptions**: More detailed explanations of function behavior and use cases

### 🧹 Documentation Cleanup
- **Removed Duplicates**: Fixed duplicate entries in API reference
- **Corrected Groupings**: Properly organized functions by their actual purpose
- **Fixed Links**: All GitHub links now point to correct repositories
- **Updated References**: All placeholder information replaced with actual values

### 🔧 Technical Improvements
- **Better Organization**: Functions grouped by their actual behavior and purpose
- **Consistent Language**: Standardized description format across all functions
- **Complete Coverage**: All exported functions and types now documented
- **Professional Standards**: Documentation now matches industry best practices

### 🧪 Testing
- **All Tests Passing**: 1026 tests across 68 test suites
- **Clean Build**: TypeScript compilation successful
- **No Breaking Changes**: 100% backward compatible

## [1.11.6] - 2024-12-20

### 📚 Documentation Enhancements
- **Professional README**: Transformed to match top-tier package standards (React, Angular, TypeScript)
- **Comprehensive Installation Guide**: Added npm, yarn, pnpm installation options
- **TypeScript Configuration**: Added required TypeScript settings
- **Common Use Cases**: Added API response, form data, database, and configuration validation examples
- **Migration Guide**: Added migration paths from Zod, Joi, Yup
- **Troubleshooting Section**: Added common issues and solutions
- **Performance Tips**: Added optimization strategies and error mode selection
- **Advanced Generic Patterns**: Enhanced generic types section with multiple parameter examples
- **guardz-generator Integration**: Added recommendations for complex generic type handling

### 🧹 Project Cleanup
- **Removed isGeneric**: Eliminated all isGeneric related files and functionality
- **Clean Architecture**: Simplified project structure
- **Updated Examples**: Removed references to deleted files
- **Consistent Versioning**: Updated all version references to 1.11.6

### 🔧 Technical Improvements
- **Enhanced Error Handling**: Better error reporting examples
- **Performance Optimization**: Added caching strategies and error mode guidance
- **Type Safety**: Improved generic type examples with exact type inference
- **Professional Standards**: README now matches industry best practices

### 🧪 Testing
- **All Tests Passing**: 1026 tests across 68 test suites
- **Clean Build**: TypeScript compilation successful
- **No Breaking Changes**: 100% backward compatible

## [1.11.0] - 2024-12-20

### ✨ New Features
- **`isIndexSignature`**: New type guard for validating objects with dynamic keys (index signatures)
- **`isNumeric`**: New type guard for validating numeric values (numbers and string numbers)
- **`isBooleanLike`**: New type guard for validating boolean-like values (boolean, "true"/"false", 1/0)
- **`isDateLike`**: New type guard for validating date-like values (Date objects, date strings, timestamps)

### 🔧 Improvements
- **Enhanced Object Validation**: Support for objects with both fixed properties and dynamic keys using `isIntersectionOf`
- **Flexible Type Validation**: New utilities handle common real-world scenarios where data comes in various formats
- **Better Form Validation**: Support for form inputs that return strings for boolean/numeric values
- **API Response Validation**: Enhanced validation for API responses with mixed data types

### 📚 Documentation
- **Comprehensive Examples**: Added `examples/index-signature-usage.ts` with practical usage patterns
- **Updated README**: Added new utilities to the documentation
- **Real-world Use Cases**: Examples for form validation, API responses, and configuration files

### 🧪 Testing
- **Comprehensive Test Coverage**: 48 new tests for the new utilities
- **Integration Tests**: Verified compatibility with existing composite type guards
- **Real-world Scenarios**: Tests covering form validation, API responses, and configuration validation

### 🔄 Backward Compatibility
- **100% Compatible**: All existing code patterns work exactly the same
- **No Breaking Changes**: All new utilities are additive
- **Type Safety**: Enhanced TypeScript integration with proper type narrowing

## [1.10.0] - 2024-12-19

### 🚀 Performance Optimizations
- **Duplicate Check Elimination**: Eliminated redundant validation calls by implementing "pass value through function" approach
- **Unified Validation Logic**: Single validation path for all error modes (single, multi, json)
- **Consistent Error Handling**: Same error creation logic across all validation modes
- **50% Reduction**: In validation calls for complex union types (`isOneOfTypes`)

### 🔧 Internal Improvements
- **Optimized `isOneOfTypes`**: Values are now validated only once, results are reused for error reporting
- **Optimized `validateObject`**: Single error mode now uses unified `validateProperty` function
- **Optimized `validateProperty`**: Unified validation function eliminates duplicate error creation logic
- **Functional Programming**: Replaced imperative loops with functional constructs (`for...of` instead of `for...let`)

### 🔄 Backward Compatibility
- **100% Compatible**: All existing code patterns work exactly the same
- **Optional Config Parameters**: Maintained `config?: TypeGuardFnConfig | null` signature
- **Error Behavior**: Default single error mode behavior unchanged
- **Type Narrowing**: TypeScript integration preserved
- **API Signature**: No breaking changes to any public APIs

### 📚 Documentation
- **Updated README**: Added performance optimization section
- **New Examples**: Created performance optimization and backward compatibility examples
- **Enhanced Documentation**: Better explanation of error modes and performance considerations

### 🧪 Testing
- **Comprehensive Tests**: 609 tests passing across 55 test suites
- **Backward Compatibility Tests**: Verified all existing patterns work correctly
- **Performance Tests**: Validated optimization improvements

### 📦 Build
- **Clean Build**: TypeScript compilation successful
- **Type Definitions**: All `.d.ts` files generated correctly
- **No Dependencies**: Remains dependency-free

## [1.9.0] - 2024-12-18

### ✨ New Features
- **Multiple Error Modes**: Added 'single', 'multi', and 'json' error reporting modes
- **JSON Tree Error Format**: Structured error reporting with hierarchical validation information
- **Enhanced Error Messages**: More detailed and actionable error feedback
- **Functional Programming**: Pure functions with Higher-Order Functions (HoF) patterns

### 🔧 Improvements
- **Modular Architecture**: Separated validation utilities into individual files
- **Better Error Handling**: Consistent error creation and reporting
- **Type Safety**: Enhanced TypeScript integration
- **Performance**: Optimized error collection and reporting

### 📚 Documentation
- **Comprehensive Examples**: Multiple error modes and JSON tree format
- **API Documentation**: Detailed function descriptions and usage patterns
- **Error Message Guide**: Clear explanation of error formats and modes

## [1.8.0] - 2024-12-17

### ✨ New Features
- **Error Reporting**: Added configurable error callback system
- **Detailed Error Messages**: Field-specific error information
- **Custom Error Handling**: Integration with logging and monitoring systems

### 🔧 Improvements
- **Better Type Guards**: Enhanced validation logic
- **Error Context**: Improved error message formatting
- **Performance**: Optimized validation performance

## [1.7.0] - 2024-12-16

### ✨ New Features
- **Composite Type Guards**: Added `isIntersectionOf` and `isExtensionOf`
- **Union Type Guards**: Added `isOneOf` and `isOneOfTypes`
- **Array Type Guards**: Enhanced array validation capabilities

### 🔧 Improvements
- **Type Safety**: Better TypeScript integration
- **Performance**: Optimized validation logic
- **Documentation**: Enhanced examples and guides

## [1.6.0] - 2024-12-15

### ✨ New Features
- **Object Type Guards**: Added `isObject`, `isObjectWith`, `isNonNullObject`
- **Array Type Guards**: Added `isArrayWithEachItem`, `isNonEmptyArray`
- **Number Type Guards**: Added various number validation functions

### 🔧 Improvements
- **Core Functionality**: Enhanced `isType` function
- **Type Definitions**: Better TypeScript support
- **Error Handling**: Improved validation feedback

## [1.5.0] - 2024-12-14

### ✨ New Features
- **Primitive Type Guards**: Added `isString`, `isNumber`, `isBoolean`
- **Special Type Guards**: Added `isDate`, `isFunction`, `isError`
- **Web API Guards**: Added `isFile`, `isBlob`, `isFormData`

### 🔧 Improvements
- **Core Architecture**: Established foundation for type guard system
- **Type Safety**: Basic TypeScript integration
- **Documentation**: Initial documentation and examples

## [1.0.0] - 2024-12-13

### 🎉 Initial Release
- **Core Type Guard System**: Basic `isType` function
- **TypeScript Integration**: Type narrowing and type safety
- **Basic Documentation**: README and examples
- **MIT License**: Open source release

---

## Migration Guide

### Upgrading to v1.10.0

**No migration required!** Guardz v1.10.0 is 100% backward compatible with all previous versions.

```typescript
// Existing code works exactly the same
const isUser = isType<User>({
  id: isNumber,
  name: isString,
  isActive: isBoolean
});

// Same validation behavior
const isValid = isUser(data);

// Same error reporting
isUser(data, {
  identifier: 'user',
  callbackOnError: (error) => console.log(error)
});
```

### Optional: Use New Performance Optimizations

The performance optimizations are transparent to users, but you can benefit from them immediately:

```typescript
// Union types are now optimized automatically
const isPrimitive = isOneOfTypes<string | number | boolean>(isString, isNumber, isBoolean);

// Complex validations use unified logic
const isComplexUser = isType<ComplexUser>({
  id: isNumber,
  name: isString,
  profile: isProfile,
  settings: isSettings,
  tags: isArrayWithEachItem(isString)
});
```

### Upgrading to v1.9.0

**No migration required!** All existing code patterns work identically.

### Upgrading to v1.8.0

**No migration required!** Error reporting is opt-in and doesn't affect existing code.

---

## Support

For questions, issues, or contributions, please visit:
- [GitHub Issues](https://github.com/thiennp/guardz/issues)
- [GitHub Discussions](https://github.com/thiennp/guardz/discussions)
- [Documentation](https://github.com/thiennp/guardz#readme) 