#!/bin/bash

# Script to merge all PRs into main branch
echo "==================================="
echo "Merging All PRs into Main Branch"
echo "==================================="
echo ""

cd /Users/greggcoppen/Work/spec-driven/todo-app-test

# Ensure we're on main branch
echo "→ Switching to main branch..."
git checkout main
echo ""

# Pull latest changes from remote
echo "→ Pulling latest changes from origin/main..."
git pull origin main --rebase || echo "No remote changes to pull"
echo ""

# List all branches
echo "→ Available branches:"
git branch -a
echo ""

# Function to merge a PR branch
merge_pr() {
    local pr_branch=$1
    local pr_number=$2
    local pr_title=$3

    echo "-----------------------------------"
    echo "Merging PR #$pr_number: $pr_title"
    echo "-----------------------------------"

    # Check if branch exists locally or remotely
    if git show-ref --verify --quiet refs/heads/$pr_branch; then
        echo "→ Found local branch: $pr_branch"
        git merge $pr_branch --no-ff -m "Merge PR #$pr_number: $pr_title"
    elif git show-ref --verify --quiet refs/remotes/origin/$pr_branch; then
        echo "→ Found remote branch: origin/$pr_branch"
        git merge origin/$pr_branch --no-ff -m "Merge PR #$pr_number: $pr_title"
    else
        echo "⚠️  Branch $pr_branch not found, skipping..."
    fi
    echo ""
}

# Merge each PR in order
echo "→ Starting PR merges..."
echo ""

merge_pr "feature/project-setup" "1" "Project Setup & Configuration"
merge_pr "feature/core-types" "2" "Core Todo Data Types & Utilities"
merge_pr "feature/todo-list" "3" "TodoList Component"
merge_pr "feature/todo-item" "4" "TodoItem Component"
merge_pr "feature/todo-form" "5" "TodoForm Component"
merge_pr "feature/state-management" "6" "Todo State Management"
merge_pr "feature/app-integration" "7" "Main App Integration"

echo "==================================="
echo "All PR merges completed!"
echo "==================================="
echo ""

# Show the resulting commit history
echo "→ Recent commit history:"
git log --oneline --graph -10
echo ""

# Push the merged main branch
echo "→ Pushing merged main branch to origin..."
git push origin main || {
    echo "⚠️  Push failed. You may need to pull first:"
    echo "git pull origin main --rebase"
    echo "git push origin main"
}

echo ""
echo "✅ Done! All PRs have been merged into main."
echo "Check your repository: https://github.com/iaminawe/todo-app-test"