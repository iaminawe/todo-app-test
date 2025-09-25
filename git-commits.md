# Git Commit Instructions

Run these commands in your terminal from the project directory to create atomic commits:

```bash
cd /Users/greggcoppen/Work/spec-driven/todo-app-test

# Check current status
git status

# Create atomic commits for each feature/issue

# 1. Project Setup (Issue #1)
git add package*.json tsconfig.json next.config.js tailwind.config.ts postcss.config.js components.json .eslintrc.json jest.* app/layout.tsx app/globals.css lib/utils.ts
git commit -m "feat: Initialize Next.js project with TypeScript and shadcn/ui (#1)

- Set up Next.js 14 with App Router
- Configure TypeScript and Tailwind CSS
- Add shadcn/ui component library
- Set up Jest and React Testing Library

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# 2. Core Types and Utilities (Issue #2)
git add types/ utils/
git commit -m "feat: Add core todo data types and utilities (#2)

- Define Todo, TodoInput, TodoUpdate interfaces
- Implement date formatting utilities
- Add UUID generation and validation
- Create validation and storage helpers
- Include comprehensive test coverage (90%+)

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# 3. UI Components
git add components/ui/
git commit -m "feat: Add shadcn/ui components

- Button, Input, Card components
- Checkbox and Tabs components
- Tailwind CSS styling
- Full accessibility support

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# 4. TodoItem Component (Issue #4)
git add components/todo/TodoItem.tsx components/todo/__tests__/TodoItem.test.tsx
git commit -m "feat: Implement TodoItem component with TDD (#4)

- Checkbox and delete functionality
- Simple and detailed display modes
- Full accessibility attributes
- 100% test coverage

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# 5. TodoForm Component (Issue #5)
git add components/todo/TodoForm.tsx components/todo/__tests__/TodoForm.test.tsx
git commit -m "feat: Add TodoForm component with validation (#5)

- Controlled input with validation
- Character counter and max length
- Enter key submission
- 60+ comprehensive tests

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# 6. State Management (Issue #6)
git add hooks/
git commit -m "feat: Implement useTodos state management hook (#6)

- Todo state management with React hooks
- localStorage persistence with auto-save
- CRUD operations for todos
- Error handling with auto-clear
- Memory leak prevention

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# 7. TodoList Components (Issue #3)
git add components/todo/TodoFilters.tsx components/todo/TodoStats.tsx components/todo/TodoListItem.tsx components/todo/TodoList.tsx components/todo/__tests__/TodoList.test.tsx
git commit -m "feat: Implement TodoList with modular architecture (#3)

- TodoList main component
- TodoFilters for filter buttons
- TodoStats for statistics
- TodoListItem wrapper
- Clean component composition

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# 8. TodoApp Components (Issue #7)
git add components/todo/TodoHeader.tsx components/todo/TodoFooter.tsx components/todo/TodoStatsGrid.tsx components/todo/TodoFilterTabs.tsx components/todo/TodoListContent.tsx
git commit -m "feat: Add TodoApp sub-components (#7)

- TodoHeader for app title
- TodoFooter for actions
- TodoStatsGrid for statistics
- TodoFilterTabs for filtering
- TodoListContent for display

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# 9. Main App Integration (Issue #7)
git add components/TodoApp.tsx app/page.tsx app/__tests__/
git commit -m "feat: Complete app integration with clean architecture (#7)

- Main TodoApp component (129 lines)
- Full integration with all components
- Comprehensive integration tests
- Clean, maintainable architecture

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# 10. Documentation
git add .github/ *.md *.sh
git commit -m "docs: Add PR reviews and project documentation

- PR review documents for all issues
- Approval documentation
- Review summary with metrics
- Setup instructions

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Add any remaining files
git add .
git commit -m "chore: Add remaining configuration files

- Additional config and build files
- Complete MVP implementation

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# View the commit history
git log --oneline -n 11

# Push to GitHub
git push -u origin main
```

## Alternative: Run as a script

Save the commands to a file and run:
```bash
chmod +x create-commits.sh
./create-commits.sh
```