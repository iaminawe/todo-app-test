/**
 * GitHub Issue: #7
 * Title: Main App Integration & MVP Testing
 * Spec: https://github.com/iaminawe/todo-app-test/issues/7
 */

"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type FilterType = "all" | "active" | "completed";

interface TodoStats {
  total: number;
  active: number;
  completed: number;
}

interface TodoFilterTabsProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  stats: TodoStats;
  children: React.ReactNode;
  className?: string;
}

export function TodoFilterTabs({
  filter,
  onFilterChange,
  stats,
  children,
  className,
}: TodoFilterTabsProps) {
  return (
    <Tabs
      value={filter}
      onValueChange={(value) => onFilterChange(value as FilterType)}
      className={`w-full ${className || ""}`}
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all">
          All ({stats.total})
        </TabsTrigger>
        <TabsTrigger value="active">
          Active ({stats.active})
        </TabsTrigger>
        <TabsTrigger value="completed">
          Completed ({stats.completed})
        </TabsTrigger>
      </TabsList>

      <TabsContent value={filter} className="mt-4">
        {children}
      </TabsContent>
    </Tabs>
  );
}