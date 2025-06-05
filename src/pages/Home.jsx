import { Link } from 'react-router-dom'
import { getAllStories } from '../utils/storyLoader'
import React, { Suspense, lazy, useState, useEffect } from 'react';

// import FlowingPattern from '../components/FlowingPattern' // Not used directly, can be removed if not needed elsewhere or for other reasons
const AsciiGradientMatrix = lazy(() => import('../components/asciigradientmatrix'));
const MobileShader = lazy(() => import('../components/MobileShader'));

// Get all stories from MDX files
const stories = getAllStories()

export default function Home() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 overflow-x-hidden">
      {/* Hero section with adjusted spacing for mobile */}
      <section className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-8 lg:px-16 relative">
        {/* Decorative ASCII-inspired elements - hidden on mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[hsla(150,60%,80%,0.03)] to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[hsla(150,60%,80%,0.03)] to-transparent"></div>
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-32 h-full bg-gradient-to-r from-[hsla(150,60%,80%,0.03)] to-transparent"></div>
          <div className="absolute top-1/2 -translate-y-1/2 right-0 w-32 h-full bg-gradient-to-l from-[hsla(150,60%,80%,0.03)] to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full relative">
          {/* Title and intro with adjusted spacing */}
          <div className="text-center mb-2 sm:mb-6 md:mb-10 relative pt-2">
            <div className="absolute -top-2 sm:-top-8 left-1/2 -translate-x-1/2 w-20 sm:w-32 h-px bg-gradient-to-r from-transparent via-[hsla(150,60%,80%,0.2)] to-transparent"></div>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-wide mb-2 sm:mb-4 leading-tight relative"
              style={{
                color: 'hsl(var(--foreground))',
                textShadow: '0 2px 24px hsla(150,60%,80%,0.18), 0 0 2px hsla(150,60%,80%,0.10)'
              }}
            >
              Veiled Ignorance
            </h1>
            <div className="flex justify-center mb-2">
              <span className="block w-10 h-1 rounded-full bg-gradient-to-r from-[hsla(150,60%,80%,0.18)] via-[hsla(150,60%,80%,0.25)] to-transparent"></span>
            </div>
            <p className="font-extralight tracking-wider text-xs sm:text-sm opacity-80 relative mb-1 sm:mb-2">
              Short stories, essays, and other writings.
              <span className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-[hsla(150,60%,80%,0.2)] to-transparent"></span>
            </p>
          </div>

          {/* Mobile Stories Unified List - No above/below shader distinction */}
          <div className="md:hidden space-y-4 sm:space-y-6 mb-6 sm:mb-8">
            {stories.length > 0 && stories
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 4)
              .map((story, index) => (
                <Link
                  key={story.slug}
                  to={`/story/${story.slug}`}
                  className={`block group relative ${index === 0 ? 'overflow-hidden rounded-lg' : ''}`}
                >
                  {index === 0 && (
                    <div className="absolute inset-0 z-0">
                      <Suspense fallback={<div className="w-full h-full bg-foreground/6" />}>
                        <MobileShader />
                      </Suspense>
                    </div>
                  )}
                  <article className={`relative p-4 sm:p-6 rounded-lg transition-all duration-300 ${
                    index === 0 
                      ? 'bg-foreground/5 backdrop-blur-[2px] hover:bg-foreground/10 min-h-[120px] sm:min-h-[140px] flex flex-col justify-center p-12 sm:p-8 hover:scale-[1.025] hover:shadow-xl hover:backdrop-blur-[3px] active:scale-[0.98] cursor-pointer' 
                      : 'hover:bg-foreground/5 group-hover:shadow-[0_0_15px_hsla(150,60%,80%,0.05)] border border-foreground/5'
                  }`}>
                    {index === 0 && (
                      <div className="absolute -right-1 top-1/2 w-1.5 h-1.5 rounded-full bg-[hsla(150,60%,80%,0.4)] animate-pulse z-10"></div>
                    )}
                    <h3 className={`tracking-wide mb-1 sm:mb-2 relative z-10 ${
                      index === 0 ? 'text-lg sm:text-xl font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]' : 'text-sm sm:text-base font-light'
                    }`}>
                      {story.title}
                    </h3>
                    {story.excerpt && (
                      <p className={`text-[11px] sm:text-xs font-extralight tracking-wide italic relative z-10 ${index === 0 ? 'text-white/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.18)]' : 'opacity-60'}`}>
                        {story.excerpt}
                      </p>
                    )}
                  </article>
                </Link>
              ))}
          </div>

          {/* Main content area with responsive shader */}
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

            {/* Center shader art with responsive dimensions */}
            <div className="w-[calc(100vw-2rem)] sm:w-[calc(100vw-4rem)] md:w-3/5 md:-ml-16 relative z-10 mx-auto hidden md:block" 
                 style={{ 
                   // Desktop height constraints
                   '@media (minWidth: 768px)': {
                     minHeight: '600px',
                     height: '60vh',
                     maxHeight: '900px'
                   },
                   maxWidth: 'none'
                 }}>
              <div className="w-full h-full">
                <Suspense fallback={<div className="flex justify-center items-center h-full text-xs sm:text-sm opacity-50">Loading art...</div>}>
                  <AsciiGradientMatrix />
                </Suspense>
              </div>
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
          </div>
        </div>
      </section>
    </div>
  )
} 