/**
 * GitHub Issue: #7
 * Title: Main App Integration & MVP Testing
 * Spec: https://github.com/iaminawe/todo-app-test/issues/7
 */

"use client";

import { TodoApp } from "@/components/TodoApp";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <TodoApp />
    </main>
  );
}