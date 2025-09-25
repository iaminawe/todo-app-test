/**
 * GitHub Issue: #3
 * Title: TodoList Component with Tests (TDD)
 * Spec: https://github.com/iaminawe/todo-app-test/issues/3
 */

"use client";

import React, { useState, useMemo } from "react";
import { Todo } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, Loader2 } from "lucide-react";
import { TodoForm } from "./TodoForm";
import { TodoFilters, FilterType } from "./TodoFilters";
import { TodoStats } from "./TodoStats";
import { TodoListItem } from "./TodoListItem";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (text: string) => void;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  showFilters?: boolean;
  className?: string;
}


export function TodoList({
  todos,
  onToggle,
  onDelete,
  onAdd,
  loading = false,
  error,
  onRetry,
  showFilters = false,
  className,
}: TodoListProps) {
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredTodos = useMemo(() => {
    if (!showFilters || filter === "all") return todos;
    if (filter === "active") return todos.filter((todo) => !todo.completed);
    if (filter === "completed") return todos.filter((todo) => todo.completed);
    return todos;
  }, [todos, filter, showFilters]);

  const handleAddTodo = (text: string) => {
    onAdd(text);
  };

  return (
    <Card
      className={cn("w-full max-w-2xl mx-auto", className)}
      role="region"
      aria-label="Todo list"
    >
      <CardHeader>
        <CardTitle>Todo List</CardTitle>
        <CardDescription>
          <TodoStats todos={todos} />
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Add Todo Form */}
        <TodoForm onSubmit={handleAddTodo} />

        {/* Filter Buttons */}
        <TodoFilters
          currentFilter={filter}
          onFilterChange={setFilter}
          showFilters={showFilters && !loading && !error}
          hasItems={todos.length > 0}
          className="flex gap-2"
        />

        {/* Loading State */}
        {loading && (
          <div
            className="flex flex-col items-center justify-center py-8"
            role="status"
            aria-live="polite"
          >
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">Loading todos...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div
            className="flex flex-col items-center justify-center py-8 text-destructive"
            role="alert"
          >
            <AlertCircle className="w-8 h-8 mb-2" />
            <p className="font-medium">Error</p>
            <p className="text-sm mt-1">{error}</p>
            {onRetry && (
              <Button onClick={onRetry} variant="outline" size="sm" className="mt-4">
                Retry
              </Button>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && todos.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-lg font-medium">No todos yet</p>
            <p className="text-sm mt-1">Add your first todo to get started</p>
          </div>
        )}

        {/* Todos List */}
        {!loading && !error && filteredTodos.length > 0 && (
          <ul
            className="space-y-2 max-h-96 overflow-y-auto"
            role="list"
            aria-live="polite"
          >
            {filteredTodos.map((todo) => (
              <TodoListItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </ul>
        )}

        {/* Status for screen readers */}
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {filteredTodos.length} todos displayed
        </div>
      </CardContent>
    </Card>
  );
}