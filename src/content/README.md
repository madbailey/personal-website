# Content Directory

This directory contains your stories as MDX files. MDX allows you to write in Markdown while embedding React components, JavaScript, and interactive elements.

## Creating a New Story

1. Create a new `.mdx` file in this directory
2. Add frontmatter at the top with metadata
3. Write your content in Markdown
4. Embed React components and JavaScript as needed

### Example Structure

```mdx
---
title: "My Story Title"
slug: "my-story-slug"
date: "2024-01-01"
excerpt: "A brief description of your story..."
---

import SomeComponent from '../components/SomeComponent'

# Your Story

Write your content here in **Markdown**.

<SomeComponent />

You can also embed JavaScript:

```javascript
const example = "This code will be syntax highlighted"
```

## Available Components

### ShaderCanvas
For embedding interactive shaders:

```jsx
<ShaderCanvas 
  fragmentShader={`
    // Your GLSL fragment shader code
  `}
  width={400}
  height={300}
/>
```

### Custom Components
You can import any React component from the `../components/` directory and use it in your stories.

## Frontmatter Fields

- `title`: The story title (required)
- `slug`: URL slug (required, should match filename)
- `date`: Publication date
- `excerpt`: Brief description for previews
- Any other custom fields you want

## Features

- Full Markdown support with GitHub Flavored Markdown
- Syntax highlighting for code blocks
- React component embedding
- JavaScript execution
- Custom styling with Tailwind CSS
- Three.js shader support
- Interactive elements 