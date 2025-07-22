import { isBlob } from './isBlob';

describe('isBlob', () => {
  describe('browser environment', () => {
    it('should return true for Blob objects in browser environment', () => {
      const blob = new Blob(['test content'], { type: 'text/plain' });
      expect(isBlob(blob)).toBe(true);
    });

    it('should return false for non-Blob objects', () => {
      expect(isBlob('not a blob')).toBe(false);
      expect(isBlob(123)).toBe(false);
      expect(isBlob({})).toBe(false);
      expect(isBlob([])).toBe(false);
      expect(isBlob(null)).toBe(false);
      expect(isBlob(undefined)).toBe(false);
    });

    it('should handle error reporting', () => {
      const errorCallback = jest.fn();
      const config = {
        callbackOnError: errorCallback,
        identifier: 'testBlob'
      };

      isBlob('not a blob', config);
      expect(errorCallback).toHaveBeenCalledWith(
        expect.stringContaining('Expected testBlob ("not a blob") to be "Blob"')
      );
    });

    it('should not call error callback for valid Blob objects', () => {
      const errorCallback = jest.fn();
      const config = {
        callbackOnError: errorCallback,
        identifier: 'testBlob'
      };

      const blob = new Blob(['test content']);
      isBlob(blob, config);
      expect(errorCallback).not.toHaveBeenCalled();
    });

    it('should work with Blob that has content', () => {
      const blob = new Blob(['hello world'], { type: 'text/plain' });
      expect(isBlob(blob)).toBe(true);
    });

    it('should work with empty Blob', () => {
      const blob = new Blob([], { type: 'text/plain' });
      expect(isBlob(blob)).toBe(true);
    });
  });

  describe('environment detection', () => {
    let originalBlob: typeof Blob | undefined;

    beforeEach(() => {
      originalBlob = global.Blob;
    });

    afterEach(() => {
      if (originalBlob) {
        global.Blob = originalBlob;
      } else {
        delete (global as any).Blob;
      }
    });

    it('should handle Blob not available in environment', () => {
      delete (global as any).Blob;
      expect(isBlob('test')).toBe(false);
    });

    it('should handle Blob not available with error config', () => {
      delete (global as any).Blob;
      const errorCallback = jest.fn();
      const config = {
        callbackOnError: errorCallback,
        identifier: 'testBlob'
      };

      isBlob('test', config);
      expect(errorCallback).toHaveBeenCalledWith(
        expect.stringContaining('Expected testBlob ("test") to be "Blob (not available in this environment)"')
      );
    });

    it('should handle non-Blob values with error config', () => {
      const errorCallback = jest.fn();
      const config = {
        callbackOnError: errorCallback,
        identifier: 'testBlob'
      };

      isBlob('not a blob', config);
      expect(errorCallback).toHaveBeenCalledWith(
        expect.stringContaining('Expected testBlob ("not a blob") to be "Blob"')
      );
    });

    it('should work without config', () => {
      const blob = new Blob(['test']);
      expect(isBlob(blob)).toBe(true);
      expect(isBlob('not a blob')).toBe(false);
    });

    it('should work with null config', () => {
      const blob = new Blob(['test']);
      expect(isBlob(blob, null)).toBe(true);
      expect(isBlob('not a blob', null)).toBe(false);
    });
  });

  describe('type narrowing', () => {
    it('should narrow type correctly', () => {
      const data: unknown = new Blob(['test']);
      if (isBlob(data)) {
        expect(data.size).toBe(4);
        expect(data.type).toBe('');
      }
    });

    it('should work with union types', () => {
      const data: string | Blob = new Blob(['test']);
      if (isBlob(data)) {
        expect(data.size).toBe(4);
      }
    });
  });

  describe('real-world scenarios', () => {
    it('should validate file upload data', () => {
      const fileData = new Blob(['file content'], { type: 'application/pdf' });
      expect(isBlob(fileData)).toBe(true);
    });

    it('should validate image data', () => {
      const imageData = new Blob(['image data'], { type: 'image/png' });
      expect(isBlob(imageData)).toBe(true);
    });

    it('should validate text data', () => {
      const textData = new Blob(['text content'], { type: 'text/plain' });
      expect(isBlob(textData)).toBe(true);
    });
  });
}); 