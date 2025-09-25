/**
 * GitHub Issue: Refactor TodoList Component Architecture
 * Title: Split TodoList into focused sub-components
 * List item wrapper that uses the existing TodoItem component
 */

"use client";

import React from "react";
import { Todo } from "@/types";
import { TodoItem } from "./TodoItem";

interface TodoListItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoListItem({ todo, onToggle, onDelete }: TodoListItemProps) {
  return (
    <li role="listitem">
      <TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} />
    </li>
  );
}