import { isMap } from "./isMap";
import { isString, isNumber, isBoolean } from "../index";

describe("isMap", () => {
  describe("basic functionality", () => {
    it("should validate basic Map objects", () => {
      const isAnyMap = isMap();

      expect(isAnyMap(new Map())).toBe(true);
      expect(isAnyMap(new Map([["a", 1]]))).toBe(true);
      expect(isAnyMap(new Map([["a", 1], ["b", 2]]))).toBe(true);
      expect(isAnyMap({})).toBe(false);
      expect(isAnyMap([])).toBe(false);
      expect(isAnyMap(null)).toBe(false);
      expect(isAnyMap(undefined)).toBe(false);
    });
  });

  describe("with key and value type guards", () => {
    it("should validate Map with specific key and value types", () => {
      const isStringNumberMap = isMap(isString, isNumber);

      expect(isStringNumberMap(new Map([["a", 1], ["b", 2]]))).toBe(true);
      expect(isStringNumberMap(new Map([["hello", 42], ["world", 100]]))).toBe(true);
      expect(isStringNumberMap(new Map())).toBe(true); // Empty map is valid
      expect(isStringNumberMap(new Map([[1, "a"]] as [unknown, unknown][]))).toBe(false); // Wrong key/value types
      expect(isStringNumberMap(new Map([["a", "b"]] as [unknown, unknown][]))).toBe(false); // Wrong value type
      expect(isStringNumberMap(new Map([[true, 1]] as [unknown, unknown][]))).toBe(false); // Wrong key type
    });

    it("should validate Map with only key type guard", () => {
      const isStringKeyMap = isMap(isString);

      expect(isStringKeyMap(new Map([["a", 1], ["b", "hello"]] as [string, unknown][]))).toBe(true);
      expect(isStringKeyMap(new Map([["hello", true], ["world", null]] as [string, unknown][]))).toBe(true);
      expect(isStringKeyMap(new Map([[1, "a"]] as [unknown, unknown][]))).toBe(false); // Wrong key type
    });

    it("should validate Map with only value type guard", () => {
      const isNumberValueMap = isMap(undefined, isNumber);

      expect(isNumberValueMap(new Map([["a", 1], ["b", 2]]))).toBe(true);
      expect(isNumberValueMap(new Map([[true, 42], [null, 100]]))).toBe(true);
      expect(isNumberValueMap(new Map([["a", "b"]]))).toBe(false); // Wrong value type
    });
  });

  describe("type narrowing", () => {
    it("should properly narrow types when used with specific key/value types", () => {
      const isStringNumberMap = isMap(isString, isNumber);
      const data: unknown = new Map([["user1", 100], ["user2", 200]]);

      if (isStringNumberMap(data)) {
        // data should be narrowed to Map<string, number>
        expect(typeof data).toBe("object");
        expect(data instanceof Map).toBe(true);
        
        // Should be able to use Map methods
        data.forEach((value, key) => {
          expect(typeof key).toBe("string");
          expect(typeof value).toBe("number");
        });
      } else {
        fail("Type guard should have passed");
      }
    });

    it("should work with any Map when no type guards provided", () => {
      const isAnyMap = isMap();
      const data: unknown = new Map([["a", 1], [2, "b"]] as [unknown, unknown][]);

      if (isAnyMap(data)) {
        // data should be narrowed to Map<unknown, unknown>
        expect(data instanceof Map).toBe(true);
        expect(data.size).toBe(2);
      } else {
        fail("Type guard should have passed");
      }
    });
  });

  describe("error handling", () => {
    it("should pass through error handling configuration", () => {
      const isStringNumberMap = isMap(isString, isNumber);
      const errors: string[] = [];
      const config = {
        identifier: "test.map",
        callbackOnError: (error: string) => errors.push(error),
      };

      const result = isStringNumberMap({}, config);

      expect(result).toBe(false);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toBe('Expected test.map ({}) to be "Map"');
    });

    it("should work with nested error handling for invalid entries", () => {
      const isStringNumberMap = isMap(isString, isNumber);
      const errors: string[] = [];
      const config = {
        identifier: "userScores",
        callbackOnError: (error: string) => errors.push(error),
      };

      const invalidMap = new Map([[1, "not-a-number"]]); // Wrong key and value types
      const result = isStringNumberMap(invalidMap, config);

      expect(result).toBe(false);
      expect(errors.length).toBeGreaterThan(0);
      // Should have errors for both key and value validation
    });

    it("should work without error handling configuration", () => {
      const isStringNumberMap = isMap(isString, isNumber);

      expect(isStringNumberMap(new Map([["a", 1]]))).toBe(true);
      expect(isStringNumberMap(new Map([[1, "a"]]))).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle empty Map", () => {
      const isStringNumberMap = isMap(isString, isNumber);
      const emptyMap = new Map();

      expect(isStringNumberMap(emptyMap)).toBe(true);
    });

    it("should handle Map with null/undefined values", () => {
      const isStringAnyMap = isMap(isString);
      const mapWithNulls = new Map([["a", null], ["b", undefined]]);

      expect(isStringAnyMap(mapWithNulls)).toBe(true);
    });

    it("should handle Map with complex objects", () => {
      const isStringObjectMap = isMap(isString);
      const complexMap = new Map([
        ["user1", { id: 1, name: "John" }],
        ["user2", { id: 2, name: "Jane" }]
      ]);

      expect(isStringObjectMap(complexMap)).toBe(true);
    });
  });

  describe("composition", () => {
    it("should work when composed with other type guards", () => {
      const isStringNumberMap = isMap(isString, isNumber);
      const isBooleanStringMap = isMap(isBoolean, isString);

      const validScores = new Map([["user1", 100], ["user2", 200]]);
      const validFlags = new Map([[true, "enabled"], [false, "disabled"]]);

      // Test individual maps
      expect(isStringNumberMap(validScores)).toBe(true);
      expect(isBooleanStringMap(validFlags)).toBe(true);
    });
  });
}); 