import { isEnum } from './isEnum';

enum StringEnum {
  A = 'A_VAL',
  B = 'B_VAL',
}

enum NumberEnum {
  Zero = 0,
  One = 1,
}

describe('isEnum', () => {
  const isStringEnumMember = isEnum(StringEnum);
  const isNumberEnumMember = isEnum(NumberEnum);

  it('should return true for valid enum members', () => {
    expect(isStringEnumMember(StringEnum.A)).toBe(true);
    expect(isStringEnumMember('B_VAL')).toBe(true);
    expect(isNumberEnumMember(NumberEnum.Zero)).toBe(true);
    expect(isNumberEnumMember(1)).toBe(true);
    expect(isNumberEnumMember('Zero')).toBe(true);
  });

  it('should return false for invalid enum members and other types', () => {
    expect(isStringEnumMember('A')).toBe(false); // Key, not value
    expect(isStringEnumMember('C_VAL')).toBe(false);
    expect(isStringEnumMember(1)).toBe(false);
    expect(isNumberEnumMember(2)).toBe(false);
    expect(isNumberEnumMember(null)).toBe(false);
    expect(isNumberEnumMember(undefined)).toBe(false);
  });

  it('should handle error reporting', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'role', callbackOnError: mockCallback };

    isStringEnumMember(StringEnum.B, config);
    expect(mockCallback).not.toHaveBeenCalled();

    isStringEnumMember('INVALID', config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    // Note: isEnum uses isOneOf internally, inheriting its error format
    expect(mockCallback).toHaveBeenCalledWith(
      'role ("INVALID") must be one of following values "A_VAL" | "B_VAL"'
    );
  });
});
