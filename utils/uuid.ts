/**
 * GitHub Issue: #2
 * Title: Core Todo Data Types & Utilities
 * Spec: https://github.com/iaminawe/todo-app-test/issues/2
 */

/**
 * Generates a UUID v4 compliant string
 * Uses crypto.randomUUID if available, otherwise falls back to a manual implementation
 *
 * @returns A UUID v4 string in the format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 * @example
 * ```typescript
 * const id = generateUUID();
 * console.log(id); // "550e8400-e29b-41d4-a716-446655440000"
 * ```
 */
export function generateUUID(): string {
  // Use native crypto.randomUUID if available (modern browsers and Node.js)
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback implementation for older environments
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Memoized UUID v4 regex pattern for better performance
const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Validates if a string is a valid UUID v4
 *
 * @param uuid - The string to validate
 * @returns True if the string is a valid UUID v4, false otherwise
 * @example
 * ```typescript
 * isValidUUID("550e8400-e29b-41d4-a716-446655440000"); // true
 * isValidUUID("not-a-uuid"); // false
 * ```
 */
export function isValidUUID(uuid: string): boolean {
  return UUID_V4_REGEX.test(uuid);
}

/**
 * Generates a short ID for display purposes (first 8 characters of UUID)
 *
 * @returns A short 8-character ID string
 * @example
 * ```typescript
 * const shortId = generateShortId();
 * console.log(shortId); // "550e8400"
 * ```
 */
export function generateShortId(): string {
  return generateUUID().substring(0, 8);
}