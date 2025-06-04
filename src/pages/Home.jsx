import { Link } from 'react-router-dom'
import { getAllStories } from '../utils/storyLoader'
import React, { Suspense, lazy } from 'react';

// import FlowingPattern from '../components/FlowingPattern' // Not used directly, can be removed if not needed elsewhere or for other reasons
const AsciiGradientMatrix = lazy(() => import('../components/asciigradientmatrix'));

// Get all stories from MDX files
const stories = getAllStories()

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
      {/* Hero section with generous spacing and centered shader art */}
      <section className="flex flex-col items-center justify-center min-h-screen px-4 md:px-8 lg:px-16 relative">
        {/* Decorative ASCII-inspired elements - hidden on mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[hsla(150,60%,80%,0.03)] to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[hsla(150,60%,80%,0.03)] to-transparent"></div>
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-32 h-full bg-gradient-to-r from-[hsla(150,60%,80%,0.03)] to-transparent"></div>
          <div className="absolute top-1/2 -translate-y-1/2 right-0 w-32 h-full bg-gradient-to-l from-[hsla(150,60%,80%,0.03)] to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full relative">
          {/* Title and intro */}
          <div className="text-center mb-8 md:mb-12 relative">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[hsla(150,60%,80%,0.2)] to-transparent"></div>
            <h1 className="text-2xl md:text-3xl font-extralight tracking-wider mb-4 leading-relaxed relative" 
                style={{
                  color: 'hsl(var(--foreground))',
                  textShadow: '0 0 30px hsla(150,60%,80%,0.1)'
                }}>
              Veiled Ignorance
            </h1>
            <p className="font-extralight tracking-wider text-sm opacity-80 relative">
              Short stories, essays, and other writings.
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-[hsla(150,60%,80%,0.2)] to-transparent"></span>
            </p>
          </div>

          {/* Mobile Stories Above Shader */}
          <div className="md:hidden space-y-6 mb-8">
            {stories.length > 0 && stories
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 2)
              .map((story, index) => (
                <Link
                  key={story.slug}
                  to={`/story/${story.slug}`}
                  className="block group"
                >
                  <article className="relative p-4 rounded-lg hover:bg-foreground/5 group-hover:shadow-[0_0_15px_hsla(150,60%,80%,0.05)] border border-foreground/5">
                    {index === 0 && (
                      <div className="absolute -right-1 top-1/2 w-1.5 h-1.5 rounded-full bg-[hsla(150,60%,80%,0.4)] animate-pulse"></div>
                    )}
                    <h3 className={`tracking-wide mb-2 ${index === 0 ? 'text-lg font-normal' : 'text-base font-light'}`} 
                        style={{color: 'hsl(var(--foreground))'}}>
                      {story.title}
                    </h3>
                    {story.excerpt && (
                      <p className="text-xs font-extralight tracking-wide opacity-60 italic" 
                         style={{color: 'hsl(var(--foreground))'}}>
                        {story.excerpt}
                      </p>
                    )}
                  </article>
                </Link>
              ))}
          </div>

          {/* Main content area with shader and stories */}
          <div className="relative flex flex-col md:flex-row items-center md:items-start">
            {/* Desktop Left side stories */}
            <div className="hidden md:block w-1/3 space-y-32 pt-52 pr-8 relative">
              {stories.length > 0 && stories
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .filter((_, index) => index % 2 === 0)
                .map((story, index) => (
                  <Link
                    key={story.slug}
                    to={`/story/${story.slug}`}
                    className={`block group relative z-20 ${index === 0 ? 'latest-post' : ''}`}
                    style={{ marginTop: `${index * 8}rem` }}
                  >
                    <article className="text-right hover:opacity-100 transition-all duration-300 relative p-4 rounded-lg hover:bg-foreground/5 group-hover:shadow-[0_0_15px_hsla(150,60%,80%,0.05)]">
                      {index === 0 && (
                        <div className="absolute -right-1 top-1/2 w-1.5 h-1.5 rounded-full bg-[hsla(150,60%,80%,0.4)] animate-pulse"></div>
                      )}
                      <div className={`absolute right-0 top-1/2 w-24 h-px transform translate-x-full group-hover:w-32 transition-all duration-300 ${index === 0 ? 'bg-[hsla(150,60%,80%,0.3)] group-hover:bg-[hsla(150,60%,80%,0.4)]' : 'bg-foreground/20 group-hover:bg-foreground/30'}`} 
                           style={{ transform: 'translateX(100%)' }}></div>
                      <div className={`absolute right-0 top-1/2 w-3 h-3 rounded-full transform translate-x-full -translate-y-1/2 transition-all duration-300 ${index === 0 ? 'bg-[hsla(150,60%,80%,0.3)] group-hover:bg-[hsla(150,60%,80%,0.4)]' : 'bg-foreground/20 group-hover:bg-foreground/40'}`} 
                           style={{ transform: 'translateX(calc(100% + 0.5rem)) translateY(-50%)' }}></div>
                      <h3 className={`tracking-wide mb-2 group-hover:translate-x-[-4px] transition-transform duration-300 ${index === 0 ? 'text-xl font-normal' : 'text-lg font-light'}`} 
                          style={{color: 'hsl(var(--foreground))'}}>
                        {story.title}
                      </h3>
                      {story.excerpt && (
                        <p className="text-xs font-extralight tracking-wide opacity-60 max-w-[200px] ml-auto italic" 
                           style={{color: 'hsl(var(--foreground))'}}>
                          {story.excerpt}
                        </p>
                      )}
                    </article>
                  </Link>
                ))}
            </div>

            {/* Center shader art */}
            <div className="w-full md:w-3/5 md:-ml-16 relative z-10" style={{ minHeight: '600px', height: '60vh', maxHeight: '900px' }}>
              <Suspense fallback={<div className="flex justify-center items-center h-full text-sm opacity-50">Loading art...</div>}>
                <AsciiGradientMatrix />
              </Suspense>
            </div>

            {/* Desktop Right side stories */}
            <div className="hidden md:block w-1/3 space-y-32 pt-48 pl-8 relative">
              {stories.length > 0 && stories
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .filter((_, index) => index % 2 === 1)
                .map((story, index) => (
                  <Link
                    key={story.slug}
                    to={`/story/${story.slug}`}
                    className={`block group relative z-20 ${index === 0 ? 'latest-post' : ''}`}
                    style={{ marginTop: `${index * 8}rem` }}
                  >
                    <article className="text-left hover:opacity-100 transition-all duration-300 relative p-4 rounded-lg hover:bg-foreground/5 group-hover:shadow-[0_0_15px_hsla(150,60%,80%,0.05)]">
                      {index === 0 && (
                        <div className="absolute -left-1 top-1/2 w-1.5 h-1.5 rounded-full bg-[hsla(150,60%,80%,0.4)] animate-pulse"></div>
                      )}
                      <div className={`absolute left-0 top-1/2 w-24 h-px transform -translate-x-full group-hover:w-32 transition-all duration-300 ${index === 0 ? 'bg-[hsla(150,60%,80%,0.3)] group-hover:bg-[hsla(150,60%,80%,0.4)]' : 'bg-foreground/20 group-hover:bg-foreground/30'}`}></div>
                      <div className={`absolute left-0 top-1/2 w-3 h-3 rounded-full transform -translate-x-full -translate-y-1/2 transition-all duration-300 ${index === 0 ? 'bg-[hsla(150,60%,80%,0.3)] group-hover:bg-[hsla(150,60%,80%,0.4)]' : 'bg-foreground/20 group-hover:bg-foreground/40'}`} 
                           style={{ transform: 'translateX(calc(-100% - 0.5rem)) translateY(-50%)' }}></div>
                      <h3 className={`tracking-wide mb-2 group-hover:translate-x-[4px] transition-transform duration-300 ${index === 0 ? 'text-xl font-normal' : 'text-lg font-light'}`} 
                          style={{color: 'hsl(var(--foreground))'}}>
                        {story.title}
                      </h3>
                      {story.excerpt && (
                        <p className="text-xs font-extralight tracking-wide opacity-60 max-w-[200px] italic" 
                           style={{color: 'hsl(var(--foreground))'}}>
                          {story.excerpt}
                        </p>
                      )}
                    </article>
                  </Link>
                ))}
            </div>

            {/* Mobile Stories Below Shader */}
            <div className="md:hidden space-y-6 mt-8">
              {stories.length > 0 && stories
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(2, 4)
                .map((story, index) => (
                  <Link
                    key={story.slug}
                    to={`/story/${story.slug}`}
                    className="block group"
                  >
                    <article className="relative p-4 rounded-lg hover:bg-foreground/5 group-hover:shadow-[0_0_15px_hsla(150,60%,80%,0.05)] border border-foreground/5">
                      <h3 className="tracking-wide mb-2 text-base font-light" 
                          style={{color: 'hsl(var(--foreground))'}}>
                        {story.title}
                      </h3>
                      {story.excerpt && (
                        <p className="text-xs font-extralight tracking-wide opacity-60 italic" 
                           style={{color: 'hsl(var(--foreground))'}}>
                          {story.excerpt}
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