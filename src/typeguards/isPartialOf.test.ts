import { isPartialOf } from '@/typeguards/isPartialOf';
import { isString } from '@/typeguards/isString';
import { isNumber } from '@/typeguards/isNumber';
import { isBoolean } from '@/typeguards/isBoolean';

interface TargetType {
  name: string;
  age?: number;
  isActive: boolean;
}

describe('isPartialOf', () => {
  const isPartialTarget = isPartialOf<TargetType>({
    name: isString,
    age: isNumber, // Note: age is optional in TargetType, but required here for the check
    isActive: isBoolean,
  });

  // More accurate check reflecting optional 'age'
  const isPartialTargetWithOptional = isPartialOf<Partial<TargetType>>({
    name: isString,
    // age is not required here in the shape definition
    isActive: isBoolean,
  });

  it('should return true for objects matching the partial shape', () => {
    expect(isPartialTarget({ name: 'Test', age: 30, isActive: true })).toBe(true);
    expect(isPartialTarget({ name: 'Only Name', age: 0, isActive: false })).toBe(true);
    // It checks only defined keys in the shape
    expect(isPartialTarget({ name: 'Extra', age: 10, isActive: true, extra: 'field' })).toBe(true);

    expect(isPartialTargetWithOptional({ name: 'Name only', isActive: true })).toBe(true);
    expect(isPartialTargetWithOptional({ name: 'Name', age: 40, isActive: false })).toBe(true); // age is ignored

  });

  it('should return false for non-objects or objects not matching the shape', () => {
    expect(isPartialTarget(null)).toBe(false);
    expect(isPartialTarget(undefined)).toBe(false);
    expect(isPartialTarget([])).toBe(false);
    expect(isPartialTarget({ name: 'Test', age: '30', isActive: true })).toBe(false); // age is wrong type
    expect(isPartialTarget({ name: 'Test', isActive: true })).toBe(true); // Missing 'age' is OK for partial
    // Missing 'name' is also OK for partial check, as long as existing props match
    expect(isPartialTarget({ age: 30, isActive: true })).toBe(true); 

    expect(isPartialTargetWithOptional({ name: 123, isActive: true })).toBe(false); // name wrong type
    expect(isPartialTargetWithOptional({ name: 'Name' })).toBe(true); // Missing 'isActive' is OK
    // Missing 'name' is OK for partial check, as long as existing props match.
    expect(isPartialTargetWithOptional({ isActive: true })).toBe(true); 
  });

  it('should handle error reporting for object type and property types', () => {
    const mockCallback = jest.fn();
    const config = { identifier: 'profile', callbackOnError: mockCallback };

    isPartialTarget({ name: 'Valid', age: 10, isActive: false }, config);
    expect(mockCallback).not.toHaveBeenCalled();

    // Test error for non-object
    isPartialTarget('invalid', config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('Expected profile ("invalid") to be "non-null object"');

    mockCallback.mockClear();

    // Test case where required property ('name') is missing - SHOULD NOT ERROR for isPartialOf
    isPartialTarget({ age: 10, isActive: false }, config);
    expect(mockCallback).not.toHaveBeenCalled(); // Missing 'name' is allowed

    mockCallback.mockClear();

    // Test error for incorrect property type (name)
    isPartialTarget({ name: 123, age: 10, isActive: true }, config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('Expected profile.name (123) to be "string"');

    // Add test for error on incorrect existing 'age' type for isPartialTarget
    mockCallback.mockClear(); // Clear before this check
    isPartialTarget({ name: 'Test', age: 'wrong', isActive: true }, config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('Expected profile.age ("wrong") to be "number"');

    // --- Checks for isPartialTargetWithOptional ---
    mockCallback.mockClear(); // Clear before testing the other shape
    
    // Test case where optional property ('isActive') is missing - SHOULD NOT ERROR for isPartialOf
    isPartialTargetWithOptional({ name: 'Test Only' }, config);
    expect(mockCallback).not.toHaveBeenCalled(); // Missing 'isActive' is allowed

    // Test error for incorrect type on existing property ('name') for isPartialTargetWithOptional
    mockCallback.mockClear(); 
    isPartialTargetWithOptional({ name: 123, isActive: true }, config);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('Expected profile.name (123) to be "string"');
  });
}); 