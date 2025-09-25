/**
 * GitHub Issue: #7
 * Title: Main App Integration & MVP Testing
 * Spec: https://github.com/iaminawe/todo-app-test/issues/7
 */

import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { TodoApp } from "@/components/TodoApp";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock window.confirm
const mockConfirm = jest.fn();
window.confirm = mockConfirm;

describe("Todo App Integration Tests", () => {
  beforeEach(() => {
    localStorageMock.clear();
    mockConfirm.mockReturnValue(true);
    jest.clearAllMocks();
  });

  describe("Complete Todo Workflow", () => {
    it("should handle full CRUD operations", async () => {
      const user = userEvent.setup();
      render(<TodoApp />);

      // Initial state - empty
      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
      expect(screen.getByText(/add your first todo/i)).toBeInTheDocument();

      // Add first todo
      const input = screen.getByPlaceholderText(/what needs to be done/i);
      const addButton = screen.getByRole("button", { name: /add/i });

      await user.type(input, "Buy groceries");
      await user.click(addButton);

      // Verify todo appears
      expect(screen.getByText("Buy groceries")).toBeInTheDocument();
      expect(screen.getByText(/1 active, 0 completed, 1 total/i)).toBeInTheDocument();

      // Add second todo
      await user.type(input, "Write tests");
      await user.click(addButton);

      expect(screen.getByText("Write tests")).toBeInTheDocument();
      expect(screen.getByText(/2 active, 0 completed, 2 total/i)).toBeInTheDocument();

      // Toggle first todo as completed
      const todoItems = screen.getAllByRole("button", { name: /mark.*as complete/i });
      await user.click(todoItems[0]);

      expect(screen.getByText(/1 active, 1 completed, 2 total/i)).toBeInTheDocument();

      // Delete second todo
      const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
      await user.click(deleteButtons[1]);

      expect(mockConfirm).toHaveBeenCalledWith(
        expect.stringContaining("Write tests")
      );
      expect(screen.queryByText("Write tests")).not.toBeInTheDocument();
      expect(screen.getByText(/0 active, 1 completed, 1 total/i)).toBeInTheDocument();
    });

    it("should handle form validation", async () => {
      const user = userEvent.setup();
      render(<TodoApp />);

      const input = screen.getByPlaceholderText(/what needs to be done/i);
      const addButton = screen.getByRole("button", { name: /add/i });

      // Try to add empty todo
      await user.click(addButton);
      expect(screen.getByText(/cannot be empty/i)).toBeInTheDocument();

      // Try to add whitespace-only todo
      await user.clear(input);
      await user.type(input, "   ");
      await user.click(addButton);
      expect(screen.getByText(/cannot be empty/i)).toBeInTheDocument();

      // Add valid todo
      await user.clear(input);
      await user.type(input, "Valid todo");
      await user.click(addButton);

      expect(screen.queryByText(/cannot be empty/i)).not.toBeInTheDocument();
      expect(screen.getByText("Valid todo")).toBeInTheDocument();
    });
  });

  describe("Filtering", () => {
    it("should filter todos by status", async () => {
      const user = userEvent.setup();
      render(<TodoApp />);

      const input = screen.getByPlaceholderText(/what needs to be done/i);

      // Add todos
      await user.type(input, "Active todo 1");
      await user.keyboard("{Enter}");
      await user.type(input, "Active todo 2");
      await user.keyboard("{Enter}");
      await user.type(input, "Completed todo");
      await user.keyboard("{Enter}");

      // Mark one as completed
      const todoItems = screen.getAllByRole("button", { name: /mark.*as complete/i });
      await user.click(todoItems[2]);

      // Test "All" tab (default)
      expect(screen.getByText("Active todo 1")).toBeInTheDocument();
      expect(screen.getByText("Active todo 2")).toBeInTheDocument();
      expect(screen.getByText("Completed todo")).toBeInTheDocument();

      // Test "Active" tab
      const activeTab = screen.getByRole("tab", { name: /active/i });
      await user.click(activeTab);

      expect(screen.getByText("Active todo 1")).toBeInTheDocument();
      expect(screen.getByText("Active todo 2")).toBeInTheDocument();
      expect(screen.queryByText("Completed todo")).not.toBeInTheDocument();

      // Test "Completed" tab
      const completedTab = screen.getByRole("tab", { name: /completed/i });
      await user.click(completedTab);

      expect(screen.queryByText("Active todo 1")).not.toBeInTheDocument();
      expect(screen.queryByText("Active todo 2")).not.toBeInTheDocument();
      expect(screen.getByText("Completed todo")).toBeInTheDocument();
    });
  });

  describe("Bulk Operations", () => {
    it("should clear completed todos", async () => {
      const user = userEvent.setup();
      render(<TodoApp />);

      const input = screen.getByPlaceholderText(/what needs to be done/i);

      // Add multiple todos
      await user.type(input, "Todo 1");
      await user.keyboard("{Enter}");
      await user.type(input, "Todo 2");
      await user.keyboard("{Enter}");
      await user.type(input, "Todo 3");
      await user.keyboard("{Enter}");

      // Mark two as completed
      const todoItems = screen.getAllByRole("button", { name: /mark.*as complete/i });
      await user.click(todoItems[0]);
      await user.click(todoItems[1]);

      // Clear completed
      const clearButton = screen.getByRole("button", { name: /clear completed/i });
      await user.click(clearButton);

      expect(mockConfirm).toHaveBeenCalledWith(
        expect.stringContaining("2 completed todos")
      );

      // Only Todo 3 should remain
      expect(screen.queryByText("Todo 1")).not.toBeInTheDocument();
      expect(screen.queryByText("Todo 2")).not.toBeInTheDocument();
      expect(screen.getByText("Todo 3")).toBeInTheDocument();
    });
  });

  describe("localStorage Persistence", () => {
    it("should persist todos to localStorage", async () => {
      const user = userEvent.setup();
      const { unmount } = render(<TodoApp />);

      const input = screen.getByPlaceholderText(/what needs to be done/i);

      // Add todos
      await user.type(input, "Persistent todo");
      await user.keyboard("{Enter}");

      // Wait for debounced save
      await waitFor(
        () => {
          const stored = localStorageMock.getItem("todo-app-data");
          expect(stored).toBeTruthy();
          if (stored) {
            const parsed = JSON.parse(stored);
            expect(parsed.data).toHaveLength(1);
            expect(parsed.data[0].text).toBe("Persistent todo");
          }
        },
        { timeout: 1000 }
      );

      // Unmount and remount
      unmount();
      render(<TodoApp />);

      // Todo should still be there
      await waitFor(() => {
        expect(screen.getByText("Persistent todo")).toBeInTheDocument();
      });
    });
  });

  describe("Statistics", () => {
    it("should display correct statistics", async () => {
      const user = userEvent.setup();
      render(<TodoApp />);

      const input = screen.getByPlaceholderText(/what needs to be done/i);

      // Add multiple todos
      for (let i = 1; i <= 5; i++) {
        await user.type(input, `Todo ${i}`);
        await user.keyboard("{Enter}");
      }

      // Mark some as completed
      const todoItems = screen.getAllByRole("button", { name: /mark.*as complete/i });
      await user.click(todoItems[0]);
      await user.click(todoItems[2]);

      // Check stats display
      expect(screen.getByText(/3 active, 2 completed, 5 total/i)).toBeInTheDocument();

      // Check stats cards
      const statsCards = screen.getAllByText(/^\d+$/);
      expect(statsCards[0]).toHaveTextContent("5"); // Total
      expect(statsCards[1]).toHaveTextContent("3"); // Active
      expect(statsCards[2]).toHaveTextContent("2"); // Completed
    });
  });

  describe("Responsive Design", () => {
    it("should render properly on different screen sizes", () => {
      render(<TodoApp />);

      // Check for responsive container
      const container = screen.getByText(/todo app/i).closest(".container");
      expect(container).toHaveClass("mx-auto", "max-w-4xl");

      // Check for responsive grid
      const input = screen.getByPlaceholderText(/what needs to be done/i);
      expect(input).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels", async () => {
      const user = userEvent.setup();
      render(<TodoApp />);

      const input = screen.getByPlaceholderText(/what needs to be done/i);

      // Add a todo
      await user.type(input, "Test todo");
      await user.keyboard("{Enter}");

      // Check ARIA labels
      const completeButton = screen.getByRole("button", {
        name: /mark "test todo" as complete/i,
      });
      expect(completeButton).toBeInTheDocument();

      const deleteButton = screen.getByRole("button", {
        name: /delete "test todo"/i,
      });
      expect(deleteButton).toBeInTheDocument();
    });

    it("should be keyboard navigable", async () => {
      const user = userEvent.setup();
      render(<TodoApp />);

      const input = screen.getByPlaceholderText(/what needs to be done/i);

      // Add todo with keyboard
      await user.type(input, "Keyboard todo");
      await user.keyboard("{Enter}");

      // Tab through interactive elements
      await user.tab();
      expect(document.activeElement).toHaveAttribute("placeholder", expect.stringContaining("needs to be done"));

      await user.tab();
      expect(document.activeElement).toHaveAttribute("aria-label", expect.stringContaining("mark"));
    });
  });

  describe("Error Handling", () => {
    it("should handle localStorage errors gracefully", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      const mockSetItem = jest.spyOn(Storage.prototype, "setItem");
      mockSetItem.mockImplementation(() => {
        throw new Error("Storage failed");
      });

      const user = userEvent.setup();
      render(<TodoApp />);

      const input = screen.getByPlaceholderText(/what needs to be done/i);

      // Try to add todo despite storage error
      await user.type(input, "Test todo");
      await user.keyboard("{Enter}");

      // Todo should still appear (optimistic update)
      expect(screen.getByText("Test todo")).toBeInTheDocument();

      mockSetItem.mockRestore();
      consoleSpy.mockRestore();
    });
  });

  describe("Performance", () => {
    it("should handle large number of todos", async () => {
      const user = userEvent.setup();
      render(<TodoApp />);

      const input = screen.getByPlaceholderText(/what needs to be done/i);

      // Add many todos
      for (let i = 1; i <= 50; i++) {
        await user.type(input, `Todo ${i}`);
        await user.keyboard("{Enter}");
      }

      // Should have scrollable container
      const todoContainer = screen.getByText("Todo 1").closest(".space-y-2");
      expect(todoContainer).toHaveClass("overflow-y-auto");

      // All todos should be rendered
      expect(screen.getByText("Todo 1")).toBeInTheDocument();
      expect(screen.getByText("Todo 50")).toBeInTheDocument();
    });
  });
});