/**
 * GitHub Issue: #5
 * Title: TodoForm Component with Tests (TDD)
 * Spec: https://github.com/iaminawe/todo-app-test/issues/5
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { TodoForm } from "../TodoForm";

describe("TodoForm Component", () => {
  const defaultProps = {
    onSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      render(<TodoForm {...defaultProps} />);
      expect(screen.getByRole("form")).toBeInTheDocument();
    });

    it("should render input field", () => {
      render(<TodoForm {...defaultProps} />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/add.*todo/i)).toBeInTheDocument();
    });

    it("should render submit button", () => {
      render(<TodoForm {...defaultProps} />);
      expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
    });

    it("should use shadcn/ui Input component", () => {
      const { container } = render(<TodoForm {...defaultProps} />);
      const input = container.querySelector('input[class*="flex"][class*="rounded-md"]');
      expect(input).toBeInTheDocument();
    });

    it("should use shadcn/ui Button component", () => {
      const { container } = render(<TodoForm {...defaultProps} />);
      const button = container.querySelector('button[class*="inline-flex"]');
      expect(button).toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("should call onSubmit with trimmed text", async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();
      render(<TodoForm onSubmit={onSubmit} />);

      const input = screen.getByRole("textbox");
      const button = screen.getByRole("button", { name: /add/i });

      await user.type(input, "  New todo item  ");
      await user.click(button);

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith("New todo item");
    });

    it("should reset form after successful submission", async () => {
      const user = userEvent.setup();
      render(<TodoForm {...defaultProps} />);

      const input = screen.getByRole("textbox") as HTMLInputElement;

      await user.type(input, "New todo");
      await user.click(screen.getByRole("button", { name: /add/i }));

      expect(input.value).toBe("");
    });

    it("should handle Enter key submission", async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();
      render(<TodoForm onSubmit={onSubmit} />);

      const input = screen.getByRole("textbox");

      await user.type(input, "Todo via Enter");
      await user.keyboard("{Enter}");

      expect(onSubmit).toHaveBeenCalledWith("Todo via Enter");
    });

    it("should focus input after submission", async () => {
      const user = userEvent.setup();
      render(<TodoForm {...defaultProps} />);

      const input = screen.getByRole("textbox");

      await user.type(input, "New todo");
      await user.keyboard("{Enter}");

      expect(input).toHaveFocus();
    });
  });

  describe("Input Validation", () => {
    it("should not submit empty input", async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();
      render(<TodoForm onSubmit={onSubmit} />);

      const button = screen.getByRole("button", { name: /add/i });
      await user.click(button);

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("should not submit whitespace-only input", async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();
      render(<TodoForm onSubmit={onSubmit} />);

      const input = screen.getByRole("textbox");

      await user.type(input, "    ");
      await user.keyboard("{Enter}");

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("should show validation error for empty submission", async () => {
      const user = userEvent.setup();
      render(<TodoForm {...defaultProps} />);

      const button = screen.getByRole("button", { name: /add/i });
      await user.click(button);

      expect(screen.getByText(/cannot be empty/i)).toBeInTheDocument();
    });

    it("should clear error when valid text is entered", async () => {
      const user = userEvent.setup();
      render(<TodoForm {...defaultProps} />);

      const input = screen.getByRole("textbox");
      const button = screen.getByRole("button", { name: /add/i });

      // Trigger error
      await user.click(button);
      expect(screen.getByText(/cannot be empty/i)).toBeInTheDocument();

      // Type valid text
      await user.type(input, "Valid todo");
      expect(screen.queryByText(/cannot be empty/i)).not.toBeInTheDocument();
    });

    it("should enforce minimum length", async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();
      render(<TodoForm onSubmit={onSubmit} minLength={3} />);

      const input = screen.getByRole("textbox");

      await user.type(input, "ab");
      await user.keyboard("{Enter}");

      expect(onSubmit).not.toHaveBeenCalled();
      expect(screen.getByText(/at least 3 character/i)).toBeInTheDocument();
    });

    it("should enforce maximum length", async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();
      render(<TodoForm onSubmit={onSubmit} maxLength={10} />);

      const input = screen.getByRole("textbox");

      await user.type(input, "This is way too long");

      // Should truncate input
      expect((input as HTMLInputElement).value).toHaveLength(10);
    });

    it("should show character count when approaching limit", () => {
      render(<TodoForm {...defaultProps} maxLength={50} showCharCount />);

      expect(screen.getByText(/0 \/ 50/)).toBeInTheDocument();
    });

    it("should update character count as typing", async () => {
      const user = userEvent.setup();
      render(<TodoForm {...defaultProps} maxLength={50} showCharCount />);

      const input = screen.getByRole("textbox");
      await user.type(input, "Hello");

      expect(screen.getByText(/5 \/ 50/)).toBeInTheDocument();
    });
  });

  describe("Button States", () => {
    it("should disable button when input is empty", () => {
      render(<TodoForm {...defaultProps} />);
      const button = screen.getByRole("button", { name: /add/i });
      expect(button).toBeDisabled();
    });

    it("should enable button when input has valid text", async () => {
      const user = userEvent.setup();
      render(<TodoForm {...defaultProps} />);

      const input = screen.getByRole("textbox");
      const button = screen.getByRole("button", { name: /add/i });

      await user.type(input, "Valid text");
      expect(button).not.toBeDisabled();
    });

    it("should disable form during submission", async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn().mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );
      render(<TodoForm onSubmit={onSubmit} />);

      const input = screen.getByRole("textbox");
      const button = screen.getByRole("button", { name: /add/i });

      await user.type(input, "New todo");
      await user.click(button);

      expect(button).toBeDisabled();
      expect(input).toBeDisabled();

      await waitFor(() => {
        expect(button).not.toBeDisabled();
        expect(input).not.toBeDisabled();
      });
    });

    it("should show loading state during submission", async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn().mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );
      render(<TodoForm onSubmit={onSubmit} />);

      const input = screen.getByRole("textbox");

      await user.type(input, "New todo");
      await user.keyboard("{Enter}");

      expect(screen.getByText(/adding/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText(/adding/i)).not.toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    it("should display error from failed submission", async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn().mockRejectedValue(new Error("Network error"));
      render(<TodoForm onSubmit={onSubmit} />);

      const input = screen.getByRole("textbox");

      await user.type(input, "New todo");
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });

    it("should clear error on new submission attempt", async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn()
        .mockRejectedValueOnce(new Error("First error"))
        .mockResolvedValueOnce(undefined);
      render(<TodoForm onSubmit={onSubmit} />);

      const input = screen.getByRole("textbox");

      // First submission - error
      await user.type(input, "First todo");
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(screen.getByText(/first error/i)).toBeInTheDocument();
      });

      // Second submission - success
      await user.clear(input);
      await user.type(input, "Second todo");
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(screen.queryByText(/first error/i)).not.toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have accessible form structure", () => {
      render(<TodoForm {...defaultProps} />);

      const form = screen.getByRole("form");
      expect(form).toHaveAttribute("aria-label", "Add new todo");
    });

    it("should have proper label for input", () => {
      render(<TodoForm {...defaultProps} />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-label", "Todo text");
    });

    it("should announce validation errors", async () => {
      const user = userEvent.setup();
      render(<TodoForm {...defaultProps} />);

      const button = screen.getByRole("button", { name: /add/i });
      await user.click(button);

      const error = screen.getByText(/cannot be empty/i);
      expect(error).toHaveAttribute("role", "alert");
    });

    it("should have proper keyboard support", async () => {
      const user = userEvent.setup();
      render(<TodoForm {...defaultProps} />);

      const input = screen.getByRole("textbox");
      const button = screen.getByRole("button", { name: /add/i });

      // Tab navigation
      await user.tab();
      expect(input).toHaveFocus();

      await user.type(input, "Test");
      await user.tab();
      expect(button).toHaveFocus();
    });
  });

  describe("Custom Props", () => {
    it("should accept custom placeholder", () => {
      render(<TodoForm {...defaultProps} placeholder="Custom placeholder" />);
      expect(screen.getByPlaceholderText("Custom placeholder")).toBeInTheDocument();
    });

    it("should accept custom button text", () => {
      render(<TodoForm {...defaultProps} buttonText="Create" />);
      expect(screen.getByRole("button", { name: /create/i })).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      const { container } = render(
        <TodoForm {...defaultProps} className="custom-class" />
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("should auto-focus input when autoFocus is true", () => {
      render(<TodoForm {...defaultProps} autoFocus />);
      expect(screen.getByRole("textbox")).toHaveFocus();
    });
  });
});