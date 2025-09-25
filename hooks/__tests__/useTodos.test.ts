/**
 * GitHub Issue: #6
 * Title: Todo State Management & localStorage Integration
 * Spec: https://github.com/iaminawe/todo-app-test/issues/6
 */

import { renderHook, act, waitFor } from "@testing-library/react";
import { useTodos } from "../useTodos";
import { storage } from "@/utils/storage";
import { Todo, TodoList } from "@/types";

// Mock the storage utility
jest.mock("@/utils/storage", () => ({
  storage: {
    get: jest.fn(),
    set: jest.fn(),
    clear: jest.fn(),
    isAvailable: jest.fn(() => true),
  },
  StorageError: class StorageError extends Error {},
}));

// Mock window.confirm
const mockConfirm = jest.fn();
global.confirm = mockConfirm;

// Mock UUID generation for predictable IDs
jest.mock("@/utils/uuid", () => ({
  generateUUID: jest.fn(() => `mock-uuid-${Date.now()}`),
}));

describe("useTodos Hook", () => {
  const mockTodos: TodoList = [
    {
      id: "1",
      text: "Test todo 1",
      completed: false,
      createdAt: new Date("2024-01-15T10:00:00"),
      updatedAt: new Date("2024-01-15T10:00:00"),
    },
    {
      id: "2",
      text: "Test todo 2",
      completed: true,
      createdAt: new Date("2024-01-15T11:00:00"),
      updatedAt: new Date("2024-01-15T11:00:00"),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockConfirm.mockReturnValue(true);
    (storage.isAvailable as jest.Mock).mockReturnValue(true);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("Initialization", () => {
    it("should initialize with empty todos", async () => {
      (storage.get as jest.Mock).mockReturnValue(null);

      const { result } = renderHook(() => useTodos());

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.todos).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it("should load todos from localStorage", async () => {
      (storage.get as jest.Mock).mockReturnValue(mockTodos);

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.todos).toEqual(mockTodos);
      expect(storage.get).toHaveBeenCalled();
    });

    it("should use initial todos if provided", async () => {
      const { result } = renderHook(() =>
        useTodos({ initialTodos: mockTodos, autoSave: false })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.todos).toEqual(mockTodos);
    });

    it("should handle storage errors gracefully", async () => {
      const errorMessage = "Storage failed";
      (storage.get as jest.Mock).mockImplementation(() => {
        throw new Error(errorMessage);
      });

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toContain(errorMessage);
      expect(result.current.todos).toEqual([]);
    });

    it("should handle unavailable localStorage", async () => {
      (storage.isAvailable as jest.Mock).mockReturnValue(false);

      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(consoleSpy).toHaveBeenCalledWith("localStorage is not available");
      expect(result.current.todos).toEqual([]);

      consoleSpy.mockRestore();
    });
  });

  describe("addTodo", () => {
    it("should add a new todo", async () => {
      (storage.get as jest.Mock).mockReturnValue([]);

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.addTodo("New todo");
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].text).toBe("New todo");
      expect(result.current.todos[0].completed).toBe(false);
      expect(result.current.todos[0].id).toContain("mock-uuid");
    });

    it("should add todo to beginning of list", async () => {
      (storage.get as jest.Mock).mockReturnValue(mockTodos);

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.addTodo("Newest todo");
      });

      expect(result.current.todos[0].text).toBe("Newest todo");
      expect(result.current.todos).toHaveLength(3);
    });

    it("should sanitize todo text", async () => {
      (storage.get as jest.Mock).mockReturnValue([]);

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.addTodo("  Trimmed  todo  ");
      });

      expect(result.current.todos[0].text).toBe("Trimmed todo");
    });

    it("should throw error for invalid text", async () => {
      (storage.get as jest.Mock).mockReturnValue([]);

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.addTodo("");
        })
      ).rejects.toThrow("Invalid todo text");
    });
  });

  describe("toggleTodo", () => {
    it("should toggle todo completion status", async () => {
      (storage.get as jest.Mock).mockReturnValue(mockTodos);

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.toggleTodo("1");
      });

      expect(result.current.todos[0].completed).toBe(true);

      act(() => {
        result.current.toggleTodo("1");
      });

      expect(result.current.todos[0].completed).toBe(false);
    });

    it("should update updatedAt when toggling", async () => {
      (storage.get as jest.Mock).mockReturnValue(mockTodos);

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const originalUpdatedAt = result.current.todos[0].updatedAt;

      act(() => {
        result.current.toggleTodo("1");
      });

      expect(result.current.todos[0].updatedAt).not.toEqual(originalUpdatedAt);
    });
  });

  describe("deleteTodo", () => {
    it("should delete a todo with confirmation", async () => {
      (storage.get as jest.Mock).mockReturnValue(mockTodos);
      mockConfirm.mockReturnValue(true);

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.deleteTodo("1");
      });

      expect(mockConfirm).toHaveBeenCalledWith(
        expect.stringContaining("Test todo 1")
      );
      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].id).toBe("2");
    });

    it("should not delete if confirmation is cancelled", async () => {
      (storage.get as jest.Mock).mockReturnValue(mockTodos);
      mockConfirm.mockReturnValue(false);

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.deleteTodo("1");
      });

      expect(result.current.todos).toHaveLength(2);
    });

    it("should skip confirmation when specified", async () => {
      (storage.get as jest.Mock).mockReturnValue(mockTodos);

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.deleteTodo("1", true);
      });

      expect(mockConfirm).not.toHaveBeenCalled();
      expect(result.current.todos).toHaveLength(1);
    });

    it("should delete without confirmation when disabled", async () => {
      (storage.get as jest.Mock).mockReturnValue(mockTodos);

      const { result } = renderHook(() =>
        useTodos({ confirmDelete: false })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.deleteTodo("1");
      });

      expect(mockConfirm).not.toHaveBeenCalled();
      expect(result.current.todos).toHaveLength(1);
    });
  });

  describe("updateTodo", () => {
    it("should update todo text", async () => {
      (storage.get as jest.Mock).mockReturnValue(mockTodos);

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.updateTodo("1", "Updated text");
      });

      expect(result.current.todos[0].text).toBe("Updated text");
    });

    it("should update updatedAt timestamp", async () => {
      (storage.get as jest.Mock).mockReturnValue(mockTodos);

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const originalUpdatedAt = result.current.todos[0].updatedAt;

      act(() => {
        result.current.updateTodo("1", "Updated text");
      });

      expect(result.current.todos[0].updatedAt).not.toEqual(originalUpdatedAt);
    });

    it("should sanitize updated text", async () => {
      (storage.get as jest.Mock).mockReturnValue(mockTodos);

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.updateTodo("1", "  Updated  ");
      });

      expect(result.current.todos[0].text).toBe("Updated");
    });
  });

  describe("clearCompleted", () => {
    it("should remove completed todos", async () => {
      (storage.get as jest.Mock).mockReturnValue(mockTodos);
      mockConfirm.mockReturnValue(true);

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.clearCompleted();
      });

      expect(mockConfirm).toHaveBeenCalledWith(
        expect.stringContaining("1 completed todo")
      );
      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].completed).toBe(false);
    });

    it("should not clear if cancelled", async () => {
      (storage.get as jest.Mock).mockReturnValue(mockTodos);
      mockConfirm.mockReturnValue(false);

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.clearCompleted();
      });

      expect(result.current.todos).toHaveLength(2);
    });
  });

  describe("clearAll", () => {
    it("should remove all todos", async () => {
      (storage.get as jest.Mock).mockReturnValue(mockTodos);
      mockConfirm.mockReturnValue(true);

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.clearAll();
      });

      expect(mockConfirm).toHaveBeenCalledWith(
        expect.stringContaining("2 todos")
      );
      expect(result.current.todos).toHaveLength(0);
    });
  });

  describe("localStorage persistence", () => {
    it("should save todos to localStorage with debouncing", async () => {
      (storage.get as jest.Mock).mockReturnValue([]);

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.addTodo("New todo");
      });

      // Storage.set should not be called immediately
      expect(storage.set).not.toHaveBeenCalled();

      // Fast-forward debounce timer
      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(storage.set).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ text: "New todo" }),
        ]),
        undefined
      );
    });

    it("should use custom storage key", async () => {
      const customKey = "custom-todos";
      (storage.get as jest.Mock).mockReturnValue([]);

      const { result } = renderHook(() =>
        useTodos({ storageKey: customKey })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(storage.get).toHaveBeenCalledWith(customKey);

      await act(async () => {
        await result.current.addTodo("New todo");
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(storage.set).toHaveBeenCalledWith(
        expect.any(Array),
        customKey
      );
    });

    it("should not save when autoSave is disabled", async () => {
      (storage.get as jest.Mock).mockReturnValue([]);

      const { result } = renderHook(() =>
        useTodos({ autoSave: false })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.addTodo("New todo");
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(storage.set).not.toHaveBeenCalled();
    });
  });

  describe("retry", () => {
    it("should reload todos from storage", async () => {
      const updatedTodos = [...mockTodos, {
        id: "3",
        text: "New todo from storage",
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }];

      (storage.get as jest.Mock)
        .mockReturnValueOnce(mockTodos)
        .mockReturnValueOnce(updatedTodos);

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.todos).toHaveLength(2);

      act(() => {
        result.current.retry();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.todos).toHaveLength(3);
    });
  });

  describe("stats", () => {
    it("should calculate statistics correctly", async () => {
      (storage.get as jest.Mock).mockReturnValue(mockTodos);

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.stats).toEqual({
        total: 2,
        completed: 1,
        active: 1,
      });
    });

    it("should update stats when todos change", async () => {
      (storage.get as jest.Mock).mockReturnValue(mockTodos);

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.toggleTodo("1");
      });

      expect(result.current.stats).toEqual({
        total: 2,
        completed: 2,
        active: 0,
      });
    });
  });

  describe("Error auto-clear", () => {
    it("should automatically clear errors after 5 seconds", async () => {
      const errorMessage = "Test error";
      (storage.get as jest.Mock).mockImplementation(() => {
        throw new Error(errorMessage);
      });

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toContain(errorMessage);

      // Fast-forward time by 5 seconds
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(result.current.error).toBeNull();
    });

    it("should clear existing error timeout when setting new error", async () => {
      (storage.get as jest.Mock).mockReturnValue([]);

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Trigger first error
      (storage.set as jest.Mock).mockImplementation(() => {
        throw new Error("First error");
      });

      await act(async () => {
        await result.current.addTodo("Test todo");
      });

      // Fast-forward to trigger debounced save
      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current.error).toContain("First error");

      // Trigger second error before first timeout expires
      (storage.set as jest.Mock).mockImplementation(() => {
        throw new Error("Second error");
      });

      await act(async () => {
        await result.current.addTodo("Another todo");
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current.error).toContain("Second error");

      // Fast-forward 5 seconds to clear error
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(result.current.error).toBeNull();
    });
  });
});