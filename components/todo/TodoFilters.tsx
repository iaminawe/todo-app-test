/**
 * GitHub Issue: Refactor TodoList Component Architecture
 * Title: Split TodoList into focused sub-components
 * Extracted filter functionality from TodoList
 */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export type FilterType = "all" | "active" | "completed";

interface TodoFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  showFilters: boolean;
  hasItems: boolean;
  className?: string;
}

export function TodoFilters({
  currentFilter,
  onFilterChange,
  showFilters,
  hasItems,
  className,
}: TodoFiltersProps) {
  if (!showFilters || !hasItems) {
    return null;
  }

  return (
    <div className={className} role="group" aria-label="Filter todos">
      <Button
        variant={currentFilter === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("all")}
      >
        All
      </Button>
      <Button
        variant={currentFilter === "active" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("active")}
      >
        Active
      </Button>
      <Button
        variant={currentFilter === "completed" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("completed")}
      >
        Completed
      </Button>
    </div>
  );
}