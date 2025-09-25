/**
 * GitHub Issue: #2
 * Title: Core Todo Data Types & Utilities
 * Spec: https://github.com/iaminawe/todo-app-test/issues/2
 */

import { Todo, TodoInput, TodoUpdate } from "@/types";
import { isValidUUID } from "@/utils/uuid";

/**
 * Type guard to check if an object is a valid Todo
 *
 * @param obj - The object to validate
 * @returns True if the object is a valid Todo, false otherwise
 * @example
 * ```typescript
 * const data = { id: "123", text: "Learn TS", completed: false };
 * if (isTodo(data)) {
 *   console.log(data.text); // TypeScript knows this is a Todo
 * }
 * ```
 */
export function isTodo(obj: unknown): obj is Todo {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  const todo = obj as Record<string, unknown>;

  return (
    typeof todo.id === "string" &&
    isValidUUID(todo.id) &&
    typeof todo.text === "string" &&
    todo.text.length > 0 &&
    typeof todo.completed === "boolean" &&
    todo.createdAt instanceof Date &&
    todo.updatedAt instanceof Date
  );
}

/**
 * Type guard to check if an object is a valid TodoInput
 *
 * @param obj - The object to validate
 * @returns True if the object is a valid TodoInput, false otherwise
 * @example
 * ```typescript
 * const input = { text: "Learn TypeScript" };
 * if (isTodoInput(input)) {
 *   // Safe to use input.text
 *   console.log(input.text);
 * }
 * ```
 */
export function isTodoInput(obj: unknown): obj is TodoInput {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  const input = obj as Record<string, unknown>;

  return (
    typeof input.text === "string" &&
    input.text.trim().length > 0 &&
    input.text.trim().length <= 500
  );
}

/**
 * Type guard to check if an object is a valid TodoUpdate
 *
 * @param obj - The object to validate
 * @returns True if the object is a valid TodoUpdate, false otherwise
 * @example
 * ```typescript
 * const update = { text: "Updated task", completed: true };
 * if (isTodoUpdate(update)) {
 *   // Safe to use update properties
 *   console.log(update.text, update.completed);
 * }
 * ```
 */
export function isTodoUpdate(obj: unknown): obj is TodoUpdate {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  const update = obj as Record<string, unknown>;

  // At least one field should be present
  const hasText = "text" in update;
  const hasCompleted = "completed" in update;

  if (!hasText && !hasCompleted) {
    return false;
  }

  // Validate text if present
  if (hasText && typeof update.text !== "string") {
    return false;
  }

  if (hasText && update.text !== undefined) {
    const text = update.text as string;
    if (text.trim().length === 0 || text.trim().length > 500) {
      return false;
    }
  }

  // Validate completed if present
  if (hasCompleted && typeof update.completed !== "boolean") {
    return false;
  }

  return true;
}

/**
 * Validates todo text input
 *
 * @param text - The text to validate
 * @returns An object with validation result and optional error message
 * @example
 * ```typescript
 * const result = validateTodoText("Learn TypeScript");
 * if (result.valid) {
 *   console.log("Valid todo text");
 * } else {
 *   console.error(result.error);
 * }
 * ```
 */
export function validateTodoText(text: string): {
  valid: boolean;
  error?: string;
} {
  const trimmed = text.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: "Todo text cannot be empty" };
  }

  if (trimmed.length > 500) {
    return {
      valid: false,
      error: "Todo text cannot exceed 500 characters",
    };
  }

  if (trimmed.length < 1) {
    return {
      valid: false,
      error: "Todo text must be at least 1 character",
    };
  }

  return { valid: true };
}

/**
 * Sanitizes todo text input by trimming whitespace and normalizing spaces
 *
 * @param text - The text to sanitize
 * @returns The sanitized text, trimmed and with normalized spacing
 * @example
 * ```typescript
 * const sanitized = sanitizeTodoText("  Learn   TypeScript  ");
 * console.log(sanitized); // "Learn TypeScript"
 * ```
 */
export function sanitizeTodoText(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .substring(0, 500); // Enforce max length
}

/**
 * Validates an array of todos
 *
 * @param todos - The array to validate
 * @returns True if all items in the array are valid todos, false otherwise
 * @example
 * ```typescript
 * const todoData = [{ id: "1", text: "Task 1", completed: false }];
 * if (validateTodos(todoData)) {
 *   // Safe to use as Todo[]
 *   todoData.forEach(todo => console.log(todo.text));
 * }
 * ```
 */
export function validateTodos(todos: unknown[]): todos is Todo[] {
  return Array.isArray(todos) && todos.every(isTodo);
}