/**
 * GitHub Issue: #2
 * Title: Core Todo Data Types & Utilities
 * Spec: https://github.com/iaminawe/todo-app-test/issues/2
 */

/**
 * Formats a date to a readable string with date and time
 *
 * @param date - The date to format
 * @returns A formatted date string in the format "Dec 25, 2023, 02:30 PM"
 * @example
 * ```typescript
 * const date = new Date('2023-12-25T14:30:00');
 * console.log(formatDate(date)); // "Dec 25, 2023, 02:30 PM"
 * ```
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Formats a date to a short readable string (no time)
 *
 * @param date - The date to format
 * @returns A formatted date string in the format "Dec 25, 2023"
 * @example
 * ```typescript
 * const date = new Date('2023-12-25T14:30:00');
 * console.log(formatDateShort(date)); // "Dec 25, 2023"
 * ```
 */
export function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

/**
 * Formats a date to relative time (e.g., "2 hours ago", "in 3 days")
 *
 * @param date - The date to format relative to now
 * @returns A relative time string like "2 hours ago", "in 3 days", or "just now"
 * @example
 * ```typescript
 * const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
 * console.log(formatRelativeTime(twoHoursAgo)); // "2 hours ago"
 * ```
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (Math.abs(diffSeconds) < 60) {
    return "just now";
  }

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(diffMinutes) < 60) {
    return rtf.format(diffMinutes, "minute");
  }

  if (Math.abs(diffHours) < 24) {
    return rtf.format(diffHours, "hour");
  }

  if (Math.abs(diffDays) < 30) {
    return rtf.format(diffDays, "day");
  }

  return formatDateShort(date);
}

/**
 * Checks if a date is today
 *
 * @param date - The date to check
 * @returns True if the date is today, false otherwise
 * @example
 * ```typescript
 * const today = new Date();
 * const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
 * console.log(isToday(today)); // true
 * console.log(isToday(yesterday)); // false
 * ```
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Checks if a date is in the past
 *
 * @param date - The date to check
 * @returns True if the date is in the past, false otherwise
 * @example
 * ```typescript
 * const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
 * const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
 * console.log(isPast(yesterday)); // true
 * console.log(isPast(tomorrow)); // false
 * ```
 */
export function isPast(date: Date): boolean {
  return date < new Date();
}

/**
 * Gets the start of the day for a given date (00:00:00.000)
 *
 * @param date - The date to get the start of day for
 * @returns A new Date object set to the beginning of the day
 * @example
 * ```typescript
 * const date = new Date('2023-12-25T14:30:00');
 * const start = startOfDay(date);
 * console.log(start); // 2023-12-25T00:00:00.000Z
 * ```
 */
export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Gets the end of the day for a given date (23:59:59.999)
 *
 * @param date - The date to get the end of day for
 * @returns A new Date object set to the end of the day
 * @example
 * ```typescript
 * const date = new Date('2023-12-25T14:30:00');
 * const end = endOfDay(date);
 * console.log(end); // 2023-12-25T23:59:59.999Z
 * ```
 */
export function endOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}