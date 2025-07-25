# Performance Testing Strategy

This document outlines the performance testing strategy for Guardz, ensuring reliable performance validation across different environments.

## Overview

Guardz includes multiple performance test suites designed for different use cases:

- **Development Performance Tests**: Strict thresholds for local development
- **CI Performance Tests**: Lenient thresholds for reliable CI/CD pipelines
- **Error Mode Performance Tests**: Detailed analysis of different error handling modes

## Performance Test Suites

### 1. Main Performance Tests (`benchmarks/performance.test.ts`)

**Purpose**: Comprehensive performance validation with balanced thresholds

**Features**:
- Tests all error modes (multi, single, json)
- Validates different data scenarios (valid, invalid, partially valid)
- Provides detailed performance metrics
- Balanced thresholds for development and CI

**Usage**:
```bash
npm run test:performance
```

**Thresholds**:
- **Valid Data**: < 1000ms for 10k iterations (< 100μs per iteration)
- **Invalid Data**: < 1000ms for 10k iterations (< 100μs per iteration)
- **Single Mode**: < 800ms for 10k iterations (< 80μs per iteration)
- **JSON Mode**: < 1200ms for 10k iterations (< 120μs per iteration)

### 2. Error Modes Performance Tests (`benchmarks/error-modes-performance.test.ts`)

**Purpose**: Detailed analysis of error mode performance characteristics

**Features**:
- Simple vs Complex object validation comparison
- Performance rating system (Excellent, Good, Fair, Poor)
- Detailed performance recommendations
- Comprehensive error mode analysis

**Usage**:
```bash
npm run test:performance:modes
```

**Performance Ratings**:
- **Excellent**: < 2μs per iteration
- **Good**: < 5μs per iteration
- **Fair**: < 10μs per iteration
- **Poor**: ≥ 10μs per iteration

### 3. CI Performance Tests (`benchmarks/ci-performance.test.ts`)

**Purpose**: Reliable performance validation in CI/CD environments

**Features**:
- Very lenient thresholds for system variations
- Reduced iteration counts for faster execution
- CI environment detection
- Focus on functionality over precise performance

**Usage**:
```bash
npm run test:performance:ci
```

**Thresholds**:
- **Total Time**: < 5 seconds for 1000 iterations
- **Average Time**: < 5ms per iteration
- **Error Mode Tests**: < 3 seconds per mode

## Performance Characteristics

### Error Mode Performance Comparison

| Mode | Valid Data | Invalid Data | Use Case |
|------|------------|--------------|----------|
| **Single** | ~1μs | ~2μs | Performance-critical applications |
| **Multi** | ~3μs | ~4μs | General validation (default) |
| **JSON** | ~3μs | ~5μs | Monitoring and debugging |

### Performance Recommendations

#### 🚀 Single Mode
- **Use for**: High-frequency validation, API validation, real-time validation
- **When**: You only need to know if data is valid
- **Performance**: Fastest (1-2μs per iteration)

#### ⚖️ Multi Mode (Default)
- **Use for**: General validation, user feedback, debugging
- **When**: You need all validation errors
- **Performance**: Balanced (3-4μs per iteration)

#### 📋 JSON Mode
- **Use for**: Monitoring systems, complex debugging
- **When**: You need detailed validation state
- **Performance**: Higher overhead (3-5μs per iteration)

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Performance Tests
on: [push, pull_request]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:performance:ci
```

### Environment Variables

The CI performance tests detect CI environments using:
- `CI=true`
- `GITHUB_ACTIONS=true`

### Threshold Adjustments

Performance thresholds are automatically adjusted based on:
- System resources
- CI environment detection
- Test complexity

## Development Guidelines

### Local Development
- Use `npm run test:performance` for detailed analysis
- Use `npm run test:performance:modes` for error mode comparison
- Monitor performance trends over time

### CI/CD Pipeline
- Use `npm run test:performance:ci` for reliable validation
- Focus on functionality over precise performance
- Ensure tests pass consistently across environments

### Performance Monitoring
- Track performance metrics over time
- Monitor for performance regressions
- Use performance tests as regression prevention

## Troubleshooting

### Common Issues

#### Tests Failing in CI
- **Cause**: System resource variations
- **Solution**: Use CI-specific performance tests with lenient thresholds

#### Inconsistent Results
- **Cause**: System load variations
- **Solution**: Run tests multiple times, use median values

#### Performance Regressions
- **Cause**: Code changes affecting performance
- **Solution**: Investigate recent changes, optimize if necessary

### Performance Optimization

#### When Performance Tests Fail
1. **Identify the failing test**: Check which specific test is failing
2. **Analyze the metrics**: Look at the actual performance numbers
3. **Check recent changes**: Identify what might have caused the regression
4. **Optimize if necessary**: Focus on the specific area causing issues

#### Performance Best Practices
- **Use appropriate error modes**: Choose the right mode for your use case
- **Optimize validation order**: Put most common validations first
- **Reduce validation complexity**: Simplify schemas when possible
- **Cache validation results**: Reuse validation results when appropriate

## Metrics and Monitoring

### Key Performance Indicators

- **Validation Speed**: Time per iteration
- **Error Mode Efficiency**: Performance differences between modes
- **Scalability**: Performance with complex objects
- **Consistency**: Performance across different environments

### Performance Targets

| Metric | Target | CI Target |
|--------|--------|-----------|
| Simple Validation | < 5μs | < 5ms |
| Complex Validation | < 20μs | < 10ms |
| Error Handling | < 10μs | < 5ms |
| JSON Tree Building | < 25μs | < 10ms |

## Conclusion

The performance testing strategy ensures that Guardz maintains excellent performance characteristics while providing reliable validation in CI/CD environments. The different test suites serve different purposes:

- **Development tests** provide detailed performance analysis
- **CI tests** ensure reliable validation in automated environments
- **Error mode tests** help developers choose the right validation approach

By using the appropriate test suite for your environment, you can ensure both performance and reliability. 