import { isError } from "./isError";

describe("isError", () => {
  describe("basic functionality", () => {
    it("should validate Error objects", () => {
      expect(isError(new Error())).toBe(true);
      expect(isError(new Error("Something went wrong"))).toBe(true);
      expect(isError(new TypeError("Type error"))).toBe(true);
      expect(isError(new ReferenceError("Reference error"))).toBe(true);
      expect(isError(new SyntaxError("Syntax error"))).toBe(true);
      expect(isError(new RangeError("Range error"))).toBe(true);
      expect(isError(new EvalError("Eval error"))).toBe(true);
      expect(isError(new URIError("URI error"))).toBe(true);
      expect(isError("error message")).toBe(false);
      expect(isError({ message: "error" })).toBe(false);
      expect(isError([])).toBe(false);
      expect(isError({})).toBe(false);
      expect(isError(null)).toBe(false);
      expect(isError(undefined)).toBe(false);
    });
  });

  describe("type narrowing", () => {
    it("should properly narrow types", () => {
      const data: unknown = new Error("Database connection failed");

      if (isError(data)) {
        // data should be narrowed to Error
        expect(data instanceof Error).toBe(true);
        expect(data.message).toBe("Database connection failed");
        expect(data.name).toBe("Error");
        expect(typeof data.stack).toBe("string");
      } else {
        fail("Type guard should have passed");
      }
    });

    it("should work with custom error types", () => {
      class CustomError extends Error {
        constructor(message: string, public code: number) {
          super(message);
          this.name = "CustomError";
        }
      }

      const data: unknown = new CustomError("Custom error", 500);

      if (isError(data)) {
        // data should be narrowed to Error
        expect(data instanceof CustomError).toBe(true);
        expect(data.message).toBe("Custom error");
        expect(data.name).toBe("CustomError");
        expect((data as CustomError).code).toBe(500);
      } else {
        fail("Type guard should have passed");
      }
    });
  });

  describe("error handling", () => {
    it("should pass through error handling configuration", () => {
      const errors: string[] = [];
      const config = {
        identifier: "test.error",
        callbackOnError: (error: string) => errors.push(error),
      };

      const result = isError("not-an-error", config);

      expect(result).toBe(false);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toBe('Expected test.error ("not-an-error") to be "Error"');
    });

    it("should work without error handling configuration", () => {
      expect(isError(new Error("test"))).toBe(true);
      expect(isError("not-an-error")).toBe(false);
    });
  });
}); 