import { isRegExp } from "./isRegExp";

describe("isRegExp", () => {
  describe("basic functionality", () => {
    it("should validate RegExp objects", () => {
      expect(isRegExp(/abc/)).toBe(true);
      expect(isRegExp(new RegExp("abc"))).toBe(true);
      expect(isRegExp(/abc/g)).toBe(true);
      expect(isRegExp(/abc/i)).toBe(true);
      expect(isRegExp(/abc/m)).toBe(true);
      expect(isRegExp(/abc/gi)).toBe(true);
      expect(isRegExp("abc")).toBe(false);
      expect(isRegExp(123)).toBe(false);
      expect(isRegExp(null)).toBe(false);
      expect(isRegExp(undefined)).toBe(false);
      expect(isRegExp({})).toBe(false);
      expect(isRegExp([])).toBe(false);
    });
  });

  describe("type narrowing", () => {
    it("should properly narrow types", () => {
      const data: unknown = /^[a-z]+$/i;

      if (isRegExp(data)) {
        // data should be narrowed to RegExp
        expect(data instanceof RegExp).toBe(true);
        expect(data.test("hello")).toBe(true);
        expect(data.test("123")).toBe(false);
        expect(data.flags).toBe("i");
      } else {
        fail("Type guard should have passed");
      }
    });
  });

  describe("error handling", () => {
    it("should pass through error handling configuration", () => {
      const errors: string[] = [];
      const config = {
        identifier: "test.regex",
        callbackOnError: (error: string) => errors.push(error),
      };

      const result = isRegExp("not-a-regex", config);

      expect(result).toBe(false);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toBe('Expected test.regex ("not-a-regex") to be "RegExp"');
    });

    it("should work without error handling configuration", () => {
      expect(isRegExp(/abc/)).toBe(true);
      expect(isRegExp("abc")).toBe(false);
    });
  });
}); 