/**
 * GitHub Issue: #2
 * Title: Core Todo Data Types & Utilities
 * Spec: https://github.com/iaminawe/todo-app-test/issues/2
 */

import {
  formatDate,
  formatDateShort,
  formatRelativeTime,
  isToday,
  isPast,
  startOfDay,
  endOfDay,
} from "../date";

describe("Date Utilities", () => {
  describe("formatDate", () => {
    it("should format date with time", () => {
      const date = new Date("2024-01-15T14:30:00");
      const formatted = formatDate(date);
      expect(formatted).toContain("Jan");
      expect(formatted).toContain("15");
      expect(formatted).toContain("2024");
      expect(formatted).toMatch(/\d{1,2}:\d{2}/);
    });
  });

  describe("formatDateShort", () => {
    it("should format date without time", () => {
      const date = new Date("2024-01-15T14:30:00");
      const formatted = formatDateShort(date);
      expect(formatted).toContain("Jan");
      expect(formatted).toContain("15");
      expect(formatted).toContain("2024");
      expect(formatted).not.toMatch(/\d{1,2}:\d{2}\s*(AM|PM)/);
    });
  });

  describe("formatRelativeTime", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2024-01-15T12:00:00"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should return 'just now' for recent times", () => {
      const now = new Date();
      expect(formatRelativeTime(now)).toBe("just now");

      const thirtySecondsAgo = new Date(now.getTime() - 30 * 1000);
      expect(formatRelativeTime(thirtySecondsAgo)).toBe("just now");
    });

    it("should format minutes ago", () => {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      expect(formatRelativeTime(fiveMinutesAgo)).toBe("5 minutes ago");
    });

    it("should format hours ago", () => {
      const now = new Date();
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      expect(formatRelativeTime(twoHoursAgo)).toBe("2 hours ago");
    });

    it("should format days ago", () => {
      const now = new Date();
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      expect(formatRelativeTime(threeDaysAgo)).toBe("3 days ago");
    });

    it("should format future times", () => {
      const now = new Date();
      const inTwoHours = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      expect(formatRelativeTime(inTwoHours)).toBe("in 2 hours");
    });

    it("should fall back to date format for dates over 30 days", () => {
      const now = new Date();
      const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      const formatted = formatRelativeTime(twoMonthsAgo);
      expect(formatted).toContain("2023");
    });
  });

  describe("isToday", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2024-01-15T12:00:00"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should return true for today's date", () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);

      const todayMorning = new Date("2024-01-15T08:00:00");
      expect(isToday(todayMorning)).toBe(true);

      const todayNight = new Date("2024-01-15T23:59:59");
      expect(isToday(todayNight)).toBe(true);
    });

    it("should return false for other dates", () => {
      const yesterday = new Date("2024-01-14T12:00:00");
      expect(isToday(yesterday)).toBe(false);

      const tomorrow = new Date("2024-01-16T12:00:00");
      expect(isToday(tomorrow)).toBe(false);
    });
  });

  describe("isPast", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2024-01-15T12:00:00"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should return true for past dates", () => {
      const yesterday = new Date("2024-01-14T12:00:00");
      expect(isPast(yesterday)).toBe(true);

      const oneHourAgo = new Date("2024-01-15T11:00:00");
      expect(isPast(oneHourAgo)).toBe(true);
    });

    it("should return false for future dates", () => {
      const tomorrow = new Date("2024-01-16T12:00:00");
      expect(isPast(tomorrow)).toBe(false);

      const oneHourLater = new Date("2024-01-15T13:00:00");
      expect(isPast(oneHourLater)).toBe(false);
    });
  });

  describe("startOfDay", () => {
    it("should return start of day", () => {
      const date = new Date("2024-01-15T14:30:45.123");
      const start = startOfDay(date);

      expect(start.getHours()).toBe(0);
      expect(start.getMinutes()).toBe(0);
      expect(start.getSeconds()).toBe(0);
      expect(start.getMilliseconds()).toBe(0);
      expect(start.getDate()).toBe(15);
      expect(start.getMonth()).toBe(0);
      expect(start.getFullYear()).toBe(2024);
    });

    it("should not modify original date", () => {
      const original = new Date("2024-01-15T14:30:45.123");
      const originalTime = original.getTime();
      startOfDay(original);
      expect(original.getTime()).toBe(originalTime);
    });
  });

  describe("endOfDay", () => {
    it("should return end of day", () => {
      const date = new Date("2024-01-15T14:30:45.123");
      const end = endOfDay(date);

      expect(end.getHours()).toBe(23);
      expect(end.getMinutes()).toBe(59);
      expect(end.getSeconds()).toBe(59);
      expect(end.getMilliseconds()).toBe(999);
      expect(end.getDate()).toBe(15);
      expect(end.getMonth()).toBe(0);
      expect(end.getFullYear()).toBe(2024);
    });

    it("should not modify original date", () => {
      const original = new Date("2024-01-15T14:30:45.123");
      const originalTime = original.getTime();
      endOfDay(original);
      expect(original.getTime()).toBe(originalTime);
    });
  });
});