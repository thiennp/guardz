# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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