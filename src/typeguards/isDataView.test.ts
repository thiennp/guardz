import { isDataView } from "./isDataView";

describe("isDataView", () => {
  describe("basic functionality", () => {
    it("should validate DataView objects", () => {
      const buffer = new ArrayBuffer(16);
      expect(isDataView(new DataView(buffer))).toBe(true);
      expect(isDataView(new DataView(buffer, 0, 8))).toBe(true);
      expect(isDataView(new DataView(buffer, 4, 8))).toBe(true);
      expect(isDataView(buffer)).toBe(false);
      expect(isDataView(new Uint8Array(buffer))).toBe(false);
      expect(isDataView([])).toBe(false);
      expect(isDataView({})).toBe(false);
      expect(isDataView(null)).toBe(false);
      expect(isDataView(undefined)).toBe(false);
    });
  });

  describe("type narrowing", () => {
    it("should properly narrow types", () => {
      const buffer = new ArrayBuffer(16);
      const data: unknown = new DataView(buffer);

      if (isDataView(data)) {
        // data should be narrowed to DataView
        expect(data instanceof DataView).toBe(true);
        expect(data.byteLength).toBe(16);
        expect(data.byteOffset).toBe(0);
        expect(data.getUint8(0)).toBe(0);
        data.setUint16(0, 12345);
        expect(data.getUint16(0)).toBe(12345);
      } else {
        fail("Type guard should have passed");
      }
    });
  });

  describe("error handling", () => {
    it("should pass through error handling configuration", () => {
      const errors: string[] = [];
      const config = {
        identifier: "test.dataview",
        callbackOnError: (error: string) => errors.push(error),
      };

      const result = isDataView("not-a-dataview", config);

      expect(result).toBe(false);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toBe('Expected test.dataview ("not-a-dataview") to be "DataView"');
    });

    it("should work without error handling configuration", () => {
      const buffer = new ArrayBuffer(8);
      expect(isDataView(new DataView(buffer))).toBe(true);
      expect(isDataView("not-a-dataview")).toBe(false);
    });
  });
}); 