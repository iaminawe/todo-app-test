/**
 * GitHub Issue: #5
 * Title: TodoForm Component with Tests (TDD)
 * Spec: https://github.com/iaminawe/todo-app-test/issues/5
 */

"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { validateTodoText, sanitizeTodoText } from "@/utils/validation";
import { Plus, Loader2 } from "lucide-react";

interface TodoFormProps {
  onSubmit: (text: string) => void | Promise<void>;
  placeholder?: string;
  buttonText?: string;
  minLength?: number;
  maxLength?: number;
  showCharCount?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export function TodoForm({
  onSubmit,
  placeholder = "Add a new todo...",
  buttonText = "Add",
  minLength = 1,
  maxLength = 500,
  showCharCount = false,
  autoFocus = false,
  className,
}: TodoFormProps) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const trimmedText = text.trim();
  const isValid = trimmedText.length >= minLength && trimmedText.length <= maxLength;
  const canSubmit = isValid && !isSubmitting;

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    if (!trimmedText) {
      setError("Todo text cannot be empty");
      return;
    }

    if (trimmedText.length < minLength) {
      setError(`Todo must be at least ${minLength} character${minLength > 1 ? "s" : ""}`);
      return;
    }

    const validation = validateTodoText(trimmedText);
    if (!validation.valid) {
      setError(validation.error || "Invalid input");
      return;
    }

    // Submit
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(sanitizeTodoText(trimmedText));
      setText("");
      inputRef.current?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add todo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;

    // Enforce max length at input level
    if (newText.length <= maxLength) {
      setText(newText);

      // Clear error when user starts typing valid text
      if (error && newText.trim().length >= minLength) {
        setError(null);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("space-y-2", className)}
      aria-label="Add new todo"
      role="form"
    >
      <div className="flex gap-2">
        <div className="flex-1 space-y-1">
          <Input
            ref={inputRef}
            type="text"
            value={text}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={isSubmitting}
            maxLength={maxLength}
            aria-label="Todo text"
            aria-invalid={!!error}
            aria-describedby={error ? "todo-error" : undefined}
            className={cn(
              error && "border-destructive focus:ring-destructive"
            )}
          />

          {showCharCount && (
            <p className="text-xs text-muted-foreground text-right">
              {text.length} / {maxLength}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={!canSubmit}
          className="min-w-[80px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-1" />
              {buttonText}
            </>
          )}
        </Button>
      </div>

      {error && (
        <p
          id="todo-error"
          role="alert"
          className="text-sm text-destructive"
        >
          {error}
        </p>
      )}
    </form>
  );
}