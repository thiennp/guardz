import { isTuple } from './isTuple';
import { isString } from './isString';
import { isNumber } from './isNumber';
import { isBoolean } from './isBoolean';

describe('isTuple', () => {
  describe('basic tuple validation', () => {
    const isCoordinate = isTuple(isNumber, isNumber);
    const isNameAge = isTuple(isString, isNumber);

    it('should return true for valid tuples', () => {
      expect(isCoordinate([10, 20])).toBe(true);
      expect(isCoordinate([0, 0])).toBe(true);
      expect(isCoordinate([-5, 3.14])).toBe(true);

      expect(isNameAge(['John', 30])).toBe(true);
      expect(isNameAge(['', 0])).toBe(true);
    });

    it('should return false for wrong length', () => {
      expect(isCoordinate([10])).toBe(false);
      expect(isCoordinate([10, 20, 30])).toBe(false);
      expect(isCoordinate([])).toBe(false);

      expect(isNameAge(['John'])).toBe(false);
      expect(isNameAge(['John', 30, true])).toBe(false);
    });

    it('should return false for wrong types', () => {
      expect(isCoordinate(['10', 20])).toBe(false);
      expect(isCoordinate([10, '20'])).toBe(false);
      expect(isCoordinate(['10', '20'])).toBe(false);

      expect(isNameAge([30, 'John'])).toBe(false);
      expect(isNameAge([123, 456])).toBe(false);
    });
  });

  describe('complex tuple types', () => {
    const isRGBColor = isTuple(isNumber, isNumber, isNumber);
    const isUserData = isTuple(isString, isNumber, isBoolean);

    it('should validate three-element tuples', () => {
      expect(isRGBColor([255, 128, 0])).toBe(true);
      expect(isRGBColor([0, 0, 0])).toBe(true);

      expect(isUserData(['Alice', 25, true])).toBe(true);
      expect(isUserData(['Bob', 30, false])).toBe(true);
    });

    it('should reject invalid three-element tuples', () => {
      expect(isRGBColor([255, 128])).toBe(false);
      expect(isRGBColor([255, 128, 0, 100])).toBe(false);
      expect(isRGBColor(['255', 128, 0])).toBe(false);

      expect(isUserData(['Alice', '25', true])).toBe(false);
      expect(isUserData(['Alice', 25, 'true'])).toBe(false);
    });
  });

  describe('edge cases', () => {
    const isEmptyTuple = isTuple();
    const isSingleElement = isTuple(isString);

    it('should handle empty tuples', () => {
      expect(isEmptyTuple([])).toBe(true);
      expect(isEmptyTuple([1])).toBe(false);
      expect(isEmptyTuple(['a'])).toBe(false);
    });

    it('should handle single-element tuples', () => {
      expect(isSingleElement(['hello'])).toBe(true);
      expect(isSingleElement([''])).toBe(true);
      expect(isSingleElement([123])).toBe(false);
      expect(isSingleElement([])).toBe(false);
      expect(isSingleElement(['a', 'b'])).toBe(false);
    });

    it('should return false for non-arrays', () => {
      const isCoordinate = isTuple(isNumber, isNumber);

      expect(isCoordinate('not an array')).toBe(false);
      expect(isCoordinate(null)).toBe(false);
      expect(isCoordinate(undefined)).toBe(false);
      expect(isCoordinate({})).toBe(false);
      expect(isCoordinate(123)).toBe(false);
    });
  });

  describe('error handling', () => {
    const isCoordinate = isTuple(isNumber, isNumber);

    it('should not call error callback for valid tuples', () => {
      const mockCallback = jest.fn();
      const config = {
        identifier: 'coordinate',
        callbackOnError: mockCallback,
      };

      isCoordinate([10, 20], config);
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should call error callback for non-arrays', () => {
      const mockCallback = jest.fn();
      const config = {
        identifier: 'coordinate',
        callbackOnError: mockCallback,
      };

      isCoordinate('not an array', config);
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected coordinate ("not an array") to be "array"'
      );
    });

    it('should call error callback for wrong length', () => {
      const mockCallback = jest.fn();
      const config = {
        identifier: 'coordinate',
        callbackOnError: mockCallback,
      };

      isCoordinate([10], config);
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected coordinate ([\n  10\n]) to be "tuple of length 2, but got length 1"'
      );
    });

    it('should call error callback for wrong types with element details', () => {
      const mockCallback = jest.fn();
      const config = {
        identifier: 'coordinate',
        callbackOnError: mockCallback,
      };

      isCoordinate(['10', 20], config);
      expect(mockCallback).toHaveBeenCalled();
      // Should include element-specific error information
      const errorCall = mockCallback.mock.calls[0][0];
      expect(errorCall).toContain('coordinate[0]');
    });
  });

  describe('real-world use cases', () => {
    it('should validate coordinate pairs', () => {
      const isCoordinate = isTuple(isNumber, isNumber);
      const validCoordinates = [
        [0, 0],
        [10.5, -20.3],
        [100, 200],
      ];
      const invalidCoordinates = [
        [10],
        [10, 20, 30],
        ['10', 20],
        [null, undefined],
      ];

      validCoordinates.forEach(coord => {
        expect(isCoordinate(coord)).toBe(true);
      });

      invalidCoordinates.forEach(coord => {
        expect(isCoordinate(coord)).toBe(false);
      });
    });

    it('should validate database rows as tuples', () => {
      const isUserRow = isTuple(isNumber, isString, isBoolean); // [id, name, active]

      expect(isUserRow([1, 'Alice', true])).toBe(true);
      expect(isUserRow([2, 'Bob', false])).toBe(true);
      expect(isUserRow(['1', 'Alice', true])).toBe(false);
      expect(isUserRow([1, 'Alice'])).toBe(false);
    });

    it('should validate API response tuples', () => {
      const isAPIResponse = isTuple(isNumber, isString); // [status, message]

      expect(isAPIResponse([200, 'OK'])).toBe(true);
      expect(isAPIResponse([404, 'Not Found'])).toBe(true);
      expect(isAPIResponse([200])).toBe(false);
      expect(isAPIResponse(['200', 'OK'])).toBe(false);
    });

    it('should validate CSV-like data', () => {
      const isCSVRow = isTuple(isString, isString, isNumber, isBoolean);

      expect(isCSVRow(['John', 'Doe', 30, true])).toBe(true);
      expect(isCSVRow(['Jane', 'Smith', 25, false])).toBe(true);
      expect(isCSVRow(['John', 'Doe', '30', true])).toBe(false);
    });
  });
});
