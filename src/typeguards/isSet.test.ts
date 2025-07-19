import { isSet } from "./isSet";
import { isString, isNumber } from "../index";

describe("isSet", () => {
  describe("basic functionality", () => {
    it("should validate basic Set objects", () => {
      const isAnySet = isSet();

      expect(isAnySet(new Set())).toBe(true);
      expect(isAnySet(new Set([1, 2, 3]))).toBe(true);
      expect(isAnySet(new Set(["a", "b", "c"]))).toBe(true);
      expect(isAnySet({})).toBe(false);
      expect(isAnySet([])).toBe(false);
      expect(isAnySet(null)).toBe(false);
      expect(isAnySet(undefined)).toBe(false);
    });
  });

  describe("with element type guards", () => {
    it("should validate Set with specific element types", () => {
      const isStringSet = isSet(isString);
      const isNumberSet = isSet(isNumber);

      expect(isStringSet(new Set(["a", "b", "c"]))).toBe(true);
      expect(isStringSet(new Set(["hello", "world"]))).toBe(true);
      expect(isStringSet(new Set())).toBe(true); // Empty set is valid
      expect(isStringSet(new Set(["a", 1, "c"]))).toBe(false); // Mixed types
      expect(isStringSet(new Set([1, 2, 3]))).toBe(false); // Wrong type

      expect(isNumberSet(new Set([1, 2, 3]))).toBe(true);
      expect(isNumberSet(new Set([42, 100, 0]))).toBe(true);
      expect(isNumberSet(new Set([1, "2", 3]))).toBe(false); // Mixed types
    });
  });

  describe("type narrowing", () => {
    it("should properly narrow types when used with specific element types", () => {
      const isStringSet = isSet(isString);
      const data: unknown = new Set(["apple", "banana", "cherry"]);

      if (isStringSet(data)) {
        // data should be narrowed to Set<string>
        expect(typeof data).toBe("object");
        expect(data instanceof Set).toBe(true);
        
        // Should be able to use Set methods
        data.forEach(item => {
          expect(typeof item).toBe("string");
        });
      } else {
        fail("Type guard should have passed");
      }
    });

    it("should work with any Set when no type guard provided", () => {
      const isAnySet = isSet();
      const data: unknown = new Set([1, "hello", true]);

      if (isAnySet(data)) {
        // data should be narrowed to Set<unknown>
        expect(data instanceof Set).toBe(true);
        expect(data.size).toBe(3);
      } else {
        fail("Type guard should have passed");
      }
    });
  });

  describe("error handling", () => {
    it("should pass through error handling configuration", () => {
      const isStringSet = isSet(isString);
      const errors: string[] = [];
      const config = {
        identifier: "test.set",
        callbackOnError: (error: string) => errors.push(error),
      };

      const result = isStringSet({}, config);

      expect(result).toBe(false);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toBe('Expected test.set ({}) to be "Set"');
    });

    it("should work with nested error handling for invalid elements", () => {
      const isStringSet = isSet(isString);
      const errors: string[] = [];
      const config = {
        identifier: "userNames",
        callbackOnError: (error: string) => errors.push(error),
      };

      const invalidSet = new Set(["valid", 123, "also-valid"]); // Mixed types
      const result = isStringSet(invalidSet, config);

      expect(result).toBe(false);
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should work without error handling configuration", () => {
      const isStringSet = isSet(isString);

      expect(isStringSet(new Set(["a", "b"]))).toBe(true);
      expect(isStringSet(new Set(["a", 1]))).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle empty Set", () => {
      const isStringSet = isSet(isString);
      const emptySet = new Set();

      expect(isStringSet(emptySet)).toBe(true);
    });

    it("should handle Set with null/undefined values", () => {
      const isAnySet = isSet();
      const setWithNulls = new Set([null, undefined, "valid"]);

      expect(isAnySet(setWithNulls)).toBe(true);
    });

    it("should handle Set with complex objects", () => {
      const isAnySet = isSet();
      const complexSet = new Set([
        { id: 1, name: "John" },
        { id: 2, name: "Jane" }
      ]);

      expect(isAnySet(complexSet)).toBe(true);
    });
  });

  describe("composition", () => {
    it("should work when composed with other type guards", () => {
      const isStringSet = isSet(isString);
      const isNumberSet = isSet(isNumber);

      const validNames = new Set(["John", "Jane", "Bob"]);
      const validScores = new Set([100, 200, 300]);

      // Test individual sets
      expect(isStringSet(validNames)).toBe(true);
      expect(isNumberSet(validScores)).toBe(true);
    });
  });
}); 