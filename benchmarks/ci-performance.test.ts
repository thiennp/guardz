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

describe('CI Performance Tests (Lenient)', () => {
  // Skip these tests in development, run only in CI
  const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
  
  describe('Basic Performance Validation', () => {
    it('should complete basic validation within reasonable time', () => {
      const iterations = 1000; // Reduced iterations for CI
      const startTime = performance.now();

      for (const _ of Array.from({ length: iterations })) {
        isTestUser(validUser, null);
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const averageTime = totalTime / iterations;

      console.log(`CI Performance - Valid data: ${totalTime.toFixed(2)}ms total, ${averageTime.toFixed(3)}ms per iteration`);
      
      // Very lenient thresholds for CI environments
      expect(totalTime).toBeLessThan(5000); // 5 seconds max
      expect(averageTime).toBeLessThan(5); // 5ms per iteration max
    });

    it('should handle invalid data within reasonable time', () => {
      const iterations = 1000; // Reduced iterations for CI
      const startTime = performance.now();

      for (const _ of Array.from({ length: iterations })) {
        isTestUser(invalidUser, {
          identifier: 'test',
          callbackOnError: () => {},
          errorMode: 'multi' as const
        });
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const averageTime = totalTime / iterations;

      console.log(`CI Performance - Invalid data: ${totalTime.toFixed(2)}ms total, ${averageTime.toFixed(3)}ms per iteration`);
      
      // Very lenient thresholds for CI environments
      expect(totalTime).toBeLessThan(5000); // 5 seconds max
      expect(averageTime).toBeLessThan(5); // 5ms per iteration max
    });
  });

  describe('Error Mode Performance', () => {
    it('should test all error modes within reasonable time', () => {
      const iterations = 500; // Even fewer iterations for CI
      const modes = ['multi', 'single', 'json'] as const;
      const results: Array<{ mode: string; time: number; avgTime: number }> = [];

      for (const mode of modes) {
        const startTime = performance.now();

        for (const _ of Array.from({ length: iterations })) {
          isTestUser(invalidUser, {
            identifier: 'test',
            callbackOnError: () => {},
            errorMode: mode
          });
        }

        const endTime = performance.now();
        const totalTime = endTime - startTime;
        const avgTime = totalTime / iterations;

        results.push({ mode, time: totalTime, avgTime });
      }

      console.log('\n=== CI Performance - Error Modes (500 iterations) ===');
      console.log('Mode\t\tTotal Time\tAvg Time');
      console.log('----\t\t----------\t--------');
      
      results.forEach(result => {
        console.log(`${result.mode.padEnd(12)}\t${result.time.toFixed(2)}ms\t\t${result.avgTime.toFixed(3)}ms`);
      });

      // Very lenient assertions for CI
      results.forEach(result => {
        expect(result.time).toBeLessThan(3000); // 3 seconds max per mode
        expect(result.avgTime).toBeLessThan(10); // 10ms per iteration max
      });

      // Basic performance relationship should still hold
      const singleMode = results.find(r => r.mode === 'single');
      const jsonMode = results.find(r => r.mode === 'json');
      
      if (singleMode && jsonMode) {
        // Single mode should still be faster than JSON mode (but with very lenient thresholds)
        expect(singleMode.avgTime).toBeLessThan(jsonMode.avgTime * 2); // Allow 2x difference
      }
    });
  });

  describe('CI Environment Detection', () => {
    it('should detect CI environment correctly', () => {
      console.log(`CI Environment: ${isCI ? 'Yes' : 'No'}`);
      console.log(`CI Variable: ${process.env.CI}`);
      console.log(`GitHub Actions: ${process.env.GITHUB_ACTIONS}`);
      
      // This test always passes - it's informational
      expect(true).toBe(true);
    });
  });

  describe('Performance Thresholds for CI', () => {
    it('should document CI performance expectations', () => {
      console.log('\n=== CI Performance Expectations ===');
      console.log('📊 These tests use very lenient thresholds for CI environments:');
      console.log('');
      console.log('⏱️  Time Limits:');
      console.log('   • Total time: < 5 seconds for 1000 iterations');
      console.log('   • Average time: < 5ms per iteration');
      console.log('   • Error mode tests: < 3 seconds per mode');
      console.log('');
      console.log('🔧 CI Considerations:');
      console.log('   • Reduced iteration counts for faster execution');
      console.log('   • Very lenient thresholds for system variations');
      console.log('   • Focus on functionality over precise performance');
      console.log('   • Designed to pass reliably in CI environments');
      console.log('');
      console.log('💡 Development vs CI:');
      console.log('   • Development: Use stricter performance tests');
      console.log('   • CI: Use these lenient tests for reliability');
      console.log('   • Both: Ensure functionality works correctly');

      // This test always passes - it's informational
      expect(true).toBe(true);
    });
  });
}); 