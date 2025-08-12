@echo off
setlocal enabledelayedexpansion

echo 🚀 Starting deployment process...

REM Check for uncommitted changes
git diff-index --quiet HEAD --
if errorlevel 1 (
    echo ⚠️  You have uncommitted changes. Please commit or stash them first.
    git status --porcelain
    exit /b 1
)

REM Run linting
echo 🔍 Running linter...
call npm run lint
if errorlevel 1 (
    echo ❌ Linting failed!
    exit /b 1
)

REM Run build test
echo 🔨 Testing build...
call npm run build
if errorlevel 1 (
    echo ❌ Build failed!
    exit /b 1
)

echo ✅ Build successful!

REM Get current branch
for /f "tokens=*" %%i in ('git branch --show-current') do set current_branch=%%i

REM Check if we're on main branch
if not "%current_branch%"=="main" (
    echo ⚠️  Warning: You're not on the main branch. Current branch: %current_branch%
    set /p continue="Do you want to continue? (y/N): "
    if /i not "!continue!"=="y" (
        echo ❌ Deployment cancelled.
        exit /b 1
    )
)

REM Check if deploy branch exists
git show-ref --verify --quiet refs/heads/deploy
if errorlevel 1 (
    echo 🆕 Creating deploy branch...
    git checkout -b deploy
) else (
    echo 🔄 Switching to deploy branch...
    git checkout deploy
    echo 📥 Merging main into deploy...
    git merge main
)

REM Push to trigger deployment
echo 📤 Pushing to trigger deployment...
git push origin deploy

echo ✅ Deployment triggered! Check GitHub Actions for progress.
echo 🌐 Your site will be available at: https://madbailey.github.io/personal-website/

REM Switch back to main
git checkout main

echo 🎉 Deployment process complete!
pause
