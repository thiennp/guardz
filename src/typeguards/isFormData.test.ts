import { isFormData } from './isFormData';

describe('isFormData', () => {
  describe('browser environment', () => {
    it('should return true for FormData objects in browser environment', () => {
      const formData = new FormData();
      formData.append('name', 'John');
      formData.append('email', 'john@example.com');
      expect(isFormData(formData)).toBe(true);
    });

    it('should return false for non-FormData objects', () => {
      expect(isFormData('not formdata')).toBe(false);
      expect(isFormData(123)).toBe(false);
      expect(isFormData({})).toBe(false);
      expect(isFormData([])).toBe(false);
      expect(isFormData(null)).toBe(false);
      expect(isFormData(undefined)).toBe(false);
    });

    it('should handle error reporting', () => {
      const errorCallback = jest.fn();
      const config = {
        callbackOnError: errorCallback,
        identifier: 'testFormData'
      };

      isFormData('not formdata', config);
      expect(errorCallback).toHaveBeenCalledWith(
        expect.stringContaining('Expected testFormData ("not formdata") to be "FormData"')
      );
    });

    it('should not call error callback for valid FormData objects', () => {
      const errorCallback = jest.fn();
      const config = {
        callbackOnError: errorCallback,
        identifier: 'testFormData'
      };

      const formData = new FormData();
      formData.append('test', 'value');
      isFormData(formData, config);
      expect(errorCallback).not.toHaveBeenCalled();
    });

    it('should handle environment detection correctly', () => {
      const formData = new FormData();
      expect(isFormData(formData)).toBe(true);
    });

    it('should work with FormData that has entries', () => {
      const formData = new FormData();
      formData.append('name', 'John');
      formData.append('age', '30');
      formData.append('file', new File(['test'], 'test.txt'));
      expect(isFormData(formData)).toBe(true);
    });
  });

  describe('environment detection', () => {
    let originalFormData: typeof FormData | undefined;

    beforeEach(() => {
      originalFormData = global.FormData;
    });

    afterEach(() => {
      if (originalFormData) {
        global.FormData = originalFormData;
      } else {
        delete (global as any).FormData;
      }
    });

    it('should handle FormData not available in environment', () => {
      delete (global as any).FormData;
      expect(isFormData('test')).toBe(false);
    });

    it('should handle FormData not available with error config', () => {
      delete (global as any).FormData;
      const errorCallback = jest.fn();
      const config = {
        callbackOnError: errorCallback,
        identifier: 'testFormData'
      };

      isFormData('test', config);
      expect(errorCallback).toHaveBeenCalledWith(
        expect.stringContaining('Expected testFormData ("test") to be "FormData (not available in this environment)"')
      );
    });

    it('should handle non-FormData values with error config', () => {
      const errorCallback = jest.fn();
      const config = {
        callbackOnError: errorCallback,
        identifier: 'testFormData'
      };

      isFormData('not formdata', config);
      expect(errorCallback).toHaveBeenCalledWith(
        expect.stringContaining('Expected testFormData ("not formdata") to be "FormData"')
      );
    });

    it('should work without config', () => {
      const formData = new FormData();
      expect(isFormData(formData)).toBe(true);
      expect(isFormData('not formdata')).toBe(false);
    });

    it('should work with null config', () => {
      const formData = new FormData();
      expect(isFormData(formData, null)).toBe(true);
      expect(isFormData('not formdata', null)).toBe(false);
    });
  });

  describe('type narrowing', () => {
    it('should narrow type correctly', () => {
      const formData = new FormData();
      formData.append('test', 'value');
      const data: unknown = formData;
      if (isFormData(data)) {
        expect(data.get('test')).toBe('value');
        expect(data.has('test')).toBe(true);
      }
    });

    it('should work with union types', () => {
      const data: string | FormData = new FormData();
      data.append('test', 'value');
      if (isFormData(data)) {
        expect(data.get('test')).toBe('value');
      }
    });
  });

  describe('real-world scenarios', () => {
    it('should validate form submission data', () => {
      const formData = new FormData();
      formData.append('username', 'john_doe');
      formData.append('password', 'secret123');
      expect(isFormData(formData)).toBe(true);
    });

    it('should validate file upload form data', () => {
      const formData = new FormData();
      formData.append('file', new File(['content'], 'document.pdf'));
      formData.append('description', 'Important document');
      expect(isFormData(formData)).toBe(true);
    });

    it('should validate multipart form data', () => {
      const formData = new FormData();
      formData.append('text', 'Hello World');
      formData.append('number', '42');
      formData.append('boolean', 'true');
      expect(isFormData(formData)).toBe(true);
    });
  });
});
