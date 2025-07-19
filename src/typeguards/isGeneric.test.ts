import { isGeneric } from "./isGeneric";
import { isString, isNumber, isBoolean, isArrayWithEachItem, isType, type TypeGuardFnConfig } from "../index";

describe("isGeneric", () => {
  describe("basic functionality", () => {
    it("should create a generic type guard from isString", () => {
      const isGenericString = isGeneric(isString);

      expect(isGenericString("hello")).toBe(true);
      expect(isGenericString("")).toBe(true);
      expect(isGenericString(123)).toBe(false);
      expect(isGenericString(null)).toBe(false);
      expect(isGenericString(undefined)).toBe(false);
      expect(isGenericString({})).toBe(false);
    });

    it("should create a generic type guard from isNumber", () => {
      const isGenericNumber = isGeneric(isNumber);

      expect(isGenericNumber(123)).toBe(true);
      expect(isGenericNumber(0)).toBe(true);
      expect(isGenericNumber(-123)).toBe(true);
      expect(isGenericNumber(3.14)).toBe(true);
      expect(isGenericNumber("123")).toBe(false);
      expect(isGenericNumber(null)).toBe(false);
      expect(isGenericNumber(undefined)).toBe(false);
      expect(isGenericNumber(NaN)).toBe(false);
    });

    it("should create a generic type guard from isBoolean", () => {
      const isGenericBoolean = isGeneric(isBoolean);

      expect(isGenericBoolean(true)).toBe(true);
      expect(isGenericBoolean(false)).toBe(true);
      expect(isGenericBoolean("true")).toBe(false);
      expect(isGenericBoolean(1)).toBe(false);
      expect(isGenericBoolean(null)).toBe(false);
      expect(isGenericBoolean(undefined)).toBe(false);
    });
  });

  describe("type narrowing", () => {
    it("should properly narrow types when used with isString", () => {
      const isGenericString = isGeneric(isString);
      const data: unknown = "hello";

      if (isGenericString(data)) {
        // data should be narrowed to string
        expect(typeof data).toBe("string");
        expect(data.toUpperCase()).toBe("HELLO");
      } else {
        fail("Type guard should have passed");
      }
    });

    it("should properly narrow types when used with isNumber", () => {
      const isGenericNumber = isGeneric(isNumber);
      const data: unknown = 42;

      if (isGenericNumber(data)) {
        // data should be narrowed to number
        expect(typeof data).toBe("number");
        expect(data.toFixed(2)).toBe("42.00");
      } else {
        fail("Type guard should have passed");
      }
    });
  });

  describe("complex type guards", () => {
    it("should work with array type guards", () => {
      const isGenericNumberArray = isGeneric(isArrayWithEachItem(isNumber));
      const isGenericStringArray = isGeneric(isArrayWithEachItem(isString));

      expect(isGenericNumberArray([1, 2, 3])).toBe(true);
      expect(isGenericNumberArray([1, "2", 3])).toBe(false);
      expect(isGenericNumberArray([])).toBe(true);

      expect(isGenericStringArray(["a", "b", "c"])).toBe(true);
      expect(isGenericStringArray(["a", 1, "c"])).toBe(false);
      expect(isGenericStringArray([])).toBe(true);
    });

    it("should work with object type guards", () => {
      const isUser = isType({
        name: isString,
        age: isNumber,
      });

      const isGenericUser = isGeneric(isUser);

      const validUser = { name: "John", age: 30 };
      const invalidUser = { name: "John", age: "30" };

      expect(isGenericUser(validUser)).toBe(true);
      expect(isGenericUser(invalidUser)).toBe(false);
      expect(isGenericUser(null)).toBe(false);
      expect(isGenericUser(undefined)).toBe(false);
    });
  });

  describe("error handling", () => {
    it("should pass through error handling configuration", () => {
      const isGenericString = isGeneric(isString);
      const errors: string[] = [];
      const config = {
        identifier: "test.value",
        callbackOnError: (error: string) => errors.push(error),
      };

      const result = isGenericString(123, config);

      expect(result).toBe(false);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toBe('Expected test.value (123) to be "string"');
    });

    it("should work with nested error handling", () => {
      const isUser = isType({
        name: isString,
        age: isNumber,
      });

      const isGenericUser = isGeneric(isUser);
      const errors: string[] = [];
      const config = {
        identifier: "user",
        callbackOnError: (error: string) => errors.push(error),
      };

      const invalidUser = { name: "John", age: "30" };
      const result = isGenericUser(invalidUser, config);

      expect(result).toBe(false);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toBe('Expected user.age ("30") to be "number"');
    });

    it("should work without error handling configuration", () => {
      const isGenericString = isGeneric(isString);

      expect(isGenericString("hello")).toBe(true);
      expect(isGenericString(123)).toBe(false);
    });
  });

  describe("composition", () => {
    it("should work when composed with other type guards", () => {
      const isGenericString = isGeneric(isString);
      const isGenericNumber = isGeneric(isNumber);

      interface MixedData {
        text: string;
        value: number;
      }

      const isMixedData = isType<MixedData>({
        text: isGenericString,
        value: isGenericNumber,
      });

      const validData = { text: "hello", value: 42 };
      const invalidData = { text: "hello", value: "42" };

      expect(isMixedData(validData)).toBe(true);
      expect(isMixedData(invalidData)).toBe(false);
    });

    it("should work with union type guards", () => {
      const isGenericString = isGeneric(isString);
      const isGenericNumber = isGeneric(isNumber);

      // This simulates a union type guard
      const isStringOrNumber = (value: unknown, config?: TypeGuardFnConfig | null): value is string | number => {
        return isGenericString(value, config) || isGenericNumber(value, config);
      };

      expect(isStringOrNumber("hello")).toBe(true);
      expect(isStringOrNumber(123)).toBe(true);
      expect(isStringOrNumber(true)).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle null and undefined values", () => {
      const isGenericString = isGeneric(isString);

      expect(isGenericString(null)).toBe(false);
      expect(isGenericString(undefined)).toBe(false);
    });

    it("should handle empty values", () => {
      const isGenericString = isGeneric(isString);
      const isGenericNumber = isGeneric(isNumber);

      expect(isGenericString("")).toBe(true);
      expect(isGenericNumber(0)).toBe(true);
    });

    it("should handle special number values", () => {
      const isGenericNumber = isGeneric(isNumber);

      expect(isGenericNumber(Infinity)).toBe(true);
      expect(isGenericNumber(-Infinity)).toBe(true);
      expect(isGenericNumber(NaN)).toBe(false);
    });
  });
}); 