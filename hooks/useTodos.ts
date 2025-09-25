/**
 * GitHub Issue: #6
 * Title: Todo State Management & localStorage Integration
 * Spec: https://github.com/iaminawe/todo-app-test/issues/6
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Todo, TodoList } from "@/types";
import { storage, StorageError } from "@/utils/storage";
import { generateUUID } from "@/utils/uuid";
import { sanitizeTodoText } from "@/utils/validation";

export interface UseTodosReturn {
  todos: TodoList;
  loading: boolean;
  error: string | null;
  addTodo: (text: string) => Promise<void>;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string, skipConfirmation?: boolean) => void;
  updateTodo: (id: string, text: string) => void;
  clearCompleted: () => void;
  clearAll: () => void;
  retry: () => void;
  stats: {
    total: number;
    completed: number;
    active: number;
  };
}

export interface UseTodosOptions {
  initialTodos?: TodoList;
  confirmDelete?: boolean;
  autoSave?: boolean;
  storageKey?: string;
}

export function useTodos({
  initialTodos = [],
  confirmDelete = true,
  autoSave = true,
  storageKey,
}: UseTodosOptions = {}): UseTodosReturn {
  const [todos, setTodos] = useState<TodoList>(initialTodos);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const errorTimeoutRef = useRef<NodeJS.Timeout>();

  // Helper function to set error with auto-clear after 5 seconds
  const setErrorWithTimeout = useCallback((errorMessage: string | null) => {
    // Clear existing error timeout
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = undefined;
    }

    setError(errorMessage);

    // Auto-clear error after 5 seconds if it's not null
    if (errorMessage) {
      errorTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          setError(null);
        }
      }, 5000);
    }
  }, []);

  // Load todos from localStorage on mount
  useEffect(() => {
    if (!autoSave) {
      setLoading(false);
      return;
    }

    const loadTodos = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!storage.isAvailable()) {
          console.warn("localStorage is not available");
          setLoading(false);
          return;
        }

        const storedTodos = storage.get(storageKey);
        if (storedTodos && isMountedRef.current) {
          setTodos(storedTodos);
        }
      } catch (err) {
        console.error("Failed to load todos:", err);
        if (isMountedRef.current) {
          setErrorWithTimeout(err instanceof StorageError ? err.message : "Failed to load todos");
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    loadTodos();

    return () => {
      isMountedRef.current = false;

      // Clear all timeouts to prevent memory leaks
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = undefined;
      }

      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
        errorTimeoutRef.current = undefined;
      }
    };
  }, [autoSave, storageKey, setErrorWithTimeout]);

  // Save todos to localStorage with debouncing
  const saveTodos = useCallback(
    (todosToSave: TodoList, immediate = false) => {
      if (!autoSave || !storage.isAvailable()) {
        return;
      }

      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = undefined;
      }

      const performSave = () => {
        try {
          storage.set(todosToSave, storageKey);
          if (isMountedRef.current) {
            setError(null);
          }
        } catch (err) {
          console.error("Failed to save todos:", err);
          if (isMountedRef.current) {
            setErrorWithTimeout(err instanceof StorageError ? err.message : "Failed to save todos");
          }
        }
      };

      if (immediate) {
        // Immediate save for critical operations like unmount
        performSave();
      } else {
        // Debounce saves to avoid excessive writes
        saveTimeoutRef.current = setTimeout(performSave, 500);
      }
    },
    [autoSave, storageKey, setErrorWithTimeout]
  );

  // Save todos whenever they change
  useEffect(() => {
    if (todos.length > 0 || (todos.length === 0 && !loading)) {
      saveTodos(todos);
    }
  }, [todos, saveTodos, loading]);

  // Force save on unmount to prevent data loss
  useEffect(() => {
    return () => {
      // Force immediate save of current todos state on unmount
      if (autoSave && storage.isAvailable()) {
        try {
          storage.set(todos, storageKey);
        } catch (err) {
          console.error("Failed to save todos on unmount:", err);
        }
      }
    };
  }, [todos, autoSave, storageKey]);

  const addTodo = useCallback(async (text: string): Promise<void> => {
    const sanitized = sanitizeTodoText(text);
    if (!sanitized) {
      throw new Error("Invalid todo text");
    }

    const now = new Date();
    const newTodo: Todo = {
      id: generateUUID(),
      text: sanitized,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    // Optimistic update
    setTodos((prev) => [newTodo, ...prev]);
    setError(null);
  }, []);

  const toggleTodo = useCallback((id: string): void => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
          : todo
      )
    );
    setError(null);
  }, []);

  const deleteTodo = useCallback(
    (id: string, skipConfirmation = false): void => {
      if (confirmDelete && !skipConfirmation) {
        // Use setState callback to access current todos without dependency
        setTodos((currentTodos) => {
          const todo = currentTodos.find((t) => t.id === id);
          if (!todo) return currentTodos;

          const confirmed = window.confirm(
            `Are you sure you want to delete "${todo.text}"?`
          );

          if (!confirmed) return currentTodos;

          // Filter out the todo if confirmed
          return currentTodos.filter((todo) => todo.id !== id);
        });
      } else {
        // Skip confirmation - directly filter
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
      }

      setError(null);
    },
    [confirmDelete]
  );

  const updateTodo = useCallback((id: string, text: string): void => {
    const sanitized = sanitizeTodoText(text);
    if (!sanitized) {
      throw new Error("Invalid todo text");
    }

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, text: sanitized, updatedAt: new Date() }
          : todo
      )
    );
    setError(null);
  }, []);

  const clearCompleted = useCallback((): void => {
    if (confirmDelete) {
      // Use setState callback to access current todos without dependency
      setTodos((currentTodos) => {
        const completedCount = currentTodos.filter((t) => t.completed).length;
        if (completedCount === 0) return currentTodos;

        const confirmed = window.confirm(
          `Are you sure you want to delete ${completedCount} completed ${
            completedCount === 1 ? "todo" : "todos"
          }?`
        );

        if (!confirmed) return currentTodos;

        return currentTodos.filter((todo) => !todo.completed);
      });
    } else {
      setTodos((prev) => prev.filter((todo) => !todo.completed));
    }

    setError(null);
  }, [confirmDelete]);

  const clearAll = useCallback((): void => {
    if (confirmDelete) {
      // Use setState callback to access current todos without dependency
      setTodos((currentTodos) => {
        if (currentTodos.length === 0) return currentTodos;

        const confirmed = window.confirm(
          `Are you sure you want to delete all ${currentTodos.length} ${
            currentTodos.length === 1 ? "todo" : "todos"
          }?`
        );

        if (!confirmed) return currentTodos;

        return [];
      });
    } else {
      setTodos([]);
    }

    setError(null);
  }, [confirmDelete]);

  const retry = useCallback((): void => {
    setError(null);
    setLoading(true);

    // Reload from storage
    if (autoSave && storage.isAvailable()) {
      try {
        const storedTodos = storage.get(storageKey);
        if (storedTodos) {
          setTodos(storedTodos);
        }
      } catch (err) {
        console.error("Failed to reload todos:", err);
        setErrorWithTimeout(err instanceof StorageError ? err.message : "Failed to reload todos");
      }
    }

    setLoading(false);
  }, [autoSave, storageKey, setErrorWithTimeout]);

  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    active: todos.filter((t) => !t.completed).length,
  };

  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
    clearAll,
    retry,
    stats,
  };
}