/**
 * GitHub Issue: #7
 * Title: Main App Integration & MVP Testing
 * Spec: https://github.com/iaminawe/todo-app-test/issues/7
 */

"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2, ListTodo } from "lucide-react";

interface TodoStats {
  total: number;
  active: number;
  completed: number;
}

interface TodoStatsGridProps {
  stats: TodoStats;
  className?: string;
}

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  className?: string;
}

function StatsCard({ title, value, icon, className }: StatsCardProps) {
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="text-muted-foreground">{icon}</div>
      </div>
    </Card>
  );
}

export function TodoStatsGrid({ stats, className }: TodoStatsGridProps) {
  return (
    <div className={cn("grid grid-cols-3 gap-4 mt-6", className)}>
      <StatsCard
        title="Total"
        value={stats.total}
        icon={<ListTodo className="w-5 h-5" />}
        className="bg-primary/5 border-primary/20"
      />
      <StatsCard
        title="Active"
        value={stats.active}
        icon={<ListTodo className="w-5 h-5" />}
        className="bg-blue-500/5 border-blue-500/20"
      />
      <StatsCard
        title="Completed"
        value={stats.completed}
        icon={<CheckCircle2 className="w-5 h-5" />}
        className="bg-green-500/5 border-green-500/20"
      />
    </div>
  );
}