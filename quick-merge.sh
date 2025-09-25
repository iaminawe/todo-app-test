#!/bin/bash

# Quick merge script
cd /Users/greggcoppen/Work/spec-driven/todo-app-test

echo "Quick merge: feature/project-setup → main"
echo "========================================="

# Ensure we're on main
git checkout main

# Merge the feature branch
git merge feature/project-setup --no-ff -m "Merge feature/project-setup into main

Complete Todo App MVP implementation with all features

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to remote
git push origin main

echo ""
echo "✅ Done! Merged and pushed to GitHub"
echo "View at: https://github.com/iaminawe/todo-app-test"