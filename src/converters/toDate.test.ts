import { toDate } from './toDate';
import { isDateLike } from '../typeguards/isDateLike';
import type { DateLike } from '../types/DateLike';

describe('toDate', () => {
  describe('conversion from Date objects', () => {
    it('should return the same Date object for Date inputs', () => {
      const originalDate = new Date('2023-01-01T12:00:00Z');
      if (isDateLike(originalDate)) {
        const result = toDate(originalDate);
        
        expect(result).toBe(originalDate); // Same reference
        expect(result.getTime()).toBe(originalDate.getTime());
      }
    });

    it('should handle various Date objects', () => {
      const dates = [
        new Date(),
        new Date(0), // Unix epoch
        new Date('2023-12-25'),
        new Date(2023, 11, 25), // December 25, 2023
      ];

      dates.forEach(date => {
        if (isDateLike(date)) {
          const result = toDate(date);
          expect(result).toBe(date);
          expect(result.getTime()).toBe(date.getTime());
        }
      });
    });
  });

  describe('conversion from date strings', () => {
    it('should convert ISO date strings', () => {
      const isoString = '2023-01-01T12:00:00.000Z';
      if (isDateLike(isoString)) {
        const result = toDate(isoString);
        
        expect(result).toBeInstanceOf(Date);
        expect(result.toISOString()).toBe(isoString);
      }
    });

    it('should convert date-only strings', () => {
      const dateString = '2023-01-01';
      if (isDateLike(dateString)) {
        const result = toDate(dateString);
        
        expect(result).toBeInstanceOf(Date);
        expect(result.getFullYear()).toBe(2023);
        expect(result.getMonth()).toBe(0); // January
        expect(result.getDate()).toBe(1);
      }
    });

    it('should convert various date formats', () => {
      const formats = [
        '2023/01/01',
        '01/01/2023',
        '2023-01-01T00:00:00',
        '2023-01-01 00:00:00',
      ];

      formats.forEach(format => {
        if (isDateLike(format)) {
          const result = toDate(format);
          expect(result).toBeInstanceOf(Date);
          expect(result.getFullYear()).toBe(2023);
          expect(result.getMonth()).toBe(0);
          expect(result.getDate()).toBe(1);
        }
      });
    });

    it('should handle various date string formats', () => {
      const dateStrings = [
        '2023-01-01',
        '2023/01/01',
        '01/01/2023',
        '2023-01-01T00:00:00',
        '2023-01-01 00:00:00',
      ];

      dateStrings.forEach(dateString => {
        const result = toDate(dateString as DateLike);
        expect(result).toBeInstanceOf(Date);
        expect(result.getTime()).toBeGreaterThan(0);
      });
    });
  });

  describe('conversion from timestamps', () => {
    it('should convert Unix timestamps (seconds)', () => {
      const timestamp = 1672531200; // 2023-01-01 00:00:00 UTC
      if (isDateLike(timestamp)) {
        const result = toDate(timestamp);
        
        expect(result).toBeInstanceOf(Date);
        expect(result.getTime()).toBe(timestamp * 1000);
      }
    });

    it('should convert JavaScript timestamps (milliseconds)', () => {
      const timestamp = 1672531200000; // 2023-01-01 00:00:00 UTC
      if (isDateLike(timestamp)) {
        const result = toDate(timestamp);
        
        expect(result).toBeInstanceOf(Date);
        expect(result.getTime()).toBe(timestamp);
      }
    });

    it('should handle edge case timestamps', () => {
      const timestamps = [0, -1, Date.now()];
      
      timestamps.forEach(timestamp => {
        if (isDateLike(timestamp)) {
          expect(toDate(timestamp)).toBeInstanceOf(Date);
        }
      });
    });
  });

  describe('type safety', () => {
    it('should maintain type safety with branded types', () => {
      const dateLikeValue: DateLike = '2023-12-25T10:30:00Z';
      const result = toDate(dateLikeValue);
      
      // TypeScript should know this is a Date
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2023);
      expect(result.getMonth()).toBe(11); // December
      expect(result.getDate()).toBe(25);
    });

    it('should work with type guards', () => {
      const data: unknown = '2023-01-01';
      if (typeof data === 'string' && !isNaN(new Date(data).getTime())) {
        const dateLikeData = data as DateLike;
        const result = toDate(dateLikeData);
        
        expect(result).toBeInstanceOf(Date);
        expect(result.getFullYear()).toBe(2023);
      }
    });
  });

  describe('real-world scenarios', () => {
    it('should handle form input validation', () => {
      const formData = {
        birthDate: '1990-05-15' as DateLike,
        appointmentTime: '2023-12-25T14:30:00Z' as DateLike,
        createdAt: new Date() as DateLike,
      };

      const processedData = {
        birthDate: toDate(formData.birthDate),
        appointmentTime: toDate(formData.appointmentTime),
        createdAt: toDate(formData.createdAt),
      };

      expect(processedData.birthDate.getFullYear()).toBe(1990);
      expect(processedData.birthDate.getMonth()).toBe(4); // May
      expect(processedData.birthDate.getDate()).toBe(15);
      
      expect(processedData.appointmentTime.getFullYear()).toBe(2023);
      expect(processedData.appointmentTime.getMonth()).toBe(11); // December
      expect(processedData.appointmentTime.getDate()).toBe(25);
      
      expect(processedData.createdAt).toBeInstanceOf(Date);
    });

    it('should handle API response processing', () => {
      const apiResponse = {
        publishedAt: '2023-01-01T12:00:00Z' as DateLike,
        updatedAt: 1672531200000 as DateLike,
        expiresAt: '2023-12-31' as DateLike,
      };

      const processedResponse = {
        publishedAt: toDate(apiResponse.publishedAt),
        updatedAt: toDate(apiResponse.updatedAt),
        expiresAt: toDate(apiResponse.expiresAt),
      };

      expect(processedResponse.publishedAt.getFullYear()).toBe(2023);
      expect(processedResponse.updatedAt.getTime()).toBe(1672531200000);
      expect(processedResponse.expiresAt.getFullYear()).toBe(2023);
      expect(processedResponse.expiresAt.getMonth()).toBe(11); // December
    });

    it('should handle configuration parsing', () => {
      const config = {
        startDate: '2023-01-01' as DateLike,
        endDate: '2023-12-31' as DateLike,
        reminderTime: '09:00' as DateLike,
      };

      const parsedConfig = {
        startDate: toDate(config.startDate),
        endDate: toDate(config.endDate),
        reminderTime: toDate(config.reminderTime),
      };

      expect(parsedConfig.startDate.getFullYear()).toBe(2023);
      expect(parsedConfig.startDate.getMonth()).toBe(0); // January
      expect(parsedConfig.endDate.getFullYear()).toBe(2023);
      expect(parsedConfig.endDate.getMonth()).toBe(11); // December
    });
  });

  describe('edge cases', () => {
    it('should handle leap years', () => {
      const leapYearDate = '2024-02-29';
      const result = toDate(leapYearDate as DateLike);
      
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(1); // February
      expect(result.getDate()).toBe(29);
    });

    it('should handle different timezones', () => {
      const utcDate = '2023-01-01T00:00:00Z';
      const localDate = '2023-01-01T00:00:00';
      
      const utcResult = toDate(utcDate as DateLike);
      const localResult = toDate(localDate as DateLike);
      
      expect(utcResult).toBeInstanceOf(Date);
      expect(localResult).toBeInstanceOf(Date);
    });

    it('should handle millisecond precision', () => {
      const preciseDate = '2023-01-01T12:00:00.123Z';
      const result = toDate(preciseDate as DateLike);
      
      expect(result.getMilliseconds()).toBe(123);
    });
  });

  describe('performance', () => {
    it('should handle large number of conversions efficiently', () => {
      const start = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        toDate(new Date() as DateLike);
        toDate('2023-01-01' as DateLike);
        toDate(Date.now() as DateLike);
      }
      
      const end = performance.now();
      const duration = end - start;
      
      // Should complete in reasonable time (less than 100ms)
      expect(duration).toBeLessThan(100);
    });
  });
}); 