/**
 * GitHub Issue: #1
 * Title: Project Setup & Configuration
 * Spec: https://github.com/iaminawe/todo-app-test/issues/1
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}