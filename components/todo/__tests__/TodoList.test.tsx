/**
 * GitHub Issue: #3
 * Title: TodoList Component with Tests (TDD)
 * Spec: https://github.com/iaminawe/todo-app-test/issues/3
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { TodoList } from "../TodoList";
import { Todo } from "@/types";

describe("TodoList Component", () => {
  const mockTodos: Todo[] = [
    {
      id: "1",
      text: "Buy groceries",
      completed: false,
      createdAt: new Date("2024-01-15T10:00:00"),
      updatedAt: new Date("2024-01-15T10:00:00"),
    },
    {
      id: "2",
      text: "Write tests",
      completed: true,
      createdAt: new Date("2024-01-15T11:00:00"),
      updatedAt: new Date("2024-01-15T11:00:00"),
    },
    {
      id: "3",
      text: "Review PRs",
      completed: false,
      createdAt: new Date("2024-01-15T12:00:00"),
      updatedAt: new Date("2024-01-15T12:00:00"),
    },
  ];

  const defaultProps = {
    todos: [],
    onToggle: jest.fn(),
    onDelete: jest.fn(),
    onAdd: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      render(<TodoList {...defaultProps} />);
      expect(screen.getByRole("region", { name: /todo list/i })).toBeInTheDocument();
    });

    it("should render empty state when no todos", () => {
      render(<TodoList {...defaultProps} />);
      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
      expect(screen.getByText(/add your first todo/i)).toBeInTheDocument();
    });

    it("should render list of todos", () => {
      render(<TodoList {...defaultProps} todos={mockTodos} />);

      expect(screen.getByText("Buy groceries")).toBeInTheDocument();
      expect(screen.getByText("Write tests")).toBeInTheDocument();
      expect(screen.getByText("Review PRs")).toBeInTheDocument();
    });

    it("should use Card component for container", () => {
      const { container } = render(<TodoList {...defaultProps} todos={mockTodos} />);
      const card = container.querySelector('[class*="rounded-lg"][class*="border"]');
      expect(card).toBeInTheDocument();
    });

    it("should show todo count", () => {
      render(<TodoList {...defaultProps} todos={mockTodos} />);
      expect(screen.getByText(/3 todos/i)).toBeInTheDocument();
      expect(screen.getByText(/1 completed/i)).toBeInTheDocument();
    });
  });

  describe("Todo Operations", () => {
    it("should call onAdd when adding a new todo", async () => {
      const user = userEvent.setup();
      const onAdd = jest.fn();
      render(<TodoList {...defaultProps} onAdd={onAdd} />);

      const input = screen.getByPlaceholderText(/add a new todo/i);
      const addButton = screen.getByRole("button", { name: /add/i });

      await user.type(input, "New todo item");
      await user.click(addButton);

      expect(onAdd).toHaveBeenCalledWith("New todo item");
    });

    it("should call onToggle when toggling todo completion", async () => {
      const user = userEvent.setup();
      const onToggle = jest.fn();
      render(<TodoList {...defaultProps} todos={mockTodos} onToggle={onToggle} />);

      const checkboxes = screen.getAllByRole("checkbox");
      await user.click(checkboxes[0]);

      expect(onToggle).toHaveBeenCalledWith("1");
    });

    it("should call onDelete when deleting a todo", async () => {
      const user = userEvent.setup();
      const onDelete = jest.fn();
      render(<TodoList {...defaultProps} todos={mockTodos} onDelete={onDelete} />);

      const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
      await user.click(deleteButtons[0]);

      expect(onDelete).toHaveBeenCalledWith("1");
    });
  });

  describe("Loading State", () => {
    it("should show loading state when loading prop is true", () => {
      render(<TodoList {...defaultProps} loading />);
      expect(screen.getByText(/loading todos/i)).toBeInTheDocument();
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("should not show todos when loading", () => {
      render(<TodoList {...defaultProps} todos={mockTodos} loading />);
      expect(screen.queryByText("Buy groceries")).not.toBeInTheDocument();
    });
  });

  describe("Error State", () => {
    it("should show error state when error prop is provided", () => {
      const errorMessage = "Failed to load todos";
      render(<TodoList {...defaultProps} error={errorMessage} />);

      expect(screen.getByText(/error/i)).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it("should show retry button on error", async () => {
      const user = userEvent.setup();
      const onRetry = jest.fn();
      render(
        <TodoList
          {...defaultProps}
          error="Failed to load"
          onRetry={onRetry}
        />
      );

      const retryButton = screen.getByRole("button", { name: /retry/i });
      await user.click(retryButton);

      expect(onRetry).toHaveBeenCalled();
    });
  });

  describe("Responsive Design", () => {
    it("should have responsive classes", () => {
      const { container } = render(<TodoList {...defaultProps} todos={mockTodos} />);
      const listContainer = container.querySelector('[class*="max-w-"]');
      expect(listContainer).toBeInTheDocument();
    });

    it("should be scrollable with many todos", () => {
      const manyTodos = Array.from({ length: 50 }, (_, i) => ({
        id: `${i}`,
        text: `Todo ${i}`,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const { container } = render(<TodoList {...defaultProps} todos={manyTodos} />);
      const scrollArea = container.querySelector('[class*="overflow-"]');
      expect(scrollArea).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels", () => {
      render(<TodoList {...defaultProps} todos={mockTodos} />);

      expect(screen.getByRole("region", { name: /todo list/i })).toBeInTheDocument();
      expect(screen.getByRole("list")).toBeInTheDocument();
      expect(screen.getAllByRole("listitem")).toHaveLength(3);
    });

    it("should have keyboard navigation support", async () => {
      const user = userEvent.setup();
      render(<TodoList {...defaultProps} todos={mockTodos} />);

      const firstCheckbox = screen.getAllByRole("checkbox")[0];
      firstCheckbox.focus();

      await user.keyboard("{Tab}");
      expect(screen.getAllByRole("button", { name: /delete/i })[0]).toHaveFocus();
    });

    it("should announce changes to screen readers", async () => {
      const { rerender } = render(<TodoList {...defaultProps} todos={mockTodos} />);

      const updatedTodos = [...mockTodos];
      updatedTodos[0].completed = true;

      rerender(<TodoList {...defaultProps} todos={updatedTodos} />);

      // Check for aria-live region
      expect(screen.getByRole("status")).toBeInTheDocument();
    });
  });

  describe("Filtering", () => {
    it("should filter todos by completion status", async () => {
      const user = userEvent.setup();
      render(<TodoList {...defaultProps} todos={mockTodos} showFilters />);

      const filterButtons = screen.getAllByRole("button", { name: /active|completed|all/i });

      // Click "Active" filter
      await user.click(filterButtons.find(btn => btn.textContent?.match(/active/i))!);
      expect(screen.getByText("Buy groceries")).toBeInTheDocument();
      expect(screen.queryByText("Write tests")).not.toBeInTheDocument();

      // Click "Completed" filter
      await user.click(filterButtons.find(btn => btn.textContent?.match(/completed/i))!);
      expect(screen.queryByText("Buy groceries")).not.toBeInTheDocument();
      expect(screen.getByText("Write tests")).toBeInTheDocument();
    });
  });

  describe("TypeScript Support", () => {
    it("should be properly typed", () => {
      // This test ensures TypeScript compilation works
      const typedProps = {
        todos: mockTodos,
        onToggle: (id: string) => console.log(id),
        onDelete: (id: string) => console.log(id),
        onAdd: (text: string) => console.log(text),
        loading: false,
        error: undefined,
        onRetry: undefined,
        showFilters: true,
      };

      render(<TodoList {...typedProps} />);
      expect(screen.getByRole("region", { name: /todo list/i })).toBeInTheDocument();
    });
  });
});