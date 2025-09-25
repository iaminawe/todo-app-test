/**
 * GitHub Issue: #2
 * Title: Core Todo Data Types & Utilities
 * Spec: https://github.com/iaminawe/todo-app-test/issues/2
 */

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type TodoList = Todo[];

export interface TodoInput {
  text: string;
}

export interface TodoUpdate {
  text?: string;
  completed?: boolean;
}

export interface StorageData<T> {
  version: string;
  data: T;
  lastModified: string;
}

export type TodoStorageData = StorageData<TodoList>;

export const TODO_STORAGE_KEY = "todo-app-data";
export const STORAGE_VERSION = "1.0.0";