import { isTypedArray } from "./isTypedArray";
import { isNumber } from "../index";

describe("isTypedArray", () => {
  describe("basic functionality", () => {
    it("should validate TypedArray objects", () => {
      const isAnyTypedArray = isTypedArray();

      expect(isAnyTypedArray(new Int8Array())).toBe(true);
      expect(isAnyTypedArray(new Uint8Array([1, 2, 3]))).toBe(true);
      expect(isAnyTypedArray(new Int16Array([1, 2, 3]))).toBe(true);
      expect(isAnyTypedArray(new Uint16Array([1, 2, 3]))).toBe(true);
      expect(isAnyTypedArray(new Int32Array([1, 2, 3]))).toBe(true);
      expect(isAnyTypedArray(new Uint32Array([1, 2, 3]))).toBe(true);
      expect(isAnyTypedArray(new Float32Array([1.1, 2.2]))).toBe(true);
      expect(isAnyTypedArray(new Float64Array([1.1, 2.2]))).toBe(true);
      expect(isAnyTypedArray(new Uint8ClampedArray([1, 2, 3]))).toBe(true);
      expect(isAnyTypedArray([])).toBe(false);
      expect(isAnyTypedArray({})).toBe(false);
      expect(isAnyTypedArray(null)).toBe(false);
      expect(isAnyTypedArray(undefined)).toBe(false);
    });
  });

  describe("with element type guards", () => {
    it("should validate TypedArray with specific element types", () => {
      const isNumberTypedArray = isTypedArray(isNumber);

      expect(isNumberTypedArray(new Int8Array([1, 2, 3]))).toBe(true);
      expect(isNumberTypedArray(new Uint8Array([1, 2, 3]))).toBe(true);
      expect(isNumberTypedArray(new Float32Array([1.1, 2.2]))).toBe(true);
      expect(isNumberTypedArray(new Float64Array([1.1, 2.2]))).toBe(true);
      expect(isNumberTypedArray(new Int8Array())).toBe(true); // Empty array is valid
    });
  });

  describe("type narrowing", () => {
    it("should properly narrow types when used with specific element types", () => {
      const isNumberTypedArray = isTypedArray(isNumber);
      const data: unknown = new Uint8Array([1, 2, 3, 4, 5]);

      if (isNumberTypedArray(data)) {
        // data should be narrowed to TypedArray<number>
        expect(typeof data).toBe("object");
        expect(data instanceof Uint8Array).toBe(true);
        expect(data.length).toBe(5);
        expect(data[0]).toBe(1);
        expect(data[4]).toBe(5);
      } else {
        fail("Type guard should have passed");
      }
    });

    it("should work with any TypedArray when no type guard provided", () => {
      const isAnyTypedArray = isTypedArray();
      const data: unknown = new Int16Array([1, 2, 3]);

      if (isAnyTypedArray(data)) {
        // data should be narrowed to TypedArray
        expect(data instanceof Int16Array).toBe(true);
        expect(data.length).toBe(3);
      } else {
        fail("Type guard should have passed");
      }
    });
  });

  describe("error handling", () => {
    it("should pass through error handling configuration", () => {
      const errors: string[] = [];
      const config = {
        identifier: "test.typedarray",
        callbackOnError: (error: string) => errors.push(error),
      };

      const result = isTypedArray()("not-a-typedarray", config);

      expect(result).toBe(false);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toBe('Expected test.typedarray ("not-a-typedarray") to be "TypedArray"');
    });

    it("should work without error handling configuration", () => {
      expect(isTypedArray()(new Int8Array([1, 2, 3]))).toBe(true);
      expect(isTypedArray()("not-a-typedarray")).toBe(false);
    });
  });
}); 