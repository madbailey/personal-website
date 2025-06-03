import matter from 'gray-matter'

// This will be populated with all story modules
const storyModules = import.meta.glob('../content/*.mdx', { eager: true })

// Parse frontmatter and create story index
export const stories = {}

for (const path in storyModules) {
  const module = storyModules[path]
  const slug = path.replace('../content/', '').replace('.mdx', '')
  
  stories[slug] = {
    component: module.default,
    ...module.frontmatter
  }
}

// Debug: Log all loaded stories
console.log('Loaded stories:', Object.keys(stories));

export function getStory(slug) {
  if (stories[slug]) {
    return stories[slug];
  }
  console.error(`Story not found: ${slug}`);
  return null;
}

export function getAllStories() {
  return Object.entries(stories).map(([slug, story]) => ({
    slug,
    ...story
  }))
} 