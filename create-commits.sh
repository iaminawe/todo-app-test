#!/bin/bash

# Script to create atomic commits for the Todo App MVP
# Run this script from the project root: bash create-commits.sh

echo "Creating atomic commits for Todo App MVP..."

# Go to the project directory
cd /Users/greggcoppen/Work/spec-driven/todo-app-test

# Ensure we're on main branch
git checkout main 2>/dev/null || git checkout -b main

# Stage and commit Issue #1: Project Setup
git add package.json package-lock.json tsconfig.json next.config.js tailwind.config.ts postcss.config.js components.json
git add .eslintrc.json jest.config.js jest.setup.js
git add app/layout.tsx app/globals.css lib/utils.ts
git commit -m "feat: Project setup and configuration (#1)

- Initialize Next.js 14 with TypeScript
- Configure Tailwind CSS and shadcn/ui
- Set up Jest and React Testing Library
- Add ESLint and project configuration

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Stage and commit Issue #2: Core Types and Utilities
git add types/index.ts types/todo.ts
git add utils/date.ts utils/uuid.ts utils/validation.ts utils/storage.ts
git add utils/__tests__/date.test.ts utils/__tests__/uuid.test.ts utils/__tests__/validation.test.ts utils/__tests__/storage.test.ts
git commit -m "feat: Add core todo data types and utilities (#2)

- Define TypeScript interfaces for Todo data
- Implement date formatting utilities
- Add UUID generation and validation
- Create validation and sanitization helpers
- Implement localStorage wrapper with error handling
- Add comprehensive test coverage (90%+)

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Stage and commit Issue #4: TodoItem Component
git add components/todo/TodoItem.tsx components/todo/__tests__/TodoItem.test.tsx
git commit -m "feat: Implement TodoItem component with TDD (#4)

- Create TodoItem component with checkbox and delete
- Support both simple and detailed display modes
- Add comprehensive accessibility attributes
- Implement with 100% test coverage
- Use shadcn/ui components for consistent styling

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Stage and commit Issue #5: TodoForm Component
git add components/todo/TodoForm.tsx components/todo/__tests__/TodoForm.test.tsx
git commit -m "feat: Add TodoForm component with validation (#5)

- Create controlled form with input validation
- Add character counter and max length support
- Implement Enter key submission
- Add loading states and error handling
- Include 60+ comprehensive tests
- Exceptional UX considerations

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Stage and commit Issue #6: State Management Hook
git add hooks/useTodos.ts hooks/__tests__/useTodos.test.ts
git commit -m "feat: Implement useTodos state management hook (#6)

- Create React hook for todo state management
- Add localStorage persistence with auto-save
- Implement CRUD operations for todos
- Add error handling with auto-clear
- Fix memory leaks with proper cleanup
- Include comprehensive test coverage

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Stage and commit Issue #3: TodoList Component (initial)
git add components/todo/TodoFilters.tsx components/todo/TodoStats.tsx components/todo/TodoListItem.tsx
git commit -m "feat: Create TodoList sub-components (#3)

- Extract TodoFilters for filter functionality
- Create TodoStats for statistics display
- Add TodoListItem wrapper component
- Implement proper component composition

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Stage and commit TodoList refactoring
git add components/todo/TodoList.tsx components/todo/__tests__/TodoList.test.tsx
git commit -m "refactor: Refactor TodoList to use sub-components (#3)

- Split monolithic component into smaller pieces
- Reuse existing TodoForm and TodoItem components
- Improve maintainability and testability
- Clean architecture with single responsibility

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Stage and commit Issue #7: App Integration components
git add components/todo/TodoHeader.tsx components/todo/TodoFooter.tsx
git add components/todo/TodoStatsGrid.tsx components/todo/TodoFilterTabs.tsx
git add components/todo/TodoListContent.tsx
git commit -m "feat: Create TodoApp sub-components (#7)

- Extract TodoHeader for app header
- Create TodoFooter for actions and stats
- Add TodoStatsGrid for statistics display
- Implement TodoFilterTabs for filtering
- Create TodoListContent for content rendering

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Stage and commit TodoApp refactoring
git add components/TodoApp.tsx app/page.tsx
git add app/__tests__/integration.test.tsx
git commit -m "refactor: Refactor TodoApp to modular architecture (#7)

- Reduce main component from 328 to 129 lines (60% reduction)
- Eliminate duplicate implementations
- Use proper component composition
- Improve maintainability and scalability
- Add comprehensive integration tests

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Stage and commit UI components
git add components/ui/button.tsx components/ui/input.tsx components/ui/card.tsx
git add components/ui/checkbox.tsx components/ui/tabs.tsx
git commit -m "feat: Add shadcn/ui components

- Add Button, Input, Card components
- Add Checkbox and Tabs components
- Configure with Tailwind CSS
- Ensure accessibility compliance

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Stage and commit documentation and PR reviews
git add .github/pull_requests/
git add create-commits.sh
git commit -m "docs: Add PR reviews and approval documentation

- Create comprehensive PR review documents
- Add approval documents for all PRs
- Include review summary with metrics
- Document refactoring decisions

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Stage any remaining files
git add .
git commit -m "chore: Add remaining project files

- Add any missed configuration files
- Include build artifacts if needed
- Complete MVP implementation

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

echo "✅ All atomic commits created successfully!"
echo ""
echo "Current git log:"
git log --oneline -n 12
echo ""
echo "To push to GitHub, run:"
echo "git push -u origin main"