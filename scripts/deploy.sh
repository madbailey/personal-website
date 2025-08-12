#!/bin/bash

# Deployment script for personal website
# This script helps automate the deployment process

set -e

echo "🚀 Starting deployment process..."

# Check if we're on main branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo "⚠️  Warning: You're not on the main branch. Current branch: $current_branch"
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled."
        exit 1
    fi
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  You have uncommitted changes. Please commit or stash them first."
    git status --porcelain
    exit 1
fi

# Run linting
echo "🔍 Running linter..."
npm run lint

# Run build test
echo "🔨 Testing build..."
npm run build

echo "✅ Build successful!"

# Switch to deploy branch
echo "🔄 Switching to deploy branch..."
if git show-ref --verify --quiet refs/heads/deploy; then
    git checkout deploy
    echo "📥 Merging main into deploy..."
    git merge main
else
    echo "🆕 Creating deploy branch..."
    git checkout -b deploy
fi

# Push to trigger deployment
echo "📤 Pushing to trigger deployment..."
git push origin deploy

echo "✅ Deployment triggered! Check GitHub Actions for progress."
echo "🌐 Your site will be available at: https://madbailey.github.io/personal-website/"

# Switch back to main
git checkout main

echo "🎉 Deployment process complete!"
