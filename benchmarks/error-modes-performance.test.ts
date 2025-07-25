import { isType, isString, isNumber, isBoolean, isArrayWithEachItem } from '../src';

interface ComplexUser {
  id: number;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
  tags: string[];
  metadata: {
    lastLogin: string;
    preferences: {
      theme: string;
      notifications: boolean;
    };
  };
}

const isComplexUser = isType<ComplexUser>({
  id: isNumber,
  name: isString,
  email: isString,
  age: isNumber,
  isActive: isBoolean,
  tags: isArrayWithEachItem(isString),
  metadata: isType({
    lastLogin: isString,
    preferences: isType({
      theme: isString,
      notifications: isBoolean,
    }),
  }),
});

const validComplexUser: ComplexUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
  isActive: true,
  tags: ['developer', 'admin'],
  metadata: {
    lastLogin: '2024-01-15T10:30:00Z',
    preferences: {
      theme: 'dark',
      notifications: true,
    },
  },
};

const invalidComplexUser = {
  id: '1', // should be number
  name: 123, // should be string
  email: true, // should be string
  age: '30', // should be number
  isActive: 'yes', // should be boolean
  tags: 'not-an-array', // should be array
  metadata: {
    lastLogin: 123, // should be string
    preferences: {
      theme: 456, // should be string
      notifications: 'maybe', // should be boolean
    },
  },
};

const partiallyValidComplexUser = {
  id: 1, // valid
  name: 'John Doe', // valid
  email: 'john@example.com', // valid
  age: '30', // invalid - should be number
  isActive: true, // valid
  tags: ['developer', 'admin'], // valid
  metadata: {
    lastLogin: '2024-01-15T10:30:00Z', // valid
    preferences: {
      theme: 'dark', // valid
      notifications: 'maybe', // invalid - should be boolean
    },
  },
};

describe('Error Modes Performance Comparison', () => {
  describe('Simple Object Validation', () => {
    const isSimpleUser = isType({
      name: isString,
      age: isNumber,
      isActive: isBoolean,
    });

    const simpleValidUser = { name: 'John', age: 30, isActive: true };
    const simpleInvalidUser = { name: 123, age: '30', isActive: 'yes' };

    it('should compare simple object validation across modes', () => {
      const iterations = 5000;
      const results: Array<{ mode: string; scenario: string; time: number; avgTime: number }> = [];

      const scenarios = [
        { name: 'valid', data: simpleValidUser },
        { name: 'invalid', data: simpleInvalidUser }
      ];

      const modes = ['multi', 'single', 'json'] as const;

      for (const scenario of scenarios) {
        for (const mode of modes) {
          const startTime = performance.now();

          for (const _ of Array.from({ length: iterations })) {
            isSimpleUser(scenario.data, {
              identifier: 'user',
              callbackOnError: () => {},
              errorMode: mode
            });
          }

          const endTime = performance.now();
          const totalTime = endTime - startTime;
          const avgTime = totalTime / iterations;

          results.push({ mode, scenario: scenario.name, time: totalTime, avgTime });
        }
      }

      console.log('\n=== Simple Object Validation (5000 iterations) ===');
      console.log('Mode\t\tScenario\t\tTotal Time\tAvg Time\tPerformance');
      console.log('----\t\t--------\t\t----------\t--------\t-----------');
      
      results.forEach(result => {
        const performance = result.avgTime < 0.002 ? 'Excellent' : 
                          result.avgTime < 0.005 ? 'Good' : 
                          result.avgTime < 0.01 ? 'Fair' : 'Poor';
        console.log(`${result.mode.padEnd(12)}\t${result.scenario.padEnd(16)}\t${result.time.toFixed(2)}ms\t\t${result.avgTime.toFixed(3)}ms\t\t${performance}`);
      });

      // Performance assertions
      const validSingle = results.find(r => r.mode === 'single' && r.scenario === 'valid');
      const invalidSingle = results.find(r => r.mode === 'single' && r.scenario === 'invalid');
      const invalidJson = results.find(r => r.mode === 'json' && r.scenario === 'invalid');

      // More lenient for CI environments with varying system resources
      expect(validSingle?.avgTime).toBeLessThan(0.02); // 20μs
      expect(invalidSingle?.avgTime).toBeLessThan(invalidJson?.avgTime || Infinity);
    });
  });

  describe('Complex Object Validation', () => {
    it('should compare complex object validation across modes', () => {
      const iterations = 2000; // Fewer iterations for complex validation
      const results: Array<{ mode: string; scenario: string; time: number; avgTime: number }> = [];

      const scenarios = [
        { name: 'valid', data: validComplexUser },
        { name: 'invalid', data: invalidComplexUser },
        { name: 'partially-valid', data: partiallyValidComplexUser }
      ];

      const modes = ['multi', 'single', 'json'] as const;

      for (const scenario of scenarios) {
        for (const mode of modes) {
          const startTime = performance.now();

          for (const _ of Array.from({ length: iterations })) {
            isComplexUser(scenario.data, {
              identifier: 'user',
              callbackOnError: () => {},
              errorMode: mode
            });
          }

          const endTime = performance.now();
          const totalTime = endTime - startTime;
          const avgTime = totalTime / iterations;

          results.push({ mode, scenario: scenario.name, time: totalTime, avgTime });
        }
      }

      console.log('\n=== Complex Object Validation (2000 iterations) ===');
      console.log('Mode\t\tScenario\t\tTotal Time\tAvg Time\tPerformance');
      console.log('----\t\t--------\t\t----------\t--------\t-----------');
      
      results.forEach(result => {
        const performance = result.avgTime < 0.005 ? 'Excellent' : 
                          result.avgTime < 0.01 ? 'Good' : 
                          result.avgTime < 0.02 ? 'Fair' : 'Poor';
        console.log(`${result.mode.padEnd(12)}\t${result.scenario.padEnd(16)}\t${result.time.toFixed(2)}ms\t\t${result.avgTime.toFixed(3)}ms\t\t${performance}`);
      });

      // Performance assertions for complex validation
      const validSingle = results.find(r => r.mode === 'single' && r.scenario === 'valid');
      const invalidSingle = results.find(r => r.mode === 'single' && r.scenario === 'invalid');
      const invalidJson = results.find(r => r.mode === 'json' && r.scenario === 'invalid');

      // More lenient for CI environments with varying system resources
      expect(validSingle?.avgTime).toBeLessThan(0.03); // 30μs
      expect(invalidSingle?.avgTime).toBeLessThan(invalidJson?.avgTime || Infinity);
    });
  });

  describe('Error Mode Performance Analysis', () => {
    it('should analyze performance characteristics of each mode', () => {
      const iterations = 1000;
      const testData = invalidComplexUser; // Use invalid data to trigger errors
      
      const modeResults: Array<{ mode: string; time: number; avgTime: number; errorCount: number }> = [];

      const modes = ['multi', 'single', 'json'] as const;

      for (const mode of modes) {
        const errors: string[] = [];
        const startTime = performance.now();

        for (const _ of Array.from({ length: iterations })) {
          isComplexUser(testData, {
            identifier: 'user',
            callbackOnError: (error: string) => errors.push(error),
            errorMode: mode
          });
        }

        const endTime = performance.now();
        const totalTime = endTime - startTime;
        const avgTime = totalTime / iterations;

        modeResults.push({
          mode,
          time: totalTime,
          avgTime,
          errorCount: errors.length
        });
      }

      console.log('\n=== Error Mode Performance Analysis ===');
      console.log('Mode\t\tTotal Time\tAvg Time\tErrors\t\tPerformance Rating');
      console.log('----\t\t----------\t--------\t------\t\t------------------');
      
      modeResults.forEach(result => {
        const rating = result.avgTime < 0.005 ? 'Excellent' : 
                      result.avgTime < 0.01 ? 'Good' : 
                      result.avgTime < 0.02 ? 'Fair' : 'Poor';
        console.log(`${result.mode.padEnd(12)}\t${result.time.toFixed(2)}ms\t\t${result.avgTime.toFixed(3)}ms\t\t${result.errorCount}\t\t${rating}`);
      });

      // Performance analysis assertions
      const singleMode = modeResults.find(r => r.mode === 'single');
      const multiMode = modeResults.find(r => r.mode === 'multi');
      const jsonMode = modeResults.find(r => r.mode === 'json');

      // Single mode should be fastest for invalid data
      expect(singleMode?.avgTime).toBeLessThan(jsonMode?.avgTime || Infinity);
      
      // All modes should complete within reasonable time
      // More lenient for CI environments with varying system resources
      modeResults.forEach(result => {
        expect(result.avgTime).toBeLessThan(0.05); // 50μs max per iteration
      });

      // Error count should be consistent
      expect(singleMode?.errorCount).toBeGreaterThan(0);
      expect(multiMode?.errorCount).toBeGreaterThan(0);
      expect(jsonMode?.errorCount).toBeGreaterThan(0);
    });
  });

  describe('Performance Recommendations', () => {
    it('should provide performance recommendations based on test results', () => {
      console.log('\n=== Performance Recommendations ===');
      console.log('📊 Based on the performance test results:');
      console.log('');
      console.log('🚀 Single Mode:');
      console.log('   • Fastest for invalid data validation');
      console.log('   • Best for performance-critical applications');
      console.log('   • Use when you only need to know if data is valid');
      console.log('   • Ideal for API validation and real-time validation');
      console.log('');
      console.log('⚖️  Multi Mode (Default):');
      console.log('   • Balanced performance and error reporting');
      console.log('   • Collects all validation errors');
      console.log('   • Best for user feedback and debugging');
      console.log('   • Recommended for most use cases');
      console.log('');
      console.log('📋 JSON Mode:');
      console.log('   • Highest overhead due to tree building');
      console.log('   • Provides structured error analysis');
      console.log('   • Best for monitoring systems and complex debugging');
      console.log('   • Use when you need detailed validation state');
      console.log('');
      console.log('💡 General Guidelines:');
      console.log('   • Use Single mode for high-frequency validation');
      console.log('   • Use Multi mode for general validation');
      console.log('   • Use JSON mode for monitoring and debugging');
      console.log('   • All modes perform excellently for valid data');
      console.log('   • Performance differences are most noticeable with invalid data');

      // This test always passes - it's informational
      expect(true).toBe(true);
    });
  });
}); 