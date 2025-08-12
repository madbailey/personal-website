# Personal Website

Personal Website made with React website built with Vite, featuring MDX content, Three.js components, and Tailwind CSS styling.

![Deploy Status](https://github.com/madbailey/personal-website/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)

## Features

- **React + Vite**: Fast development and optimized builds
- **MDX Support**: Write content in Markdown with React components
- **Three.js Integration**: Interactive 3D components and shaders
- **Tailwind CSS**: Utility-first styling
- **Automated CI/CD**: GitHub Actions deployment to GitHub Pages

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS with forms and typography plugins
- **Content**: MDX with frontmatter support
- **3D Graphics**: Three.js
- **Routing**: React Router DOM
- **Build Tools**: Vite, ESLint, PostCSS

## Development

### Prerequisites

- Node.js 18 or higher
- npm

### Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/madbailey/personal-website.git
   cd personal-website
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run deploy:ci` - Run linting and build (used in CI)

## Deployment

This project uses automated CI/CD with GitHub Actions. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deployment

1. Make changes on the `main` branch
2. Test locally with `npm run dev`
3. Switch to deploy branch: `git checkout deploy && git merge main`
4. Push to trigger deployment: `git push origin deploy`

Your site will be automatically deployed to GitHub Pages.

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── AnalogCube.jsx
│   ├── ShaderArt.jsx
│   └── ...
├── pages/              # Page components
│   ├── Home.jsx
│   ├── About.jsx
│   └── Story.jsx
├── content/            # MDX content files
│   ├── digital-dreams.mdx
│   └── ...
├── assets/             # Static assets
│   └── media/          # Video and image files
└── utils/              # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm run lint`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## License

This project is private and not licensed for public use.
