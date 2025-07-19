import { isFunction } from "./isFunction";

describe("isFunction", () => {
  describe("basic functionality", () => {
    it("should validate Function objects", () => {
      expect(isFunction(() => {})).toBe(true);
      expect(isFunction(function() {})).toBe(true);
      expect(isFunction(async () => {})).toBe(true);
      expect(isFunction(function*() {})).toBe(true);
      expect(isFunction(Math.max)).toBe(true);
      expect(isFunction(console.log)).toBe(true);
      expect(isFunction("function")).toBe(false);
      expect(isFunction(123)).toBe(false);
      expect(isFunction(null)).toBe(false);
      expect(isFunction(undefined)).toBe(false);
      expect(isFunction({})).toBe(false);
      expect(isFunction([])).toBe(false);
    });
  });

  describe("type narrowing", () => {
    it("should properly narrow types", () => {
      const data: unknown = (x: number) => x * 2;

      if (isFunction(data)) {
        // data should be narrowed to Function
        expect(typeof data).toBe("function");
        expect(data(5)).toBe(10);
        // Note: function name can vary depending on how it's created
        expect(typeof data.name).toBe("string");
      } else {
        fail("Type guard should have passed");
      }
    });

    it("should work with named functions", () => {
      const data: unknown = function add(a: number, b: number) { return a + b; };

      if (isFunction(data)) {
        expect(typeof data).toBe("function");
        expect(data(2, 3)).toBe(5);
        expect(data.name).toBe("add");
      } else {
        fail("Type guard should have passed");
      }
    });

    it("should work with async functions", () => {
      const data: unknown = async function fetchData() { return "data"; };

      if (isFunction(data)) {
        expect(typeof data).toBe("function");
        expect(data.name).toBe("fetchData");
      } else {
        fail("Type guard should have passed");
      }
    });
  });

  describe("error handling", () => {
    it("should pass through error handling configuration", () => {
      const errors: string[] = [];
      const config = {
        identifier: "test.function",
        callbackOnError: (error: string) => errors.push(error),
      };

      const result = isFunction("not-a-function", config);

      expect(result).toBe(false);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toBe('Expected test.function ("not-a-function") to be "Function"');
    });

    it("should work without error handling configuration", () => {
      expect(isFunction(() => {})).toBe(true);
      expect(isFunction("function")).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle arrow functions", () => {
      const arrowFunc = (x: number) => x * 2;
      expect(isFunction(arrowFunc)).toBe(true);
    });

    it("should handle generator functions", () => {
      const generatorFunc = function*() { yield 1; };
      expect(isFunction(generatorFunc)).toBe(true);
    });

    it("should handle async arrow functions", () => {
      const asyncArrowFunc = async (x: number) => x * 2;
      expect(isFunction(asyncArrowFunc)).toBe(true);
    });

    it("should handle built-in functions", () => {
      expect(isFunction(parseInt)).toBe(true);
      expect(isFunction(parseFloat)).toBe(true);
      expect(isFunction(Array.isArray)).toBe(true);
    });
  });
}); 