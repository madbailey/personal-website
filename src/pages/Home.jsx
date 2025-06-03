import { Link } from 'react-router-dom'
import { getAllStories } from '../utils/storyLoader'
import React, { Suspense, lazy } from 'react';

// import FlowingPattern from '../components/FlowingPattern' // Not used directly, can be removed if not needed elsewhere or for other reasons
const AsciiGradientMatrix = lazy(() => import('../components/asciigradientmatrix'));

// Get all stories from MDX files
const stories = getAllStories()

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero section with generous spacing and centered shader art */}
      <section className="flex flex-col items-center justify-center min-h-screen px-8 lg:px-16">
        <div className="max-w-7xl mx-auto w-full relative">
          {/* Title and intro */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-3xl font-extralight tracking-wider mb-4 leading-relaxed" 
                style={{color: 'hsl(var(--foreground))'}}>
              Veiled Ignorance
            </h1>
            <p className="font-extralight tracking-wider text-sm opacity-80"> Short stories, essays, and other writings.</p>
          </div>

          {/* Main content area with shader and stories */}
          <div className="relative flex items-start">
            {/* Left side stories */}
            <div className="w-1/3 space-y-32 pt-32 pr-8 relative">
              {stories.length > 0 && stories
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .filter((_, index) => index % 2 === 0)
                .map((story, index) => (
                  <Link
                    key={story.slug}
                    to={`/story/${story.slug}`}
                    className="block group relative z-20"
                    style={{ marginTop: `${index * 8}rem` }}
                  >
                    <article className="text-right hover:opacity-60 transition-all duration-500 relative">
                      <div className="absolute right-0 top-1/2 w-16 h-px bg-foreground/10 transform translate-x-full" 
                           style={{ transform: 'translateX(100%)' }}></div>
                      <div className="absolute right-0 top-1/2 w-2 h-2 rounded-full bg-foreground/10 transform translate-x-full -translate-y-1/2" 
                           style={{ transform: 'translateX(calc(100% + 0.5rem)) translateY(-50%)' }}></div>
                      <h3 className="text-sm font-extralight tracking-wide mb-2" 
                          style={{color: 'hsl(var(--foreground))'}}>
                        {story.title}
                      </h3>
                      {story.date && (
                        <p className="text-xs font-extralight tracking-wide opacity-50" 
                           style={{color: 'hsl(var(--foreground))'}}>
                          {new Date(story.date).toLocaleDateString()}
                        </p>
                      )}
                    </article>
                  </Link>
                ))}
            </div>

            {/* Center shader art - offset to the left */}
            <div className="w-3/5 -ml-16 relative z-10" style={{ minHeight: '900px' }}>
              <Suspense fallback={<div className="flex justify-center items-center h-full text-sm opacity-50">Loading art...</div>}>
                <AsciiGradientMatrix />
              </Suspense>
            </div>

            {/* Right side stories - positioned to be visible */}
            <div className="w-1/3 space-y-32 pt-48 pl-8 relative">
              {stories.length > 0 && stories
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .filter((_, index) => index % 2 === 1)
                .map((story, index) => (
                  <Link
                    key={story.slug}
                    to={`/story/${story.slug}`}
                    className="block group relative z-20"
                    style={{ marginTop: `${index * 8}rem` }}
                  >
                    <article className="text-left hover:opacity-60 transition-all duration-500 relative">
                      <div className="absolute left-0 top-1/2 w-16 h-px bg-foreground/10 transform -translate-x-full"></div>
                      <div className="absolute left-0 top-1/2 w-2 h-2 rounded-full bg-foreground/10 transform -translate-x-full -translate-y-1/2" 
                           style={{ transform: 'translateX(calc(-100% - 0.5rem)) translateY(-50%)' }}></div>
                      <h3 className="text-sm font-extralight tracking-wide mb-2" 
                          style={{color: 'hsl(var(--foreground))'}}>
                        {story.title}
                      </h3>
                      {story.date && (
                        <p className="text-xs font-extralight tracking-wide opacity-50" 
                           style={{color: 'hsl(var(--foreground))'}}>
                          {new Date(story.date).toLocaleDateString()}
                        </p>
                      )}
                    </article>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 