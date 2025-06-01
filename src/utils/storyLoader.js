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

export async function getStory(slug) {
  // For dynamic imports (if not using eager loading)
  try {
    const module = await import(`../content/${slug}.mdx`)
    return {
      component: module.default,
      ...module.frontmatter
    }
  } catch (error) {
    console.error(`Story not found: ${slug}`, error)
    return null
  }
}

export function getAllStories() {
  return Object.entries(stories).map(([slug, story]) => ({
    slug,
    ...story
  }))
} 