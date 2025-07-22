import { isFileList } from './isFileList';

describe('isFileList', () => {
  // Mock FileList for testing
  const mockFileList = {
    length: 2,
    item: (index: number) => ({ name: `file${index}.txt` }),
    0: { name: 'file0.txt' },
    1: { name: 'file1.txt' },
  } as unknown as FileList;

  it('should return true for FileList objects in browser environment', () => {
    // This test will only pass in browser environments
    if (typeof FileList !== 'undefined') {
      // Create a mock FileList-like object that would pass instanceof check
      const fileList = Object.create(FileList.prototype);
      expect(isFileList(fileList)).toBe(true);
    } else {
      // In Node.js environment, FileList is not available
      expect(isFileList(mockFileList)).toBe(false);
    }
  });

  it('should return false for non-FileList objects', () => {
    expect(isFileList('not a file list')).toBe(false);
    expect(isFileList(123)).toBe(false);
    expect(isFileList({})).toBe(false);
    expect(isFileList([])).toBe(false);
    expect(isFileList(null)).toBe(false);
    expect(isFileList(undefined)).toBe(false);
    expect(isFileList(true)).toBe(false);
    expect(isFileList(() => {})).toBe(false);
  });

  it('should handle error reporting', () => {
    const mockCallback = jest.fn();
    const config = {
      identifier: 'uploadedFiles',
      callbackOnError: mockCallback,
    };

    isFileList('not a file list', config);
    expect(mockCallback).toHaveBeenCalledTimes(1);

    if (typeof FileList === 'undefined') {
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected uploadedFiles ("not a file list") to be "FileList (not available in this environment)"'
      );
    } else {
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected uploadedFiles ("not a file list") to be "FileList"'
      );
    }
  });

  it('should not call error callback for valid FileList objects', () => {
    if (typeof FileList !== 'undefined') {
      const mockCallback = jest.fn();
      const config = { identifier: 'files', callbackOnError: mockCallback };

      const fileList = Object.create(FileList.prototype);
      isFileList(fileList, config);

      expect(mockCallback).not.toHaveBeenCalled();
    }
  });

  it('should handle environment detection correctly', () => {
    // Test that the guard properly detects when FileList is not available
    const result = isFileList(mockFileList);

    if (typeof FileList === 'undefined') {
      expect(result).toBe(false);
    } else {
      expect(result).toBe(true);
    }
  });

  it('should work with array-like objects that are not FileList', () => {
    // Array-like object that might be confused with FileList
    const arrayLike = {
      length: 2,
      0: { name: 'file1.txt' },
      1: { name: 'file2.txt' },
    };

    expect(isFileList(arrayLike)).toBe(false);
  });

  describe('environment detection edge cases', () => {
    it('should handle null config when FileList is not available', () => {
      const result = isFileList(mockFileList, null);
      expect(result).toBe(false);
      // Should not throw when config is null
    });

    it('should handle undefined config when FileList is not available', () => {
      const result = isFileList(mockFileList, undefined);
      expect(result).toBe(false);
      // Should not throw when config is undefined
    });

    it('should handle null config when FileList is available but value is invalid', () => {
      if (typeof FileList !== 'undefined') {
        const result = isFileList('not a file list', null);
        expect(result).toBe(false);
        // Should not throw when config is null
      }
    });

    it('should handle undefined config when FileList is available but value is invalid', () => {
      if (typeof FileList !== 'undefined') {
        const result = isFileList('not a file list', undefined);
        expect(result).toBe(false);
        // Should not throw when config is undefined
      }
    });

    it('should handle valid FileList with error config when FileList is available', () => {
      if (typeof FileList !== 'undefined') {
        const validFileList = Object.create(FileList.prototype);
        const mockCallback = jest.fn();
        const config = {
          identifier: 'testFiles',
          callbackOnError: mockCallback,
        };

        const result = isFileList(validFileList, config);

        expect(result).toBe(true);
        expect(mockCallback).not.toHaveBeenCalled();
      }
    });

    it('should handle invalid value with error config when FileList is available', () => {
      if (typeof FileList !== 'undefined') {
        const mockCallback = jest.fn();
        const config = {
          identifier: 'testFiles',
          callbackOnError: mockCallback,
        };

        const result = isFileList('not a file list', config);

        expect(result).toBe(false);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith(
          'Expected testFiles ("not a file list") to be "FileList"'
        );
      }
    });

    it('should handle error reporting when FileList is not available', () => {
      const mockCallback = jest.fn();
      const config = {
        identifier: 'testFiles',
        callbackOnError: mockCallback,
      };

      isFileList(mockFileList, config);

      if (typeof FileList === 'undefined') {
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith(
          expect.stringContaining('Expected testFiles')
        );
        expect(mockCallback).toHaveBeenCalledWith(
          expect.stringContaining('FileList (not available in this environment)')
        );
      }
    });

    it('should handle error reporting for invalid values when FileList is available', () => {
      if (typeof FileList !== 'undefined') {
        const mockCallback = jest.fn();
        const config = {
          identifier: 'testFiles',
          callbackOnError: mockCallback,
        };

        isFileList(123, config);

        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith(
          'Expected testFiles (123) to be "FileList"'
        );
      }
    });

    it('should handle error reporting for null values when FileList is available', () => {
      if (typeof FileList !== 'undefined') {
        const mockCallback = jest.fn();
        const config = {
          identifier: 'testFiles',
          callbackOnError: mockCallback,
        };

        isFileList(null, config);

        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith(
          'Expected testFiles (null) to be "FileList"'
        );
      }
    });

    it('should handle error reporting for undefined values when FileList is available', () => {
      if (typeof FileList !== 'undefined') {
        const mockCallback = jest.fn();
        const config = {
          identifier: 'testFiles',
          callbackOnError: mockCallback,
        };

        isFileList(undefined, config);

        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith(
          'Expected testFiles (undefined) to be "FileList"'
        );
      }
    });

    it('should handle error reporting for boolean values when FileList is available', () => {
      if (typeof FileList !== 'undefined') {
        const mockCallback = jest.fn();
        const config = {
          identifier: 'testFiles',
          callbackOnError: mockCallback,
        };

        isFileList(true, config);

        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith(
          'Expected testFiles (true) to be "FileList"'
        );
      }
    });

    it('should handle error reporting for function values when FileList is available', () => {
      if (typeof FileList !== 'undefined') {
        const mockCallback = jest.fn();
        const config = {
          identifier: 'testFiles',
          callbackOnError: mockCallback,
        };

        const testFunction = () => {};
        isFileList(testFunction, config);

        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith(
          'Expected testFiles to be "FileList"'
        );
      }
    });

    it('should handle error reporting for object values when FileList is available', () => {
      if (typeof FileList !== 'undefined') {
        const mockCallback = jest.fn();
        const config = {
          identifier: 'testFiles',
          callbackOnError: mockCallback,
        };

        const testObject = { name: 'test' };
        isFileList(testObject, config);

        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith(
          'Expected testFiles to be "FileList"'
        );
      }
    });

    it('should handle error reporting for array values when FileList is available', () => {
      if (typeof FileList !== 'undefined') {
        const mockCallback = jest.fn();
        const config = {
          identifier: 'testFiles',
          callbackOnError: mockCallback,
        };

        const testArray = [{ name: 'file1.txt' }, { name: 'file2.txt' }];
        isFileList(testArray, config);

        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith(
          'Expected testFiles to be "FileList"'
        );
      }
    });

    it('should handle exception when accessing FileList constructor', () => {
      const original = Object.getOwnPropertyDescriptor(globalThis, 'FileList');
      
      // Create a getter that throws an error
      Object.defineProperty(globalThis, 'FileList', {
        configurable: true,
        enumerable: true,
        get() {
          throw new Error('Simulated access error');
        },
      });

      const mockCallback = jest.fn();
      const config = { identifier: 'testFiles', callbackOnError: mockCallback };

      expect(isFileList({}, config)).toBe(false);
      expect(mockCallback).toHaveBeenCalledWith(
        expect.stringContaining('FileList (not available in this environment)')
      );

      // Restore original
      if (original) {
        Object.defineProperty(globalThis, 'FileList', original);
      } else {
        delete (globalThis as any).FileList;
      }
    });

    it('should handle exception when accessing FileList constructor without config', () => {
      const original = Object.getOwnPropertyDescriptor(globalThis, 'FileList');
      
      // Create a getter that throws an error
      Object.defineProperty(globalThis, 'FileList', {
        configurable: true,
        enumerable: true,
        get() {
          throw new Error('Simulated access error');
        },
      });

      expect(isFileList({})).toBe(false);

      // Restore original
      if (original) {
        Object.defineProperty(globalThis, 'FileList', original);
      } else {
        delete (globalThis as any).FileList;
      }
    });

    it('should handle exception when accessing FileList constructor with null config', () => {
      const original = Object.getOwnPropertyDescriptor(globalThis, 'FileList');
      
      // Create a getter that throws an error
      Object.defineProperty(globalThis, 'FileList', {
        configurable: true,
        enumerable: true,
        get() {
          throw new Error('Simulated access error');
        },
      });

      expect(isFileList({}, null)).toBe(false);

      // Restore original
      if (original) {
        Object.defineProperty(globalThis, 'FileList', original);
      } else {
        delete (globalThis as any).FileList;
      }
    });

    it('should handle exception when accessing FileList constructor with undefined config', () => {
      const original = Object.getOwnPropertyDescriptor(globalThis, 'FileList');
      
      // Create a getter that throws an error
      Object.defineProperty(globalThis, 'FileList', {
        configurable: true,
        enumerable: true,
        get() {
          throw new Error('Simulated access error');
        },
      });

      expect(isFileList({}, undefined)).toBe(false);

      // Restore original
      if (original) {
        Object.defineProperty(globalThis, 'FileList', original);
      } else {
        delete (globalThis as any).FileList;
      }
    });

    it('should handle exception when accessing FileList constructor using proxy', () => {
      const original = Object.getOwnPropertyDescriptor(globalThis, 'FileList');
      
      // Use a proxy to throw an error when accessing FileList
      const proxy = new Proxy(globalThis, {
        get(target, prop) {
          if (prop === 'FileList') {
            throw new Error('Simulated proxy access error');
          }
          return target[prop as keyof typeof globalThis];
        }
      });

      // Temporarily replace globalThis with proxy
      const originalGlobalThis = globalThis;
      (global as any).globalThis = proxy;

      expect(isFileList({})).toBe(false);

      // Restore original
      (global as any).globalThis = originalGlobalThis;
      if (original) {
        Object.defineProperty(globalThis, 'FileList', original);
      } else {
        delete (globalThis as any).FileList;
      }
    });

    it('should handle exception when accessing FileList constructor with direct property access', () => {
      const original = Object.getOwnPropertyDescriptor(globalThis, 'FileList');
      
      // Create a property that throws when accessed
      Object.defineProperty(globalThis, 'FileList', {
        configurable: true,
        enumerable: true,
        get() {
          throw new TypeError('Simulated direct access error');
        },
        set() {
          throw new TypeError('Simulated direct access error');
        }
      });

      expect(isFileList({})).toBe(false);

      // Restore original
      if (original) {
        Object.defineProperty(globalThis, 'FileList', original);
      } else {
        delete (globalThis as any).FileList;
      }
    });
  });
});
