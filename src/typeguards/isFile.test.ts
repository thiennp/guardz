import { isFile } from './isFile';

describe('isFile', () => {
  // Mock File constructor for testing
  const mockFile = {
    name: 'test.txt',
    size: 1024,
    type: 'text/plain',
    lastModified: Date.now(),
  } as File;

  it('should return true for File objects', () => {
    // This test will only pass in browser environments
    if (typeof File !== 'undefined') {
      const file = new File(['test content'], 'test.txt', {
        type: 'text/plain',
      });
      expect(isFile(file)).toBe(true);
    } else {
      // In Node.js environment, File is not available
      expect(isFile(mockFile)).toBe(false);
    }
  });

  it('should return false for non-File objects', () => {
    expect(isFile('not a file')).toBe(false);
    expect(isFile(123)).toBe(false);
    expect(isFile({})).toBe(false);
    expect(isFile([])).toBe(false);
    expect(isFile(null)).toBe(false);
    expect(isFile(undefined)).toBe(false);
    expect(isFile(true)).toBe(false);
    expect(isFile(() => {})).toBe(false);
  });

  it('should handle error reporting', () => {
    const mockCallback = jest.fn();
    const config = {
      identifier: 'uploadedFile',
      callbackOnError: mockCallback,
    };

    isFile('not a file', config);
    expect(mockCallback).toHaveBeenCalledTimes(1);

    if (typeof File === 'undefined') {
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected uploadedFile ("not a file") to be "File (not available in this environment)"'
      );
    } else {
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected uploadedFile ("not a file") to be "File"'
      );
    }
  });

  it('should not call error callback for valid File objects', () => {
    if (typeof File !== 'undefined') {
      const mockCallback = jest.fn();
      const config = { identifier: 'file', callbackOnError: mockCallback };

      const file = new File(['content'], 'test.txt');
      isFile(file, config);

      expect(mockCallback).not.toHaveBeenCalled();
    }
  });

  it('should handle environment detection correctly', () => {
    // Test that the guard properly detects when File is not available
    const result = isFile(mockFile);

    if (typeof File === 'undefined') {
      expect(result).toBe(false);
    } else {
      // mockFile is not a real File instance, so it should return false
      expect(result).toBe(false);
    }
  });
});
