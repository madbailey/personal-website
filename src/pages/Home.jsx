import { Link } from 'react-router-dom'
import { getAllStories } from '../utils/storyLoader'

import FlowingPattern from '../components/FlowingPattern'
import AsciiGradientMatrix from '../components/asciigradientmatrix'

// Get all stories from MDX files
const stories = getAllStories()

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero section with generous spacing and centered shader art */}
      <section className="flex flex-col items-center justify-center min-h-screen px-8 lg:px-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Minimal intro text with lots of breathing room */}
          <div className="mb-24">
            <h1 className="text-3xl md:text-3xl font-light tracking-wide mb-8 leading-relaxed" 
                style={{color: 'hsl(var(--foreground))'}}>
              sketchbook
            </h1>
          </div>
          <p> Short stories, essays, and other writings.</p>
          
          {/* Shader art as the centerpiece */}
          <div className="mb-24">
            <AsciiGradientMatrix />
          </div>
          
          {/* Minimal call to action */}
          <div className="space-y-4">
            <p className="text-xs font-light tracking-wider opacity-40" 
               style={{color: 'hsl(var(--foreground))'}}>
              ↓ Explore
            </p>
          </div>
        </div>
      </section>

      {/* Stories section with generous spacing */}
      <section className="px-8 lg:px-16 py-32">
        <div className="max-w-4xl mx-auto">
          {/* Minimal section header */}
          <div className="text-center mb-24">
            <h2 className="text-lg font-light tracking-wide opacity-80" 
                style={{color: 'hsl(var(--foreground))'}}>
              Recent writing
            </h2>
          </div>
          
          {/* Stories grid with more breathing room */}
          <div className="space-y-16">
            {stories.length > 0 ? (
              stories
                .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date, newest first
                .map((story) => (
                  <Link
                    key={story.slug}
                    to={`/story/${story.slug}`}
                    className="block group"
                  >
                    <article className="text-center hover:opacity-60 transition-all duration-500">
                      <h3 className="text-base font-light tracking-wide mb-3" 
                          style={{color: 'hsl(var(--foreground))'}}>
                        {story.title}
                      </h3>
                      {story.date && (
                        <p className="text-xs font-light tracking-wide opacity-50 mb-4" 
                           style={{color: 'hsl(var(--foreground))'}}>
                          {new Date(story.date).toLocaleDateString()}
                        </p>
                      )}
                      {story.excerpt && (
                        <p className="text-sm font-light leading-loose opacity-70 max-w-2xl mx-auto" 
                           style={{color: 'hsl(var(--foreground))'}}>
                          {story.excerpt}
                        </p>
                      )}
                    </article>
                  </Link>
                ))
            ) : (
              <div className="text-center py-16">
                <p className="text-sm font-light tracking-wide opacity-40" 
                   style={{color: 'hsl(var(--foreground))'}}>
                  Stories coming soon
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
} 