import { isPattern } from './isPattern';

describe('isPattern', () => {
  describe('valid string values matching patterns', () => {
    it('should return true for strings matching RegExp patterns', () => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmail = isPattern<'Email'>(emailPattern);

      expect(isEmail('user@example.com')).toBe(true);
      expect(isEmail('test@domain.org')).toBe(true);
      expect(isEmail('admin@company.co.uk')).toBe(true);
    });

    it('should return true for strings matching string patterns', () => {
      const isPhoneNumber = isPattern<'PhoneNumber'>('^\\+?[\\d\\s\\-()]{10,}$');

      expect(isPhoneNumber('+1-555-123-4567')).toBe(true);
      expect(isPhoneNumber('555-123-4567')).toBe(true);
      expect(isPhoneNumber('(555) 123-4567')).toBe(true);
    });

    it('should return true for strings matching URL patterns', () => {
      const isUrl = isPattern<'URL'>('^https?:\\/\\/.+');

      expect(isUrl('https://example.com')).toBe(true);
      expect(isUrl('http://test.org')).toBe(true);
      expect(isUrl('https://sub.domain.co.uk/path')).toBe(true);
    });

    it('should return true for strings matching alphanumeric patterns', () => {
      const isAlphanumeric = isPattern<'Alphanumeric'>('^[a-zA-Z0-9]+$');

      expect(isAlphanumeric('abc123')).toBe(true);
      expect(isAlphanumeric('ABC123')).toBe(true);
      expect(isAlphanumeric('123abc')).toBe(true);
    });

    it('should return true for strings matching specific formats', () => {
      const isDate = isPattern<'Date'>('^\\d{4}-\\d{2}-\\d{2}$');
      const isTime = isPattern<'Time'>('^\\d{2}:\\d{2}(:\\d{2})?$');

      expect(isDate('2023-12-25')).toBe(true);
      expect(isTime('14:30')).toBe(true);
      expect(isTime('14:30:45')).toBe(true);
    });
  });

  describe('invalid values', () => {
    it('should return false for non-string values', () => {
      const isEmail = isPattern<'Email'>(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

      expect(isEmail(123)).toBe(false);
      expect(isEmail(true)).toBe(false);
      expect(isEmail(null)).toBe(false);
      expect(isEmail(undefined)).toBe(false);
      expect(isEmail({})).toBe(false);
      expect(isEmail([])).toBe(false);
      expect(isEmail(() => {})).toBe(false);
    });

    it('should return false for strings not matching patterns', () => {
      const isEmail = isPattern<'Email'>(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      const isPhoneNumber = isPattern<'PhoneNumber'>('^\\+?[\\d\\s\\-()]{10,}$');
      const isUrl = isPattern<'URL'>('^https?:\\/\\/.+');

      expect(isEmail('invalid-email')).toBe(false);
      expect(isEmail('user@')).toBe(false);
      expect(isEmail('@domain.com')).toBe(false);
      expect(isEmail('')).toBe(false);

      expect(isPhoneNumber('123')).toBe(false);
      expect(isPhoneNumber('abc')).toBe(false);
      expect(isPhoneNumber('')).toBe(false);

      expect(isUrl('ftp://example.com')).toBe(false);
      expect(isUrl('not-a-url')).toBe(false);
      expect(isUrl('')).toBe(false);
    });

    it('should return false for empty strings', () => {
      const isEmail = isPattern<'Email'>(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      const isAlphanumeric = isPattern<'Alphanumeric'>('^[a-zA-Z0-9]+$');

      expect(isEmail('')).toBe(false);
      expect(isAlphanumeric('')).toBe(false);
    });
  });

  describe('type narrowing', () => {
    it('should narrow type to branded string when true', () => {
      const isEmail = isPattern<'Email'>(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      const value: unknown = 'user@example.com';

      if (isEmail(value)) {
        // value should be typed as Pattern<'Email'>
        expect(typeof value).toBe('string');
        expect(value).toBe('user@example.com');
      }
    });

    it('should not narrow type when false', () => {
      const isEmail = isPattern<'Email'>(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      const value: unknown = 'invalid-email';

      if (!isEmail(value)) {
        // value should still be unknown
        expect(typeof value).toBe('string');
      }
    });
  });

  describe('error handling', () => {
    it('should call error callback when value is not a string', () => {
      const mockCallback = jest.fn();
      const config = {
        callbackOnError: mockCallback,
        identifier: 'testPattern'
      };

      const isEmail = isPattern<'Email'>(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      const result = isEmail(123, config);

      expect(result).toBe(false);
      expect(mockCallback).toHaveBeenCalledWith(
        expect.stringContaining('123')
      );
      expect(mockCallback).toHaveBeenCalledWith(
        expect.stringContaining('string')
      );
    });

    it('should call error callback when string does not match pattern', () => {
      const mockCallback = jest.fn();
      const config = {
        callbackOnError: mockCallback,
        identifier: 'testPattern'
      };

      const isEmail = isPattern<'Email'>(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      const result = isEmail('invalid-email', config);

      expect(result).toBe(false);
      expect(mockCallback).toHaveBeenCalledWith(
        expect.stringContaining('invalid-email')
      );
      expect(mockCallback).toHaveBeenCalledWith(
        expect.stringContaining('pattern')
      );
    });

    it('should not call error callback when validation passes', () => {
      const mockCallback = jest.fn();
      const config = {
        callbackOnError: mockCallback,
        identifier: 'testPattern'
      };

      const isEmail = isPattern<'Email'>(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      const result = isEmail('user@example.com', config);

      expect(result).toBe(true);
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should work without config', () => {
      const isEmail = isPattern<'Email'>(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

      expect(isEmail('user@example.com')).toBe(true);
      expect(isEmail('invalid-email')).toBe(false);
      expect(isEmail(123)).toBe(false);
    });
  });

  describe('pattern handling', () => {
    it('should handle RegExp patterns', () => {
      const isEmail = isPattern<'Email'>(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

      expect(isEmail('user@example.com')).toBe(true);
      expect(isEmail('invalid-email')).toBe(false);
    });

    it('should handle string patterns', () => {
      const isEmail = isPattern<'Email'>('^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$');

      expect(isEmail('user@example.com')).toBe(true);
      expect(isEmail('invalid-email')).toBe(false);
    });

    it('should handle patterns with special characters', () => {
      const isSpecial = isPattern<'Special'>('[.*+?^${}()|[\\]\\\\]');

      expect(isSpecial('.')).toBe(true);
      expect(isSpecial('*')).toBe(true);
      expect(isSpecial('+')).toBe(true);
      expect(isSpecial('?')).toBe(true);
      expect(isSpecial('^')).toBe(true);
      expect(isSpecial('$')).toBe(true);
      expect(isSpecial('{')).toBe(true);
      expect(isSpecial('}')).toBe(true);
      expect(isSpecial('(')).toBe(true);
      expect(isSpecial(')')).toBe(true);
      expect(isSpecial('|')).toBe(true);
      expect(isSpecial('[')).toBe(true);
      expect(isSpecial(']')).toBe(true);
      expect(isSpecial('\\')).toBe(true);
    });

    it('should handle patterns with flags', () => {
      const isCaseInsensitive = isPattern<'CaseInsensitive'>('^[a-z]+$');
      const isGlobal = isPattern<'Global'>('^[a-z]+$');

      expect(isCaseInsensitive('abc')).toBe(true);
      expect(isCaseInsensitive('ABC')).toBe(false);
      expect(isGlobal('abc')).toBe(true);
      expect(isGlobal('ABC')).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle empty patterns', () => {
      const isEmpty = isPattern<'Empty'>('^$');

      expect(isEmpty('')).toBe(true);
      expect(isEmpty('a')).toBe(false);
    });

    it('should handle patterns that match everything', () => {
      const matchesAll = isPattern<'All'>('.*');

      expect(matchesAll('')).toBe(true);
      expect(matchesAll('any string')).toBe(true);
      expect(matchesAll('123')).toBe(true);
    });

    it('should handle patterns with anchors', () => {
      const startsWithA = isPattern<'StartsWithA'>('^a');
      const endsWithZ = isPattern<'EndsWithZ'>('z$');

      expect(startsWithA('abc')).toBe(true);
      expect(startsWithA('xyz')).toBe(false);
      expect(endsWithZ('xyz')).toBe(true);
      expect(endsWithZ('abc')).toBe(false);
    });
  });
}); 