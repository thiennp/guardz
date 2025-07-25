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
  name: 'John Doe',
  age: '30', // string instead of number
  isActive: true,
};

describe('Performance Benchmarks', () => {
  it('should perform type guard validation efficiently', () => {
    const iterations = 10000;
    const startTime = performance.now();

    for (const _ of Array.from({ length: iterations })) {
      isTestUser(validUser, null);
    }

    const endTime = performance.now();
    const averageTime = (endTime - startTime) / iterations;

    // Should complete 10k iterations in under 200ms (20μs per iteration)
    expect(endTime - startTime).toBeLessThan(200);
    expect(averageTime).toBeLessThan(0.02); // 10μs
  });

  it('should handle invalid data efficiently', () => {
    const iterations = 10000;
    const startTime = performance.now();

    for (const _ of Array.from({ length: iterations })) {
      isTestUser(invalidUser, null);
    }

    const endTime = performance.now();
    const averageTime = (endTime - startTime) / iterations;

    // Should complete 10k iterations in under 100ms
    expect(endTime - startTime).toBeLessThan(100);
    expect(averageTime).toBeLessThan(0.01);
  });
}); 