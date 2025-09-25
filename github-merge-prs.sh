#!/bin/bash

# Script to merge PRs using GitHub CLI
echo "==================================="
echo "Merging PRs using GitHub CLI"
echo "==================================="
echo ""

cd /Users/greggcoppen/Work/spec-driven/todo-app-test

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "Install it with: brew install gh"
    echo "Then authenticate with: gh auth login"
    exit 1
fi

# Check authentication
echo "→ Checking GitHub CLI authentication..."
gh auth status || {
    echo "❌ Not authenticated. Run: gh auth login"
    exit 1
}
echo ""

# List open PRs
echo "→ Checking for open pull requests..."
gh pr list --state open
echo ""

# Function to merge a PR
merge_pr() {
    local pr_number=$1
    local merge_method=${2:-"merge"}  # merge, squash, or rebase

    echo "→ Attempting to merge PR #$pr_number..."

    # Check if PR exists
    if gh pr view $pr_number &> /dev/null; then
        # Try to merge the PR
        gh pr merge $pr_number --$merge_method --delete-branch --body "Merged via automated script" || {
            echo "⚠️  Failed to merge PR #$pr_number"
            echo "   It might already be merged or have conflicts"
        }
    else
        echo "⚠️  PR #$pr_number not found or already merged"
    fi
    echo ""
}

# Merge all PRs in order
echo "==================================="
echo "Merging all PRs..."
echo "==================================="
echo ""

# You can choose merge strategy: merge, squash, or rebase
MERGE_METHOD="merge"  # Change this if needed

merge_pr 1 $MERGE_METHOD  # Project Setup
merge_pr 2 $MERGE_METHOD  # Core Types & Utilities
merge_pr 3 $MERGE_METHOD  # TodoList Component
merge_pr 4 $MERGE_METHOD  # TodoItem Component
merge_pr 5 $MERGE_METHOD  # TodoForm Component
merge_pr 6 $MERGE_METHOD  # State Management
merge_pr 7 $MERGE_METHOD  # App Integration

echo "==================================="
echo "Merge process completed!"
echo "==================================="
echo ""

# Show merged PRs
echo "→ Merged pull requests:"
gh pr list --state merged --limit 7
echo ""

# Pull the latest changes
echo "→ Pulling latest changes from main..."
git checkout main
git pull origin main

echo ""
echo "✅ Done! Check your repository: https://github.com/iaminawe/todo-app-test"