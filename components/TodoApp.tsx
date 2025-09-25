/**
 * GitHub Issue: #7
 * Title: Main App Integration & MVP Testing
 * Spec: https://github.com/iaminawe/todo-app-test/issues/7
 */

"use client";

import React, { useState } from "react";
import { TodoForm } from "@/components/todo/TodoForm";
import { TodoHeader } from "@/components/todo/TodoHeader";
import { TodoFooter } from "@/components/todo/TodoFooter";
import { TodoStatsGrid } from "@/components/todo/TodoStatsGrid";
import { TodoFilterTabs, FilterType } from "@/components/todo/TodoFilterTabs";
import { TodoListContent } from "@/components/todo/TodoListContent";
import { useTodos } from "@/hooks/useTodos";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


export function TodoApp() {
  const {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    retry,
    stats,
  } = useTodos();

  const [filter, setFilter] = useState<FilterType>("all");

  const filteredTodos = React.useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((todo) => !todo.completed);
      case "completed":
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header */}
      <TodoHeader />

      {/* Main Content */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>My Todos</CardTitle>
          <CardDescription>
            {stats.total === 0 ? (
              "Add your first todo to get started"
            ) : (
              <span>
                {stats.active} active, {stats.completed} completed, {stats.total} total
              </span>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Add Todo Form */}
          <TodoForm
            onSubmit={addTodo}
            placeholder="What needs to be done?"
            autoFocus
            showCharCount
            maxLength={200}
          />

          {/* Filter Tabs */}
          {todos.length > 0 && (
            <TodoFilterTabs
              filter={filter}
              onFilterChange={setFilter}
              stats={stats}
            >
              <TodoListContent
                todos={filteredTodos}
                loading={loading}
                error={error}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onRetry={retry}
              />
            </TodoFilterTabs>
          )}

          {/* No Tabs when empty */}
          {todos.length === 0 && (
            <TodoListContent
              todos={filteredTodos}
              loading={loading}
              error={error}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onRetry={retry}
            />
          )}
        </CardContent>

        <TodoFooter
          stats={stats}
          filteredTodosLength={filteredTodos.length}
          totalTodosLength={todos.length}
          filter={filter}
          onClearCompleted={clearCompleted}
        />
      </Card>

      {/* Stats Summary */}
      {todos.length > 0 && (
        <TodoStatsGrid stats={stats} />
      )}
    </div>
  );
}

