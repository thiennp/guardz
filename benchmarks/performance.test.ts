import { isType, isString, isNumber, isBoolean } from '../src';

interface TestUser {
  name: string;
  age: number;
  isActive: boolean;
}

const isTestUser = isType<TestUser>({
  name: isString,
  age: isNumber,
  isActive: isBoolean,
});

const validUser: TestUser = {
  name: 'John Doe',
  age: 30,
  isActive: true,
};

const invalidUser = {
  name: 123,        // should be string
  age: '30',        // should be number
  isActive: 'yes',  // should be boolean
};

const partiallyValidUser = {
  name: 'John Doe', // valid
  age: '30',        // invalid - should be number
  isActive: true,   // valid
};

describe('Performance Benchmarks', () => {
  describe('Valid Data Validation', () => {
    it('should perform type guard validation efficiently (no config)', () => {
      const iterations = 10000;
      const startTime = performance.now();

      for (const _ of Array.from({ length: iterations })) {
        isTestUser(validUser, null);
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const averageTime = totalTime / iterations;

      console.log(`Valid data (no config): ${totalTime.toFixed(2)}ms total, ${averageTime.toFixed(3)}ms per iteration`);
      
      // Should complete 10k iterations in under 1000ms (100μs per iteration)
      // More lenient for CI environments with varying system resources
      expect(totalTime).toBeLessThan(1000);
      expect(averageTime).toBeLessThan(0.1); // 100μs
    });

    it('should perform type guard validation efficiently (multi mode)', () => {
      const iterations = 10000;
      const startTime = performance.now();

      for (const _ of Array.from({ length: iterations })) {
        isTestUser(validUser, {
          identifier: 'test',
          callbackOnError: () => {}, // No-op callback
          errorMode: 'multi' as const
        });
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const averageTime = totalTime / iterations;

      console.log(`Valid data (multi mode): ${totalTime.toFixed(2)}ms total, ${averageTime.toFixed(3)}ms per iteration`);
      
      // Should complete 10k iterations in under 1000ms (100μs per iteration)
      // More lenient for CI environments with varying system resources
      expect(totalTime).toBeLessThan(1000);
      expect(averageTime).toBeLessThan(0.1); // 100μs
    });

    it('should perform type guard validation efficiently (single mode)', () => {
      const iterations = 10000;
      const startTime = performance.now();

      for (const _ of Array.from({ length: iterations })) {
        isTestUser(validUser, {
          identifier: 'test',
          callbackOnError: () => {}, // No-op callback
          errorMode: 'single' as const
        });
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const averageTime = totalTime / iterations;

      console.log(`Valid data (single mode): ${totalTime.toFixed(2)}ms total, ${averageTime.toFixed(3)}ms per iteration`);
      
      // Should complete 10k iterations in under 1000ms (100μs per iteration)
      // More lenient for CI environments with varying system resources
      expect(totalTime).toBeLessThan(1000);
      expect(averageTime).toBeLessThan(0.1); // 100μs
    });

    it('should perform type guard validation efficiently (json mode)', () => {
      const iterations = 10000;
      const startTime = performance.now();

      for (const _ of Array.from({ length: iterations })) {
        isTestUser(validUser, {
          identifier: 'test',
          callbackOnError: () => {}, // No-op callback
          errorMode: 'json' as const
        });
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const averageTime = totalTime / iterations;

      console.log(`Valid data (json mode): ${totalTime.toFixed(2)}ms total, ${averageTime.toFixed(3)}ms per iteration`);
      
      // Should complete 10k iterations in under 1000ms (100μs per iteration)
      // More lenient for CI environments with varying system resources
      expect(totalTime).toBeLessThan(1000);
      expect(averageTime).toBeLessThan(0.1); // 100μs
    });
  });

  describe('Invalid Data Validation', () => {
    it('should handle invalid data efficiently (multi mode)', () => {
      const iterations = 10000;
      const startTime = performance.now();

      for (const _ of Array.from({ length: iterations })) {
        isTestUser(invalidUser, {
          identifier: 'test',
          callbackOnError: () => {}, // No-op callback
          errorMode: 'multi' as const
        });
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const averageTime = totalTime / iterations;

      console.log(`Invalid data (multi mode): ${totalTime.toFixed(2)}ms total, ${averageTime.toFixed(3)}ms per iteration`);
      
      // Should complete 10k iterations in under 1000ms (100μs per iteration)
      // Invalid data validation includes error handling overhead
      // More lenient for CI environments with varying system resources
      expect(totalTime).toBeLessThan(1000);
      expect(averageTime).toBeLessThan(0.1); // 100μs
    });

    it('should handle invalid data efficiently (single mode)', () => {
      const iterations = 10000;
      const startTime = performance.now();

      for (const _ of Array.from({ length: iterations })) {
        isTestUser(invalidUser, {
          identifier: 'test',
          callbackOnError: () => {}, // No-op callback
          errorMode: 'single' as const
        });
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const averageTime = totalTime / iterations;

      console.log(`Invalid data (single mode): ${totalTime.toFixed(2)}ms total, ${averageTime.toFixed(3)}ms per iteration`);
      
      // Single mode should be faster as it stops at first error
      // More lenient for CI environments with varying system resources
      expect(totalTime).toBeLessThan(800);
      expect(averageTime).toBeLessThan(0.08); // 80μs
    });

    it('should handle invalid data efficiently (json mode)', () => {
      const iterations = 10000;
      const startTime = performance.now();

      for (const _ of Array.from({ length: iterations })) {
        isTestUser(invalidUser, {
          identifier: 'test',
          callbackOnError: () => {}, // No-op callback
          errorMode: 'json' as const
        });
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const averageTime = totalTime / iterations;

      console.log(`Invalid data (json mode): ${totalTime.toFixed(2)}ms total, ${averageTime.toFixed(3)}ms per iteration`);
      
      // JSON mode has higher overhead due to tree building
      // More lenient for CI environments with varying system resources
      expect(totalTime).toBeLessThan(1200);
      expect(averageTime).toBeLessThan(0.12); // 120μs
    });
  });

  describe('Partially Valid Data Validation', () => {
    it('should handle partially valid data efficiently (multi mode)', () => {
      const iterations = 10000;
      const startTime = performance.now();

      for (const _ of Array.from({ length: iterations })) {
        isTestUser(partiallyValidUser, {
          identifier: 'test',
          callbackOnError: () => {}, // No-op callback
          errorMode: 'multi' as const
        });
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const averageTime = totalTime / iterations;

      console.log(`Partially valid data (multi mode): ${totalTime.toFixed(2)}ms total, ${averageTime.toFixed(3)}ms per iteration`);
      
      // Should complete 10k iterations in under 1000ms (100μs per iteration)
      // More lenient for CI environments with varying system resources
      expect(totalTime).toBeLessThan(1000);
      expect(averageTime).toBeLessThan(0.1); // 100μs
    });

    it('should handle partially valid data efficiently (single mode)', () => {
      const iterations = 10000;
      const startTime = performance.now();

      for (const _ of Array.from({ length: iterations })) {
        isTestUser(partiallyValidUser, {
          identifier: 'test',
          callbackOnError: () => {}, // No-op callback
          errorMode: 'single' as const
        });
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const averageTime = totalTime / iterations;

      console.log(`Partially valid data (single mode): ${totalTime.toFixed(2)}ms total, ${averageTime.toFixed(3)}ms per iteration`);
      
      // Single mode should be faster as it stops at first error
      // More lenient for CI environments with varying system resources
      expect(totalTime).toBeLessThan(800);
      expect(averageTime).toBeLessThan(0.08); // 80μs
    });

    it('should handle partially valid data efficiently (json mode)', () => {
      const iterations = 10000;
      const startTime = performance.now();

      for (const _ of Array.from({ length: iterations })) {
        isTestUser(partiallyValidUser, {
          identifier: 'test',
          callbackOnError: () => {}, // No-op callback
          errorMode: 'json' as const
        });
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const averageTime = totalTime / iterations;

      console.log(`Partially valid data (json mode): ${totalTime.toFixed(2)}ms total, ${averageTime.toFixed(3)}ms per iteration`);
      
      // JSON mode has higher overhead due to tree building
      // More lenient for CI environments with varying system resources
      expect(totalTime).toBeLessThan(1200);
      expect(averageTime).toBeLessThan(0.12); // 120μs
    });
  });

  describe('Performance Comparison Summary', () => {
    it('should demonstrate performance characteristics across modes', () => {
      const iterations = 1000; // Smaller sample for comparison
      const results: Array<{ mode: string; scenario: string; time: number; avgTime: number }> = [];

      // Test scenarios
      const scenarios = [
        { name: 'valid', data: validUser },
        { name: 'invalid', data: invalidUser },
        { name: 'partially-valid', data: partiallyValidUser }
      ];

      const modes = ['multi', 'single', 'json'] as const;

      // Run all combinations
      for (const scenario of scenarios) {
        for (const mode of modes) {
          const startTime = performance.now();

          for (const _ of Array.from({ length: iterations })) {
            isTestUser(scenario.data, {
              identifier: 'test',
              callbackOnError: () => {},
              errorMode: mode
            });
          }

          const endTime = performance.now();
          const totalTime = endTime - startTime;
          const avgTime = totalTime / iterations;

          results.push({
            mode,
            scenario: scenario.name,
            time: totalTime,
            avgTime
          });
        }
      }

      // Log performance comparison
      console.log('\n=== Performance Comparison (1000 iterations) ===');
      console.log('Mode\t\tScenario\t\tTotal Time\tAvg Time');
      console.log('----\t\t--------\t\t----------\t--------');
      
      results.forEach(result => {
        console.log(`${result.mode.padEnd(12)}\t${result.scenario.padEnd(16)}\t${result.time.toFixed(2)}ms\t\t${result.avgTime.toFixed(3)}ms`);
      });

      // Performance assertions
      const validMulti = results.find(r => r.mode === 'multi' && r.scenario === 'valid');
      const invalidSingle = results.find(r => r.mode === 'single' && r.scenario === 'invalid');
      const invalidJson = results.find(r => r.mode === 'json' && r.scenario === 'invalid');

      // Valid data should be fast across all modes
      // More lenient for CI environments with varying system resources
      expect(validMulti?.avgTime).toBeLessThan(0.1);

      // Single mode should be fastest for invalid data
      expect(invalidSingle?.avgTime).toBeLessThan(invalidJson?.avgTime || Infinity);

      // All modes should complete within reasonable time
      // More lenient for CI environments with varying system resources
      results.forEach(result => {
        expect(result.avgTime).toBeLessThan(0.15); // 150μs max per iteration
      });
    });
  });
}); 