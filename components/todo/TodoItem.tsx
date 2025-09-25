/**
 * GitHub Issue: #4
 * Title: TodoItem Component with Tests (TDD)
 * Spec: https://github.com/iaminawe/todo-app-test/issues/4
 */

"use client";

import React from "react";
import { Todo } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  className?: string;
}

export function TodoItem({ todo, onToggle, onDelete, className }: TodoItemProps) {
  const handleToggle = () => {
    onToggle(todo.id);
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors",
        className
      )}
    >
      {/* Custom checkbox with shadcn/ui styling */}
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className="peer sr-only"
          id={`todo-${todo.id}`}
          aria-label={`Mark "${todo.text}" as ${
            todo.completed ? "incomplete" : "complete"
          }`}
        />
        <label
          htmlFor={`todo-${todo.id}`}
          className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-sm border border-primary ring-offset-background peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground"
          data-state={todo.completed ? "checked" : "unchecked"}
        >
          {todo.completed && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </label>
      </div>

      {/* Todo text */}
      <span
        className={cn(
          "flex-1 text-sm",
          todo.completed && "line-through text-muted-foreground"
        )}
      >
        {todo.text}
      </span>

      {/* Delete button */}
      <Button
        onClick={handleDelete}
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
        aria-label={`Delete "${todo.text}"`}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  );
}

// Alternative implementation using shadcn/ui Checkbox component
import { Checkbox } from "@/components/ui/checkbox";

export function TodoItemWithCheckbox({ todo, onToggle, onDelete, className }: TodoItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors",
        className
      )}
    >
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        aria-label={`Mark "${todo.text}" as ${
          todo.completed ? "incomplete" : "complete"
        }`}
        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
      />

      <span
        className={cn(
          "flex-1 text-sm",
          todo.completed && "line-through text-muted-foreground"
        )}
      >
        {todo.text}
      </span>

      <Button
        onClick={() => onDelete(todo.id)}
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
        aria-label={`Delete "${todo.text}"`}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  );
}