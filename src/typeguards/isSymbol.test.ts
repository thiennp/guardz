import { isSymbol } from "./isSymbol";

describe("isSymbol", () => {
  describe("basic functionality", () => {
    it("should validate Symbol objects", () => {
      expect(isSymbol(Symbol())).toBe(true);
      expect(isSymbol(Symbol("description"))).toBe(true);
      expect(isSymbol(Symbol.iterator)).toBe(true);
      expect(isSymbol(Symbol.for("key"))).toBe(true);
      expect(isSymbol("symbol")).toBe(false);
      expect(isSymbol(123)).toBe(false);
      expect(isSymbol(null)).toBe(false);
      expect(isSymbol(undefined)).toBe(false);
      expect(isSymbol({})).toBe(false);
      expect(isSymbol([])).toBe(false);
    });
  });

  describe("type narrowing", () => {
    it("should properly narrow types", () => {
      const data: unknown = Symbol("user-id");

      if (isSymbol(data)) {
        // data should be narrowed to Symbol
        expect(typeof data).toBe("symbol");
        // Note: description property requires ES2019+
        expect(typeof data).toBe("symbol");
      } else {
        fail("Type guard should have passed");
      }
    });
  });

  describe("error handling", () => {
    it("should pass through error handling configuration", () => {
      const errors: string[] = [];
      const config = {
        identifier: "test.symbol",
        callbackOnError: (error: string) => errors.push(error),
      };

      const result = isSymbol("not-a-symbol", config);

      expect(result).toBe(false);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toBe('Expected test.symbol ("not-a-symbol") to be "Symbol"');
    });

    it("should work without error handling configuration", () => {
      expect(isSymbol(Symbol())).toBe(true);
      expect(isSymbol("symbol")).toBe(false);
    });
  });
}); 