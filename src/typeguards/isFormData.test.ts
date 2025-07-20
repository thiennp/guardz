import { isFormData } from './isFormData';

describe('isFormData', () => {
  it('should return true for FormData objects', () => {
    if (typeof FormData !== 'undefined') {
      expect(isFormData(new FormData())).toBe(true);

      const formData = new FormData();
      formData.append('name', 'John');
      formData.append('email', 'john@example.com');
      expect(isFormData(formData)).toBe(true);
    } else {
      // In environments where FormData is not available
      expect(isFormData({})).toBe(false);
    }
  });

  it('should return false for non-FormData objects', () => {
    expect(isFormData('not form data')).toBe(false);
    expect(isFormData(123)).toBe(false);
    expect(isFormData({})).toBe(false);
    expect(isFormData([])).toBe(false);
    expect(isFormData(null)).toBe(false);
    expect(isFormData(undefined)).toBe(false);
    expect(isFormData(true)).toBe(false);
    expect(isFormData(() => {})).toBe(false);
  });

  it('should handle error reporting', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'userForm', callbackOnError: mockCallback };

    isFormData('not form data', config);
    expect(mockCallback).toHaveBeenCalledTimes(1);

    if (typeof FormData === 'undefined') {
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected userForm ("not form data") to be "FormData (not available in this environment)"'
      );
    } else {
      expect(mockCallback).toHaveBeenCalledWith(
        'Expected userForm ("not form data") to be "FormData"'
      );
    }
  });

  it('should not call error callback for valid FormData objects', () => {
    if (typeof FormData !== 'undefined') {
      const mockCallback = jest.fn();
      const config = { identifier: 'form', callbackOnError: mockCallback };

      const formData = new FormData();
      isFormData(formData, config);

      expect(mockCallback).not.toHaveBeenCalled();
    }
  });

  it('should handle environment detection correctly', () => {
    // Test that the guard properly detects when FormData is not available
    const result = isFormData({});

    if (typeof FormData === 'undefined') {
      expect(result).toBe(false);
    } else {
      expect(result).toBe(false); // {} is not a FormData instance
    }
  });

  it('should work with FormData that has entries', () => {
    if (typeof FormData !== 'undefined') {
      const formData = new FormData();
      formData.append('username', 'john_doe');
      formData.append('password', 'secret123');
      formData.append('remember', 'true');

      expect(isFormData(formData)).toBe(true);
    }
  });
});
