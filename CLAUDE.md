# Personal Website - CLAUDE.md

## Project Overview

This is a personal website/blog built with React + Vite, featuring MDX content support, Three.js shader integration, and elegant Tailwind CSS styling. The site combines technical storytelling with interactive 3D visuals.

### Core Features
- **MDX Blog System**: Write rich content in Markdown with embedded React components
- **Interactive Shaders**: Three.js shader components that respond to scroll progress
- **Responsive Design**: Mobile-first design with elegant typography
- **Automated Deployment**: GitHub Actions CI/CD to GitHub Pages

### Technical Stack
- React 18 + Vite (fast development)
- MDX with frontmatter support
- Three.js for 3D graphics
- Tailwind CSS with custom color scheme
- React Router for navigation
- Gray Matter for frontmatter parsing

## Content Strategy & Blog Ideas

### Current Content Analysis
You have 3 existing blog posts:

1. **"Growth Spiral"** (2025-05-23) - A compelling dystopian tech narrative about a struggling blogger named Micah
2. **"Take People at Their Word"** (2025-06-01) - A thoughtful essay on interpreting intentions without over-analyzing
3. **"layout-example.mdx"** - Template/example file

### Content Themes Identified
- **Tech Commentary**: Critical perspectives on AI, tech culture, and digital society
- **Social Psychology**: Human behavior, intentions, and communication
- **Narrative Fiction**: Character-driven stories with tech/society themes
- **Creative Expression**: Combining writing with interactive visual elements

### Blog Post Ideas

#### Tech & Society Commentary
- "The Authenticity Trap in AI Art" - exploring genuine creativity vs. generated content
- "Digital Minimalism vs. FOMO Culture" - personal experiments with reduced screen time  
- "The Economics of Attention in 2025" - how social platforms monetize focus
- "Why Everyone Became a 'Creator'" - the gig economy's impact on identity
- "The Death of Forums and Rise of Algorithmic Discovery"

#### Personal Essays & Philosophy  
- "Learning to Be Bored Again" - rediscovering focus and deep thinking
- "The Case for Deleting Nothing" - digital hoarding as memory preservation
- "Why I Don't Have Opinions About Everything" - the value of intellectual humility
- "The Tyranny of Productivity Culture" - questioning optimization mindset
- "On Being Wrong in Public" - embracing intellectual vulnerability

#### Interactive/Technical Projects
- "Building a Shader That Responds to Your Heartbeat" (with live demo)
- "Visualizing My Digital Footprint" - data art from personal analytics
- "The Sound of Code" - converting programming patterns to music
- "A Love Letter to CSS Grid" - interactive layout explorations
- "Teaching AI to Write Like Me" - experiments with fine-tuning

#### Short Fiction/Creative
- "The Last Human Customer Service Rep" - sci-fi workplace comedy
- "Unsubscribe" - thriller about email list manipulation
- "The Algorithm Whisperer" - person who can communicate with recommendation systems
- "Ghost in the Git Log" - mysterious commits appearing in open source projects
- "The Influencer's Paradox" - fame vs. authenticity in digital spaces

#### Meta/Process Posts
- "How I Choose What to Write About" - creative process documentation
- "The Tools I Use to Think" - note-taking, research, and idea management
- "Why I Blog Instead of Tweet" - long-form vs. micro-content
- "Reader Questions Answered" - community engagement
- "Failed Blog Post Ideas" - transparency about creative struggles

### Content Calendar Suggestions

**Weekly Schedule:**
- Monday: Personal essays/philosophy
- Wednesday: Tech commentary/analysis  
- Friday: Creative projects/fiction
- Monthly: Interactive shader experiments

**Seasonal Themes:**
- Q1: "Digital Detox Experiments" 
- Q2: "AI and Creativity Series"
- Q3: "The Future of Work" 
- Q4: "Year in Review + Predictions"

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run deploy:ci` - CI deployment (lint + build)

## Content Creation Workflow

### Adding New Blog Posts
1. Create new `.mdx` file in `src/content/`
2. Add frontmatter with required fields:
   ```yaml
   ---
   title: "Your Post Title"
   slug: "your-post-slug" 
   date: "2025-01-15"
   excerpt: "Brief description..."
   shaderComponent: "ComponentName" # optional
   ---
   ```
3. Write content in Markdown with optional React components
4. Test locally with `npm run dev`
5. Deploy via Git workflow

### Available Shader Components
- `AnalogCube` - Animated 3D cube with vintage aesthetic
- `PineConeDelicate` - Organic, nature-inspired patterns  
- Add new shaders in `src/components/` and register in `Story.jsx`

### Deployment Process
1. Work on `main` branch
2. Test changes locally
3. Switch to `deploy` branch: `git checkout deploy && git merge main`  
4. Push to trigger deployment: `git push origin deploy`

## Project Goals

- **Quality over Quantity**: Focus on thoughtful, well-crafted posts rather than high frequency
- **Technical Innovation**: Combine writing with interactive elements and visual art
- **Authentic Voice**: Maintain personal perspective while exploring universal themes
- **Community Building**: Create content that sparks meaningful discussion
- **Skill Development**: Use the blog as a laboratory for new technologies and ideas

## Notes for Claude

- **Content Style**: The existing posts show preference for narrative storytelling, social commentary, and philosophical reflection
- **Technical Integration**: Each post can have an associated shader component for visual enhancement
- **Tone**: Thoughtful, sometimes critical, but not preachy - focused on exploration rather than definitive answers
- **Audience**: Likely tech-savvy individuals interested in the intersection of technology, creativity, and society