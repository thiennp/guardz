import { isFile } from './isFile';

describe('isFile', () => {
  describe('browser environment', () => {
    it('should return true for File objects in browser environment', () => {
      const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
      expect(isFile(file)).toBe(true);
    });

    it('should return false for non-File objects', () => {
      expect(isFile('not a file')).toBe(false);
      expect(isFile(123)).toBe(false);
      expect(isFile({})).toBe(false);
      expect(isFile([])).toBe(false);
      expect(isFile(null)).toBe(false);
      expect(isFile(undefined)).toBe(false);
    });

    it('should handle error reporting', () => {
      const errorCallback = jest.fn();
      const config = {
        callbackOnError: errorCallback,
        identifier: 'testFile'
      };

      isFile('not a file', config);
      expect(errorCallback).toHaveBeenCalledWith(
        expect.stringContaining('Expected testFile ("not a file") to be "File"')
      );
    });

    it('should not call error callback for valid File objects', () => {
      const errorCallback = jest.fn();
      const config = {
        callbackOnError: errorCallback,
        identifier: 'testFile'
      };

      const file = new File(['test content'], 'test.txt');
      isFile(file, config);
      expect(errorCallback).not.toHaveBeenCalled();
    });

    it('should handle environment detection correctly', () => {
      const file = new File(['test content'], 'test.txt');
      expect(isFile(file)).toBe(true);
    });
  });

  describe('environment detection', () => {
    let originalFile: typeof File | undefined;

    beforeEach(() => {
      originalFile = global.File;
    });

    afterEach(() => {
      if (originalFile) {
        global.File = originalFile;
      } else {
        delete (global as any).File;
      }
    });

    it('should handle File not available in environment', () => {
      delete (global as any).File;
      expect(isFile('test')).toBe(false);
    });

    it('should handle File not available with error config', () => {
      delete (global as any).File;
      const errorCallback = jest.fn();
      const config = {
        callbackOnError: errorCallback,
        identifier: 'testFile'
      };

      isFile('test', config);
      expect(errorCallback).toHaveBeenCalledWith(
        expect.stringContaining('Expected testFile ("test") to be "File (not available in this environment)"')
      );
    });

    it('should handle non-File values with error config', () => {
      const errorCallback = jest.fn();
      const config = {
        callbackOnError: errorCallback,
        identifier: 'testFile'
      };

      isFile('not a file', config);
      expect(errorCallback).toHaveBeenCalledWith(
        expect.stringContaining('Expected testFile ("not a file") to be "File"')
      );
    });

    it('should work without config', () => {
      const file = new File(['test'], 'test.txt');
      expect(isFile(file)).toBe(true);
      expect(isFile('not a file')).toBe(false);
    });

    it('should work with null config', () => {
      const file = new File(['test'], 'test.txt');
      expect(isFile(file, null)).toBe(true);
      expect(isFile('not a file', null)).toBe(false);
    });
  });

  describe('type narrowing', () => {
    it('should narrow type correctly', () => {
      const data: unknown = new File(['test'], 'test.txt');
      if (isFile(data)) {
        expect(data.name).toBe('test.txt');
        expect(data.size).toBe(4);
        expect(data.type).toBe('');
      }
    });

    it('should work with union types', () => {
      const data: string | File = new File(['test'], 'test.txt');
      if (isFile(data)) {
        expect(data.name).toBe('test.txt');
      }
    });
  });

  describe('real-world scenarios', () => {
    it('should validate uploaded files', () => {
      const file = new File(['file content'], 'document.pdf', { type: 'application/pdf' });
      expect(isFile(file)).toBe(true);
    });

    it('should validate image files', () => {
      const file = new File(['image data'], 'photo.jpg', { type: 'image/jpeg' });
      expect(isFile(file)).toBe(true);
    });

    it('should validate text files', () => {
      const file = new File(['text content'], 'readme.txt', { type: 'text/plain' });
      expect(isFile(file)).toBe(true);
    });
  });
});
