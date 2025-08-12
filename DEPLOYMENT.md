# Deployment Guide

This project uses GitHub Actions for automated CI/CD deployment to GitHub Pages.

## How It Works

The CI/CD pipeline is configured to deploy your website automatically when you push code to specific branches:

- **`deploy`** branch: Triggers deployment to GitHub Pages
- **`production`** branch: Also triggers deployment to GitHub Pages

## Deployment Process

### Automatic Deployment (Recommended)

1. **Make your changes** on the `main` branch
2. **Test locally** using `npm run dev`
3. **Create and switch to deploy branch**:
   ```bash
   git checkout -b deploy
   # or if deploy branch already exists:
   git checkout deploy
   git merge main
   ```
4. **Push to trigger deployment**:
   ```bash
   git push origin deploy
   ```

The GitHub Actions workflow will automatically:
- Install dependencies
- Run ESLint to check code quality
- Build the application
- Deploy to GitHub Pages

### Manual Local Deployment

If you prefer to deploy manually (requires `gh-pages` package):

```bash
npm install -g gh-pages
npm run deploy
```

## First Time Setup

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**

### 2. Create Deploy Branch

```bash
git checkout -b deploy
git push -u origin deploy
git checkout main
```

## Monitoring Deployments

- **GitHub Actions**: Check the "Actions" tab in your repository to monitor deployment status
- **Deployment URL**: Your site will be available at `https://yourusername.github.io/personal-website/`
- **Status Badge**: Add this to your README for deployment status:
  ```markdown
  ![Deploy Status](https://github.com/yourusername/personal-website/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)
  ```

## Troubleshooting

### Common Issues

1. **Build Fails**: Check the Actions tab for error details, usually linting or build errors
2. **404 on Deployment**: Ensure the base path in `vite.config.js` matches your repository name
3. **Assets Not Loading**: Check that all asset paths are relative

### Rollback

To rollback to a previous version:
1. Find the commit hash of the working version
2. Reset the deploy branch: `git reset --hard <commit-hash>`
3. Force push: `git push --force origin deploy`

## Branch Strategy

- **`main`**: Development work, no automatic deployment
- **`deploy`**: Production-ready code that triggers deployment
- **`production`**: Alternative branch for deployment (optional)

## Environment Variables

The build process automatically sets:
- `NODE_ENV=production` during deployment
- Base path configured for GitHub Pages

## Performance

The deployment includes:
- Automatic asset optimization
- Code splitting
- Minification
- Gzip compression (handled by GitHub Pages)
