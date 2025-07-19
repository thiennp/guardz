import { isWeakMap } from "./isWeakMap";
import { isNonNullObject, isNumber } from "../index";

describe("isWeakMap", () => {
  describe("basic functionality", () => {
    it("should validate basic WeakMap objects", () => {
      const isAnyWeakMap = isWeakMap();
      const obj1 = {};
      const obj2 = {};

      expect(isAnyWeakMap(new WeakMap())).toBe(true);
      expect(isAnyWeakMap(new WeakMap([[obj1, 1]]))).toBe(true);
      expect(isAnyWeakMap(new WeakMap([[obj1, 1], [obj2, 2]]))).toBe(true);
      expect(isAnyWeakMap({})).toBe(false);
      expect(isAnyWeakMap([])).toBe(false);
      expect(isAnyWeakMap(null)).toBe(false);
      expect(isAnyWeakMap(undefined)).toBe(false);
    });
  });

  describe("with key and value type guards", () => {
    it("should validate WeakMap with specific key and value types", () => {
      const isObjectNumberWeakMap = isWeakMap(isNonNullObject, isNumber);
      const obj1 = {};
      const obj2 = {};

      expect(isObjectNumberWeakMap(new WeakMap([[obj1, 1], [obj2, 2]]))).toBe(true);
      expect(isObjectNumberWeakMap(new WeakMap([[obj1, 42], [obj2, 100]]))).toBe(true);
      expect(isObjectNumberWeakMap(new WeakMap())).toBe(true); // Empty WeakMap is valid
      // Note: We can't easily test invalid key/value types since WeakMap doesn't expose iteration
    });

    it("should validate WeakMap with only key type guard", () => {
      const isObjectKeyWeakMap = isWeakMap(isNonNullObject);
      const obj1 = {};
      const obj2 = {};

      expect(isObjectKeyWeakMap(new WeakMap([[obj1, 1], [obj2, "hello"]] as [object, unknown][]))).toBe(true);
      expect(isObjectKeyWeakMap(new WeakMap([[obj1, true], [obj2, null]] as [object, unknown][]))).toBe(true);
    });

    it("should validate WeakMap with only value type guard", () => {
      const isNumberValueWeakMap = isWeakMap(undefined, isNumber);
      const obj1 = {};
      const obj2 = {};

      expect(isNumberValueWeakMap(new WeakMap([[obj1, 1], [obj2, 2]]))).toBe(true);
      expect(isNumberValueWeakMap(new WeakMap([[obj1, 42], [obj2, 100]]))).toBe(true);
    });
  });

  describe("type narrowing", () => {
    it("should properly narrow types when used with specific key/value types", () => {
      const isObjectNumberWeakMap = isWeakMap(isNonNullObject, isNumber);
      const obj1 = {};
      const obj2 = {};
      const data: unknown = new WeakMap([[obj1, 100], [obj2, 200]]);

      if (isObjectNumberWeakMap(data)) {
        // data should be narrowed to WeakMap<object, number>
        expect(typeof data).toBe("object");
        expect(data instanceof WeakMap).toBe(true);
        
        // Should be able to use WeakMap methods
        expect(data.has(obj1)).toBe(true);
        expect(data.get(obj1)).toBe(100);
      } else {
        fail("Type guard should have passed");
      }
    });

    it("should work with any WeakMap when no type guards provided", () => {
      const isAnyWeakMap = isWeakMap();
      const obj1 = {};
      const obj2 = {};
      const data: unknown = new WeakMap([[obj1, 1], [obj2, "hello"]] as [object, unknown][]);

      if (isAnyWeakMap(data)) {
        // data should be narrowed to WeakMap<object, unknown>
        expect(data instanceof WeakMap).toBe(true);
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
        identifier: "test.weakmap",
        callbackOnError: (error: string) => errors.push(error),
      };

      const result = isWeakMap()("not-a-weakmap", config);

      expect(result).toBe(false);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toBe('Expected test.weakmap ("not-a-weakmap") to be "WeakMap"');
    });

    it("should work without error handling configuration", () => {
      const obj = {};
      expect(isWeakMap()(new WeakMap([[obj, 1]]))).toBe(true);
      expect(isWeakMap()("not-a-weakmap")).toBe(false);
    });
  });
}); 