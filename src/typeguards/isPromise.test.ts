import { isPromise } from "./isPromise";
import { isString, isNumber } from "../index";

describe("isPromise", () => {
  describe("basic functionality", () => {
    it("should validate Promise objects", () => {
      const isAnyPromise = isPromise();

      expect(isAnyPromise(Promise.resolve())).toBe(true);
      expect(isAnyPromise(Promise.resolve(42))).toBe(true);
      expect(isAnyPromise(new Promise(() => {}))).toBe(true);
      expect(isAnyPromise({})).toBe(false);
      expect(isAnyPromise([])).toBe(false);
      expect(isAnyPromise(null)).toBe(false);
      expect(isAnyPromise(undefined)).toBe(false);
    });
  });

  describe("with value type guards", () => {
    it("should validate Promise with specific value types", () => {
      const isStringPromise = isPromise(isString);
      const isNumberPromise = isPromise(isNumber);

      expect(isStringPromise(Promise.resolve("hello"))).toBe(true);
      expect(isStringPromise(Promise.resolve("world"))).toBe(true);
      expect(isStringPromise(Promise.resolve(42))).toBe(true); // Note: Can't validate resolved value at runtime
      expect(isNumberPromise(Promise.resolve(42))).toBe(true);
      expect(isNumberPromise(Promise.resolve("hello"))).toBe(true); // Note: Can't validate resolved value at runtime
    });
  });

  describe("type narrowing", () => {
    it("should properly narrow types", () => {
      const isStringPromise = isPromise(isString);
      const data: unknown = Promise.resolve("hello world");

      if (isStringPromise(data)) {
        // data should be narrowed to Promise<string>
        expect(data instanceof Promise).toBe(true);
        // Note: We can't validate the resolved value without awaiting
      } else {
        fail("Type guard should have passed");
      }
    });

    it("should work with any Promise when no type guard provided", () => {
      const isAnyPromise = isPromise();
      const data: unknown = Promise.resolve(42);

      if (isAnyPromise(data)) {
        // data should be narrowed to Promise<unknown>
        expect(data instanceof Promise).toBe(true);
      } else {
        fail("Type guard should have passed");
      }
    });
  });

  describe("error handling", () => {
    it("should pass through error handling configuration", () => {
      const isStringPromise = isPromise(isString);
      const errors: string[] = [];
      const config = {
        identifier: "test.promise",
        callbackOnError: (error: string) => errors.push(error),
      };

      const result = isStringPromise({}, config);

      expect(result).toBe(false);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toBe('Expected test.promise ({}) to be "Promise"');
    });

    it("should work without error handling configuration", () => {
      const isStringPromise = isPromise(isString);

      expect(isStringPromise(Promise.resolve("hello"))).toBe(true);
      expect(isStringPromise({})).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle pending promises", () => {
      const isAnyPromise = isPromise();
      const pendingPromise = new Promise(() => {});

      expect(isAnyPromise(pendingPromise)).toBe(true);
    });

    it("should handle pending promises", () => {
      const isAnyPromise = isPromise();
      const pendingPromise = new Promise(() => {});

      expect(isAnyPromise(pendingPromise)).toBe(true);
    });
  });
}); 