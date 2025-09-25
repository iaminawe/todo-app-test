#!/bin/bash

# Script to diagnose git issues and push to repository
set -e  # Exit on error

echo "==================================="
echo "Git Repository Diagnostic & Push Script"
echo "==================================="
echo ""

# Navigate to project directory
PROJECT_DIR="/Users/greggcoppen/Work/spec-driven/todo-app-test"
echo "→ Navigating to project directory..."
cd "$PROJECT_DIR" || { echo "❌ Failed to navigate to $PROJECT_DIR"; exit 1; }
echo "✅ Current directory: $(pwd)"
echo ""

# Check git installation
echo "→ Checking git installation..."
which git || { echo "❌ Git is not installed"; exit 1; }
git --version
echo "✅ Git is installed"
echo ""

# Check git repository status
echo "→ Checking if this is a git repository..."
if [ -d .git ]; then
    echo "✅ Git repository found"
else
    echo "⚠️  No git repository found. Initializing..."
    git init
    echo "✅ Git repository initialized"
fi
echo ""

# Check remote configuration
echo "→ Checking remote configuration..."
git remote -v || echo "No remotes configured"
echo ""

# Add remote if not exists
if ! git remote | grep -q "origin"; then
    echo "→ Adding GitHub remote..."
    git remote add origin https://github.com/iaminawe/todo-app-test.git
    echo "✅ Remote added"
else
    echo "✅ Remote 'origin' already configured"
fi
echo ""

# Check current branch
echo "→ Current branch:"
git branch --show-current || echo "No branch (detached HEAD state)"
echo ""

# Check if main branch exists
if ! git show-ref --verify --quiet refs/heads/main; then
    echo "→ Creating main branch..."
    git checkout -b main
    echo "✅ Main branch created"
else
    echo "→ Switching to main branch..."
    git checkout main
    echo "✅ On main branch"
fi
echo ""

# Check for uncommitted changes
echo "→ Checking for uncommitted changes..."
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Uncommitted changes found:"
    git status --short
    echo ""
    echo "→ Would you like to commit all changes? (y/n)"
    read -r response
    if [ "$response" = "y" ]; then
        git add .
        git commit -m "feat: Complete Todo App MVP implementation

- All 7 issues implemented
- Full test coverage
- Clean architecture with component separation
- Ready for production

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
        echo "✅ Changes committed"
    fi
else
    echo "✅ No uncommitted changes"
fi
echo ""

# Check commit history
echo "→ Recent commits:"
git log --oneline -5 2>/dev/null || echo "No commits yet"
echo ""

# Attempt to push
echo "==================================="
echo "Ready to push to GitHub"
echo "==================================="
echo ""
echo "→ Attempting to push to origin/main..."
echo ""

# Try different push methods
echo "Method 1: Standard push"
git push -u origin main 2>&1 || {
    echo "❌ Standard push failed"
    echo ""
    echo "Method 2: Force push with lease (safer than force)"
    echo "This will overwrite remote with your local changes."
    echo "Continue? (y/n)"
    read -r response
    if [ "$response" = "y" ]; then
        git push --force-with-lease -u origin main 2>&1 || {
            echo "❌ Force with lease failed"
            echo ""
            echo "Method 3: Force push"
            echo "⚠️  WARNING: This will overwrite the remote repository!"
            echo "Are you sure? (y/n)"
            read -r response
            if [ "$response" = "y" ]; then
                git push --force -u origin main
            fi
        }
    fi
}

echo ""
echo "==================================="
echo "Push attempt complete!"
echo "==================================="
echo ""
echo "If push failed, try these manual commands:"
echo "1. git push -u origin main"
echo "2. git push --force-with-lease -u origin main"
echo "3. git pull origin main --rebase && git push origin main"
echo ""
echo "Check your repository at: https://github.com/iaminawe/todo-app-test"