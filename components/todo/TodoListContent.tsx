/**
 * GitHub Issue: #7
 * Title: Main App Integration & MVP Testing
 * Spec: https://github.com/iaminawe/todo-app-test/issues/7
 */

"use client";

import React from "react";
import { Todo } from "@/types";
import { TodoItem } from "./TodoItem";
import { Button } from "@/components/ui/button";
import { ListTodo } from "lucide-react";

interface TodoListContentProps {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onRetry: () => void;
}

export function TodoListContent({
  todos,
  loading,
  error,
  onToggle,
  onDelete,
  onRetry,
}: TodoListContentProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading todos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive font-medium mb-2">Error loading todos</p>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={onRetry} variant="outline" size="sm">
          Try Again
        </Button>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <ListTodo className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium">No todos yet</p>
        <p className="text-sm mt-1">Add a todo above to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}