/**
 * GitHub Issue: #2
 * Title: Core Todo Data Types & Utilities
 * Spec: https://github.com/iaminawe/todo-app-test/issues/2
 */

import {
  isTodo,
  isTodoInput,
  isTodoUpdate,
  validateTodoText,
  sanitizeTodoText,
  validateTodos,
} from "../validation";
import { Todo } from "@/types";

describe("Validation Utilities", () => {
  const validTodo: Todo = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    text: "Test todo",
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe("isTodo", () => {
    it("should validate a valid Todo object", () => {
      expect(isTodo(validTodo)).toBe(true);
    });

    it("should reject invalid Todo objects", () => {
      expect(isTodo(null)).toBe(false);
      expect(isTodo(undefined)).toBe(false);
      expect(isTodo("string")).toBe(false);
      expect(isTodo(123)).toBe(false);
      expect(isTodo([])).toBe(false);

      // Missing fields
      expect(isTodo({})).toBe(false);
      expect(isTodo({ id: "123" })).toBe(false);
      expect(isTodo({ ...validTodo, id: undefined })).toBe(false);
      expect(isTodo({ ...validTodo, text: undefined })).toBe(false);
      expect(isTodo({ ...validTodo, completed: undefined })).toBe(false);

      // Invalid field types
      expect(isTodo({ ...validTodo, id: 123 })).toBe(false);
      expect(isTodo({ ...validTodo, id: "not-a-uuid" })).toBe(false);
      expect(isTodo({ ...validTodo, text: "" })).toBe(false);
      expect(isTodo({ ...validTodo, text: 123 })).toBe(false);
      expect(isTodo({ ...validTodo, completed: "false" })).toBe(false);
      expect(isTodo({ ...validTodo, createdAt: "2024-01-01" })).toBe(false);
    });
  });

  describe("isTodoInput", () => {
    it("should validate valid TodoInput objects", () => {
      expect(isTodoInput({ text: "New todo" })).toBe(true);
      expect(isTodoInput({ text: "A" })).toBe(true);
      expect(isTodoInput({ text: "A".repeat(500) })).toBe(true);
    });

    it("should reject invalid TodoInput objects", () => {
      expect(isTodoInput(null)).toBe(false);
      expect(isTodoInput(undefined)).toBe(false);
      expect(isTodoInput("string")).toBe(false);
      expect(isTodoInput({})).toBe(false);
      expect(isTodoInput({ text: "" })).toBe(false);
      expect(isTodoInput({ text: "   " })).toBe(false);
      expect(isTodoInput({ text: 123 })).toBe(false);
      expect(isTodoInput({ text: "A".repeat(501) })).toBe(false);
    });
  });

  describe("isTodoUpdate", () => {
    it("should validate valid TodoUpdate objects", () => {
      expect(isTodoUpdate({ text: "Updated text" })).toBe(true);
      expect(isTodoUpdate({ completed: true })).toBe(true);
      expect(isTodoUpdate({ text: "Updated", completed: false })).toBe(true);
    });

    it("should reject invalid TodoUpdate objects", () => {
      expect(isTodoUpdate(null)).toBe(false);
      expect(isTodoUpdate(undefined)).toBe(false);
      expect(isTodoUpdate("string")).toBe(false);
      expect(isTodoUpdate({})).toBe(false); // No fields
      expect(isTodoUpdate({ text: "" })).toBe(false);
      expect(isTodoUpdate({ text: "   " })).toBe(false);
      expect(isTodoUpdate({ text: 123 })).toBe(false);
      expect(isTodoUpdate({ completed: "true" })).toBe(false);
      expect(isTodoUpdate({ text: "A".repeat(501) })).toBe(false);
    });
  });

  describe("validateTodoText", () => {
    it("should validate valid todo text", () => {
      expect(validateTodoText("Valid todo")).toEqual({ valid: true });
      expect(validateTodoText("A")).toEqual({ valid: true });
      expect(validateTodoText("A".repeat(500))).toEqual({ valid: true });
      expect(validateTodoText("  Trimmed text  ")).toEqual({ valid: true });
    });

    it("should reject empty text", () => {
      const result = validateTodoText("");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("empty");

      const whitespaceResult = validateTodoText("   ");
      expect(whitespaceResult.valid).toBe(false);
      expect(whitespaceResult.error).toContain("empty");
    });

    it("should reject text over 500 characters", () => {
      const result = validateTodoText("A".repeat(501));
      expect(result.valid).toBe(false);
      expect(result.error).toContain("500");
    });
  });

  describe("sanitizeTodoText", () => {
    it("should trim whitespace", () => {
      expect(sanitizeTodoText("  text  ")).toBe("text");
      expect(sanitizeTodoText("\n\ttext\n\t")).toBe("text");
    });

    it("should replace multiple spaces with single space", () => {
      expect(sanitizeTodoText("multiple    spaces")).toBe("multiple spaces");
      expect(sanitizeTodoText("tabs\t\ttoo")).toBe("tabs too");
    });

    it("should enforce max length", () => {
      const longText = "A".repeat(600);
      expect(sanitizeTodoText(longText)).toHaveLength(500);
    });

    it("should handle normal text unchanged", () => {
      expect(sanitizeTodoText("Normal text")).toBe("Normal text");
    });
  });

  describe("validateTodos", () => {
    it("should validate array of valid todos", () => {
      const todos = [validTodo, { ...validTodo, id: "550e8400-e29b-41d4-a716-446655440001" }];
      expect(validateTodos(todos)).toBe(true);
    });

    it("should validate empty array", () => {
      expect(validateTodos([])).toBe(true);
    });

    it("should reject non-arrays", () => {
      expect(validateTodos("not-array" as any)).toBe(false);
      expect(validateTodos(null as any)).toBe(false);
      expect(validateTodos(undefined as any)).toBe(false);
    });

    it("should reject arrays with invalid todos", () => {
      const todos = [validTodo, { invalid: "todo" }];
      expect(validateTodos(todos)).toBe(false);
    });
  });
});