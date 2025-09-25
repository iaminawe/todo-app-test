/**
 * GitHub Issue: #4
 * Title: TodoItem Component with Tests (TDD)
 * Spec: https://github.com/iaminawe/todo-app-test/issues/4
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { TodoItem } from "../TodoItem";
import { Todo } from "@/types";

describe("TodoItem Component", () => {
  const mockTodo: Todo = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    text: "Test todo item",
    completed: false,
    createdAt: new Date("2024-01-15T10:00:00"),
    updatedAt: new Date("2024-01-15T10:00:00"),
  };

  const completedTodo: Todo = {
    ...mockTodo,
    id: "550e8400-e29b-41d4-a716-446655440001",
    text: "Completed todo",
    completed: true,
  };

  const defaultProps = {
    todo: mockTodo,
    onToggle: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      render(<TodoItem {...defaultProps} />);
      expect(screen.getByText("Test todo item")).toBeInTheDocument();
    });

    it("should display todo text", () => {
      render(<TodoItem {...defaultProps} />);
      expect(screen.getByText(mockTodo.text)).toBeInTheDocument();
    });

    it("should display checkbox with correct state", () => {
      render(<TodoItem {...defaultProps} />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
    });

    it("should display checked checkbox for completed todo", () => {
      render(<TodoItem {...defaultProps} todo={completedTodo} />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeChecked();
    });

    it("should display delete button", () => {
      render(<TodoItem {...defaultProps} />);
      expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
    });

    it("should use shadcn/ui Checkbox component", () => {
      const { container } = render(<TodoItem {...defaultProps} />);
      const checkbox = container.querySelector('[data-state]');
      expect(checkbox).toBeInTheDocument();
    });

    it("should use shadcn/ui Button component for delete", () => {
      const { container } = render(<TodoItem {...defaultProps} />);
      const button = container.querySelector('button[class*="inline-flex"]');
      expect(button).toBeInTheDocument();
    });
  });

  describe("Visual Feedback", () => {
    it("should apply strikethrough style to completed items", () => {
      render(<TodoItem {...defaultProps} todo={completedTodo} />);
      const textElement = screen.getByText("Completed todo");
      expect(textElement).toHaveClass("line-through");
    });

    it("should have muted text color for completed items", () => {
      render(<TodoItem {...defaultProps} todo={completedTodo} />);
      const textElement = screen.getByText("Completed todo");
      expect(textElement).toHaveClass("text-muted-foreground");
    });

    it("should not have strikethrough for incomplete items", () => {
      render(<TodoItem {...defaultProps} />);
      const textElement = screen.getByText("Test todo item");
      expect(textElement).not.toHaveClass("line-through");
    });

    it("should show hover state on todo item", () => {
      const { container } = render(<TodoItem {...defaultProps} />);
      const item = container.firstChild;
      expect(item).toHaveClass("transition-colors");
    });
  });

  describe("Toggle Completion", () => {
    it("should call onToggle when checkbox is clicked", async () => {
      const user = userEvent.setup();
      const onToggle = jest.fn();
      render(<TodoItem {...defaultProps} onToggle={onToggle} />);

      const checkbox = screen.getByRole("checkbox");
      await user.click(checkbox);

      expect(onToggle).toHaveBeenCalledTimes(1);
      expect(onToggle).toHaveBeenCalledWith(mockTodo.id);
    });

    it("should toggle from unchecked to checked", async () => {
      const user = userEvent.setup();
      const onToggle = jest.fn();
      render(<TodoItem {...defaultProps} onToggle={onToggle} />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(onToggle).toHaveBeenCalledWith(mockTodo.id);
    });

    it("should toggle from checked to unchecked", async () => {
      const user = userEvent.setup();
      const onToggle = jest.fn();
      render(<TodoItem {...defaultProps} todo={completedTodo} onToggle={onToggle} />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeChecked();

      await user.click(checkbox);
      expect(onToggle).toHaveBeenCalledWith(completedTodo.id);
    });
  });

  describe("Delete Action", () => {
    it("should call onDelete when delete button is clicked", async () => {
      const user = userEvent.setup();
      const onDelete = jest.fn();
      render(<TodoItem {...defaultProps} onDelete={onDelete} />);

      const deleteButton = screen.getByRole("button", { name: /delete/i });
      await user.click(deleteButton);

      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onDelete).toHaveBeenCalledWith(mockTodo.id);
    });

    it("should not call onToggle when delete is clicked", async () => {
      const user = userEvent.setup();
      const onToggle = jest.fn();
      const onDelete = jest.fn();
      render(<TodoItem {...defaultProps} onToggle={onToggle} onDelete={onDelete} />);

      const deleteButton = screen.getByRole("button", { name: /delete/i });
      await user.click(deleteButton);

      expect(onDelete).toHaveBeenCalled();
      expect(onToggle).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels for checkbox", () => {
      render(<TodoItem {...defaultProps} />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute(
        "aria-label",
        expect.stringMatching(/mark.*test todo item.*complete/i)
      );
    });

    it("should have proper ARIA label for completed checkbox", () => {
      render(<TodoItem {...defaultProps} todo={completedTodo} />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute(
        "aria-label",
        expect.stringMatching(/mark.*completed todo.*incomplete/i)
      );
    });

    it("should have proper ARIA label for delete button", () => {
      render(<TodoItem {...defaultProps} />);
      const deleteButton = screen.getByRole("button", { name: /delete/i });
      expect(deleteButton).toHaveAttribute(
        "aria-label",
        expect.stringMatching(/delete.*test todo item/i)
      );
    });

    it("should be keyboard navigable", async () => {
      const user = userEvent.setup();
      render(<TodoItem {...defaultProps} />);

      const checkbox = screen.getByRole("checkbox");
      const deleteButton = screen.getByRole("button", { name: /delete/i });

      checkbox.focus();
      expect(checkbox).toHaveFocus();

      await user.tab();
      expect(deleteButton).toHaveFocus();
    });

    it("should handle Space key on checkbox", async () => {
      const user = userEvent.setup();
      const onToggle = jest.fn();
      render(<TodoItem {...defaultProps} onToggle={onToggle} />);

      const checkbox = screen.getByRole("checkbox");
      checkbox.focus();

      await user.keyboard(" ");
      expect(onToggle).toHaveBeenCalledWith(mockTodo.id);
    });

    it("should handle Enter key on delete button", async () => {
      const user = userEvent.setup();
      const onDelete = jest.fn();
      render(<TodoItem {...defaultProps} onDelete={onDelete} />);

      const deleteButton = screen.getByRole("button", { name: /delete/i });
      deleteButton.focus();

      await user.keyboard("{Enter}");
      expect(onDelete).toHaveBeenCalledWith(mockTodo.id);
    });
  });

  describe("Edge Cases", () => {
    it("should handle very long todo text", () => {
      const longTodo = {
        ...mockTodo,
        text: "A".repeat(500),
      };
      render(<TodoItem {...defaultProps} todo={longTodo} />);
      expect(screen.getByText("A".repeat(500))).toBeInTheDocument();
    });

    it("should handle special characters in todo text", () => {
      const specialTodo = {
        ...mockTodo,
        text: "Test & <script>alert('xss')</script> todo",
      };
      render(<TodoItem {...defaultProps} todo={specialTodo} />);
      expect(screen.getByText("Test & <script>alert('xss')</script> todo")).toBeInTheDocument();
    });

    it("should not break with rapid clicks", async () => {
      const user = userEvent.setup();
      const onToggle = jest.fn();
      render(<TodoItem {...defaultProps} onToggle={onToggle} />);

      const checkbox = screen.getByRole("checkbox");

      // Rapid clicks
      await user.click(checkbox);
      await user.click(checkbox);
      await user.click(checkbox);

      expect(onToggle).toHaveBeenCalledTimes(3);
    });
  });

  describe("TypeScript Support", () => {
    it("should be properly typed", () => {
      const typedProps = {
        todo: mockTodo,
        onToggle: (id: string) => console.log(id),
        onDelete: (id: string) => console.log(id),
      };

      render(<TodoItem {...typedProps} />);
      expect(screen.getByText("Test todo item")).toBeInTheDocument();
    });
  });
});