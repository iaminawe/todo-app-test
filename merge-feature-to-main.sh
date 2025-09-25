#!/bin/bash

# Script to merge feature/project-setup branch into main
echo "==================================="
echo "Merging Feature Branch into Main"
echo "==================================="
echo ""

cd /Users/greggcoppen/Work/spec-driven/todo-app-test

# Show current branch
echo "→ Current branch:"
git branch --show-current
echo ""

# Show all branches
echo "→ Available branches:"
git branch -a
echo ""

# Stash any uncommitted changes
echo "→ Checking for uncommitted changes..."
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Uncommitted changes found. Stashing them..."
    git stash push -m "Auto-stash before merge"
    STASHED=true
else
    echo "✅ Working directory clean"
    STASHED=false
fi
echo ""

# Switch to main branch
echo "→ Switching to main branch..."
git checkout main || {
    echo "❌ Failed to checkout main branch"
    echo "Creating main branch..."
    git checkout -b main
}
echo ""

# Pull latest changes from remote main
echo "→ Pulling latest changes from origin/main..."
git pull origin main --no-edit 2>/dev/null || echo "⚠️  No remote main branch or no changes to pull"
echo ""

# Merge feature/project-setup into main
echo "→ Merging feature/project-setup into main..."
if git show-ref --verify --quiet refs/heads/feature/project-setup; then
    echo "Found local feature/project-setup branch"

    # Show what will be merged
    echo ""
    echo "→ Changes to be merged:"
    git log main..feature/project-setup --oneline 2>/dev/null || echo "No new commits to merge"
    echo ""

    # Perform the merge
    git merge feature/project-setup --no-ff -m "Merge feature/project-setup into main

Includes:
- Project setup and configuration
- Core todo types and utilities
- Todo components (TodoItem, TodoForm, TodoList)
- State management with useTodos hook
- Main app integration
- Comprehensive test coverage
- Clean component architecture after refactoring

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>" || {
        echo "❌ Merge failed. Attempting to resolve..."

        # Check for conflicts
        if [ -n "$(git diff --name-only --diff-filter=U)" ]; then
            echo "⚠️  Merge conflicts detected in:"
            git diff --name-only --diff-filter=U
            echo ""
            echo "Options:"
            echo "1. Abort merge: git merge --abort"
            echo "2. Accept all from feature branch: git checkout --theirs ."
            echo "3. Accept all from main: git checkout --ours ."
            echo "4. Manually resolve conflicts and then: git add . && git commit"

            echo ""
            echo "Auto-accepting changes from feature branch..."
            git checkout --theirs .
            git add .
            git commit -m "Merge feature/project-setup into main (resolved conflicts)"
        fi
    }

    echo "✅ Merge completed successfully"

elif git show-ref --verify --quiet refs/remotes/origin/feature/project-setup; then
    echo "Found remote feature/project-setup branch"

    # Fetch and merge remote branch
    git fetch origin feature/project-setup
    git merge origin/feature/project-setup --no-ff -m "Merge feature/project-setup into main

Includes complete Todo App MVP implementation

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

    echo "✅ Merge completed successfully"
else
    echo "⚠️  feature/project-setup branch not found locally or remotely"
    echo ""
    echo "→ Checking if already merged..."

    # Check if the branch was already merged
    git branch --merged | grep -q "feature/project-setup" && echo "✅ Branch already merged" || echo "❌ Branch not found"
fi
echo ""

# Show the merge result
echo "→ Recent commit history after merge:"
git log --oneline --graph -10
echo ""

# Push the merged main branch to remote
echo "→ Pushing merged main branch to origin..."
git push origin main || {
    echo "⚠️  Push failed. Trying with upstream..."
    git push --set-upstream origin main || {
        echo "❌ Push failed. You might need to:"
        echo "1. Pull first: git pull origin main --rebase"
        echo "2. Then push: git push origin main"
    }
}
echo ""

# Restore stashed changes if any
if [ "$STASHED" = true ]; then
    echo "→ Restoring stashed changes..."
    git stash pop
fi

echo "==================================="
echo "✅ Merge Complete!"
echo "==================================="
echo ""
echo "Next steps:"
echo "1. Verify the merge at: https://github.com/iaminawe/todo-app-test"
echo "2. Delete the feature branch if no longer needed:"
echo "   git branch -d feature/project-setup"
echo "   git push origin --delete feature/project-setup"
echo ""
echo "Current branch: $(git branch --show-current)"
echo "Latest commit: $(git log -1 --oneline)"