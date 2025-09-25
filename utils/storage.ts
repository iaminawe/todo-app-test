/**
 * GitHub Issue: #2
 * Title: Core Todo Data Types & Utilities
 * Spec: https://github.com/iaminawe/todo-app-test/issues/2
 */

import {
  TodoList,
  TodoStorageData,
  TODO_STORAGE_KEY,
  STORAGE_VERSION,
} from "@/types";

/**
 * Custom error class for storage operations
 *
 * @param message - The error message
 * @param cause - The underlying cause of the error
 */
export class StorageError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "StorageError";
  }
}

export const storage = {
  /**
   * Retrieves todo list from localStorage
   *
   * @param key - Storage key to retrieve from (defaults to TODO_STORAGE_KEY)
   * @returns The todo list or null if not found
   * @throws {StorageError} When storage access fails or date parsing fails
   * @example
   * ```typescript
   * const todos = storage.get();
   * if (todos) {
   *   console.log(`Found ${todos.length} todos`);
   * }
   * ```
   */
  get: (key: string = TODO_STORAGE_KEY): TodoList | null => {
    try {
      if (typeof window === "undefined") {
        return null;
      }

      const item = localStorage.getItem(key);
      if (!item) {
        return null;
      }

      const parsed: TodoStorageData = JSON.parse(item);

      // Version check for future migrations
      if (parsed.version !== STORAGE_VERSION) {
        console.warn(
          `Storage version mismatch. Expected ${STORAGE_VERSION}, got ${parsed.version}`
        );
      }

      // Convert date strings back to Date objects
      const todos: TodoList = parsed.data.map((todo) => {
        try {
          return {
            ...todo,
            createdAt: new Date(todo.createdAt),
            updatedAt: new Date(todo.updatedAt),
          };
        } catch (dateError) {
          throw new StorageError(
            `Failed to parse dates for todo ${todo.id}`,
            dateError
          );
        }
      });

      return todos;
    } catch (error) {
      throw new StorageError("Failed to get todos from storage", error);
    }
  },

  /**
   * Saves todo list to localStorage
   *
   * @param todos - The todo list to save
   * @param key - Storage key to save to (defaults to TODO_STORAGE_KEY)
   * @throws {StorageError} When storage quota is exceeded or save operation fails
   * @example
   * ```typescript
   * const todos: TodoList = [{
   *   id: generateUUID(),
   *   text: "Learn TypeScript",
   *   completed: false,
   *   createdAt: new Date(),
   *   updatedAt: new Date()
   * }];
   * storage.set(todos);
   * ```
   */
  set: (todos: TodoList, key: string = TODO_STORAGE_KEY): void => {
    try {
      if (typeof window === "undefined") {
        return;
      }

      const data: TodoStorageData = {
        version: STORAGE_VERSION,
        data: todos,
        lastModified: new Date().toISOString(),
      };

      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      if (error instanceof DOMException && error.name === "QuotaExceededError") {
        throw new StorageError("Storage quota exceeded", error);
      }
      throw new StorageError("Failed to save todos to storage", error);
    }
  },

  /**
   * Clears todo list from localStorage
   *
   * @param key - Storage key to clear (defaults to TODO_STORAGE_KEY)
   * @throws {StorageError} When storage clear operation fails
   * @example
   * ```typescript
   * storage.clear(); // Clears all todos
   * storage.clear('custom-key'); // Clears specific key
   * ```
   */
  clear: (key: string = TODO_STORAGE_KEY): void => {
    try {
      if (typeof window === "undefined") {
        return;
      }

      localStorage.removeItem(key);
    } catch (error) {
      throw new StorageError("Failed to clear storage", error);
    }
  },

  /**
   * Checks if localStorage is available in the current environment
   *
   * @returns True if localStorage is available and functional, false otherwise
   * @example
   * ```typescript
   * if (storage.isAvailable()) {
   *   storage.set(todos);
   * } else {
   *   console.warn('Storage not available, using memory only');
   * }
   * ```
   */
  isAvailable: (): boolean => {
    try {
      if (typeof window === "undefined") {
        return false;
      }

      const testKey = "__localStorage_test__";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  },
};