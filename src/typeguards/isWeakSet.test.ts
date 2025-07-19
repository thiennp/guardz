import { isWeakSet } from "./isWeakSet";
import { isNonNullObject } from "../index";

describe("isWeakSet", () => {
  describe("basic functionality", () => {
    it("should validate basic WeakSet objects", () => {
      const isAnyWeakSet = isWeakSet();
      const obj1 = {};
      const obj2 = {};

      expect(isAnyWeakSet(new WeakSet())).toBe(true);
      expect(isAnyWeakSet(new WeakSet([obj1]))).toBe(true);
      expect(isAnyWeakSet(new WeakSet([obj1, obj2]))).toBe(true);
      expect(isAnyWeakSet({})).toBe(false);
      expect(isAnyWeakSet([])).toBe(false);
      expect(isAnyWeakSet(null)).toBe(false);
      expect(isAnyWeakSet(undefined)).toBe(false);
    });
  });

  describe("with element type guards", () => {
    it("should validate WeakSet with specific element types", () => {
      const isObjectWeakSet = isWeakSet(isNonNullObject);
      const obj1 = {};
      const obj2 = {};

      expect(isObjectWeakSet(new WeakSet([obj1, obj2]))).toBe(true);
      expect(isObjectWeakSet(new WeakSet([obj1]))).toBe(true);
      expect(isObjectWeakSet(new WeakSet())).toBe(true); // Empty WeakSet is valid
      // Note: We can't easily test invalid element types since WeakSet doesn't expose iteration
    });
  });

  describe("type narrowing", () => {
    it("should properly narrow types when used with specific element types", () => {
      const isObjectWeakSet = isWeakSet(isNonNullObject);
      const obj1 = {};
      const obj2 = {};
      const data: unknown = new WeakSet([obj1, obj2]);

      if (isObjectWeakSet(data)) {
        // data should be narrowed to WeakSet<object>
        expect(typeof data).toBe("object");
        expect(data instanceof WeakSet).toBe(true);
        
        // Should be able to use WeakSet methods
        expect(data.has(obj1)).toBe(true);
        expect(data.has(obj2)).toBe(true);
      } else {
        fail("Type guard should have passed");
      }
    });

    it("should work with any WeakSet when no type guard provided", () => {
      const isAnyWeakSet = isWeakSet();
      const obj1 = {};
      const obj2 = {};
      const data: unknown = new WeakSet([obj1, obj2]);

      if (isAnyWeakSet(data)) {
        // data should be narrowed to WeakSet<object>
        expect(data instanceof WeakSet).toBe(true);
        expect(data.has(obj1)).toBe(true);
      } else {
        fail("Type guard should have passed");
      }
    });
  });

  describe("error handling", () => {
    it("should pass through error handling configuration", () => {
      const errors: string[] = [];
      const config = {
        identifier: "test.weakset",
        callbackOnError: (error: string) => errors.push(error),
      };

      const result = isWeakSet()("not-a-weakset", config);

      expect(result).toBe(false);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toBe('Expected test.weakset ("not-a-weakset") to be "WeakSet"');
    });

    it("should work without error handling configuration", () => {
      const obj = {};
      expect(isWeakSet()(new WeakSet([obj]))).toBe(true);
      expect(isWeakSet()("not-a-weakset")).toBe(false);
    });
  });
}); 