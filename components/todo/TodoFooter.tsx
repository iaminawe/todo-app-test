/**
 * GitHub Issue: #7
 * Title: Main App Integration & MVP Testing
 * Spec: https://github.com/iaminawe/todo-app-test/issues/7
 */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

interface TodoStats {
  total: number;
  active: number;
  completed: number;
}

interface TodoFooterProps {
  stats: TodoStats;
  filteredTodosLength: number;
  totalTodosLength: number;
  filter: string;
  onClearCompleted: () => void;
  className?: string;
}

export function TodoFooter({
  stats,
  filteredTodosLength,
  totalTodosLength,
  filter,
  onClearCompleted,
  className,
}: TodoFooterProps) {
  if (totalTodosLength === 0) {
    return null;
  }

  return (
    <CardFooter className={`flex justify-between ${className || ""}`}>
      <div className="text-sm text-muted-foreground">
        {filteredTodosLength === 0 && filter !== "all" ? (
          <span>No {filter} todos</span>
        ) : (
          <span>
            Showing {filteredTodosLength} of {totalTodosLength} todos
          </span>
        )}
      </div>

      {stats.completed > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearCompleted}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Clear Completed ({stats.completed})
        </Button>
      )}
    </CardFooter>
  );
}