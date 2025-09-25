/**
 * GitHub Issue: Refactor TodoList Component Architecture
 * Title: Split TodoList into focused sub-components
 * Extracted statistics display from TodoList
 */

"use client";

import React from "react";
import { Todo } from "@/types";

interface TodoStatsProps {
  todos: Todo[];
  className?: string;
}

export function TodoStats({ todos, className }: TodoStatsProps) {
  const completedCount = todos.filter((todo) => todo.completed).length;

  if (todos.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {todos.length} {todos.length === 1 ? "todo" : "todos"}
      {completedCount > 0 && ` • ${completedCount} completed`}
    </div>
  );
}