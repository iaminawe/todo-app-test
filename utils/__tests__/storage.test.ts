/**
 * GitHub Issue: #2
 * Title: Core Todo Data Types & Utilities
 * Spec: https://github.com/iaminawe/todo-app-test/issues/2
 */

import { storage, StorageError } from "../storage";
import { TodoList, TodoStorageData, TODO_STORAGE_KEY, STORAGE_VERSION } from "@/types";

describe("Storage Utilities", () => {
  const mockTodos: TodoList = [
    {
      id: "550e8400-e29b-41d4-a716-446655440000",
      text: "Test todo 1",
      completed: false,
      createdAt: new Date("2024-01-15T10:00:00"),
      updatedAt: new Date("2024-01-15T10:00:00"),
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      text: "Test todo 2",
      completed: true,
      createdAt: new Date("2024-01-15T11:00:00"),
      updatedAt: new Date("2024-01-15T12:00:00"),
    },
  ];

  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe("storage.get", () => {
    it("should return null when no data exists", () => {
      expect(storage.get()).toBeNull();
    });

    it("should retrieve stored todos", () => {
      const storageData: TodoStorageData = {
        version: STORAGE_VERSION,
        data: mockTodos,
        lastModified: new Date().toISOString(),
      };
      localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(storageData));

      const result = storage.get();
      expect(result).toHaveLength(2);
      expect(result?.[0].text).toBe("Test todo 1");
      expect(result?.[0].createdAt).toBeInstanceOf(Date);
      expect(result?.[1].text).toBe("Test todo 2");
      expect(result?.[1].updatedAt).toBeInstanceOf(Date);
    });

    it("should handle version mismatch with warning", () => {
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
      const storageData: TodoStorageData = {
        version: "0.9.0",
        data: mockTodos,
        lastModified: new Date().toISOString(),
      };
      localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(storageData));

      const result = storage.get();
      expect(result).toHaveLength(2);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("version mismatch")
      );

      consoleSpy.mockRestore();
    });

    it("should throw StorageError on invalid JSON", () => {
      localStorage.setItem(TODO_STORAGE_KEY, "invalid-json");
      expect(() => storage.get()).toThrow(StorageError);
    });

    it("should use custom key if provided", () => {
      const customKey = "custom-todo-key";
      const storageData: TodoStorageData = {
        version: STORAGE_VERSION,
        data: mockTodos,
        lastModified: new Date().toISOString(),
      };
      localStorage.setItem(customKey, JSON.stringify(storageData));

      const result = storage.get(customKey);
      expect(result).toHaveLength(2);
    });
  });

  describe("storage.set", () => {
    it("should store todos with metadata", () => {
      storage.set(mockTodos);

      const stored = localStorage.getItem(TODO_STORAGE_KEY);
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      expect(parsed.version).toBe(STORAGE_VERSION);
      expect(parsed.data).toHaveLength(2);
      expect(parsed.lastModified).toBeTruthy();
    });

    it("should use custom key if provided", () => {
      const customKey = "custom-todo-key";
      storage.set(mockTodos, customKey);

      const stored = localStorage.getItem(customKey);
      expect(stored).toBeTruthy();
    });

    it("should handle quota exceeded error", () => {
      const mockSetItem = jest.spyOn(Storage.prototype, "setItem");
      mockSetItem.mockImplementation(() => {
        const error = new DOMException("QuotaExceededError");
        (error as any).name = "QuotaExceededError";
        throw error;
      });

      expect(() => storage.set(mockTodos)).toThrow(StorageError);
      expect(() => storage.set(mockTodos)).toThrow("quota exceeded");

      mockSetItem.mockRestore();
    });
  });

  describe("storage.clear", () => {
    it("should remove stored data", () => {
      localStorage.setItem(TODO_STORAGE_KEY, "data");
      storage.clear();
      expect(localStorage.getItem(TODO_STORAGE_KEY)).toBeNull();
    });

    it("should use custom key if provided", () => {
      const customKey = "custom-todo-key";
      localStorage.setItem(customKey, "data");
      storage.clear(customKey);
      expect(localStorage.getItem(customKey)).toBeNull();
    });

    it("should handle errors", () => {
      const mockRemoveItem = jest.spyOn(Storage.prototype, "removeItem");
      mockRemoveItem.mockImplementation(() => {
        throw new Error("Remove failed");
      });

      expect(() => storage.clear()).toThrow(StorageError);

      mockRemoveItem.mockRestore();
    });
  });

  describe("storage.isAvailable", () => {
    it("should return true when localStorage is available", () => {
      expect(storage.isAvailable()).toBe(true);
    });

    it("should return false when localStorage throws", () => {
      const mockSetItem = jest.spyOn(Storage.prototype, "setItem");
      mockSetItem.mockImplementation(() => {
        throw new Error("Storage disabled");
      });

      expect(storage.isAvailable()).toBe(false);

      mockSetItem.mockRestore();
    });
  });

  describe("Server-side rendering", () => {
    let windowSpy: jest.SpyInstance;

    beforeEach(() => {
      windowSpy = jest.spyOn(global, "window", "get");
    });

    afterEach(() => {
      windowSpy.mockRestore();
    });

    it("should return null when window is undefined (SSR)", () => {
      windowSpy.mockImplementation(() => undefined);

      expect(storage.get()).toBeNull();
      expect(() => storage.set(mockTodos)).not.toThrow();
      expect(() => storage.clear()).not.toThrow();
      expect(storage.isAvailable()).toBe(false);
    });
  });
});