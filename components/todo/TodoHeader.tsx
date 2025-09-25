/**
 * GitHub Issue: #7
 * Title: Main App Integration & MVP Testing
 * Spec: https://github.com/iaminawe/todo-app-test/issues/7
 */

"use client";

import React from "react";
import { ListTodo } from "lucide-react";

interface TodoHeaderProps {
  className?: string;
}

export function TodoHeader({ className }: TodoHeaderProps) {
  return (
    <div className={`text-center mb-8 ${className || ""}`}>
      <h1 className="text-4xl font-bold tracking-tight mb-2">
        <ListTodo className="inline-block w-10 h-10 mr-2 text-primary" />
        Todo App
      </h1>
      <p className="text-muted-foreground">
        A modern todo list to organize your tasks
      </p>
    </div>
  );
}