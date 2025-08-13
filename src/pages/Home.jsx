import { Link } from 'react-router-dom'
import { getAllStories } from '../utils/storyLoader'
import React, { Suspense, lazy, useState, useEffect } from 'react';

// import FlowingPattern from '../components/FlowingPattern' // Not used directly, can be removed if not needed elsewhere or for other reasons
const AsciiGradientMatrix = lazy(() => import('../components/asciigradientmatrix'));
const MobileShader = lazy(() => import('../components/MobileShader'));

// Get all stories from MDX files
const stories = getAllStories()

// Hash function to map story slug to more interesting hue values
const hashStringToHue = (str) => {
  if (!str) return 155; // default sea-green
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Create more interesting color palettes with distinct ranges
  const colorPalettes = [
    [280, 320], // Purple to magenta
    [200, 240], // Blue to indigo
    [340, 20],  // Red to pink (wraps around)
    [45, 75],   // Orange to yellow
    [120, 160], // Green to teal
    [180, 220], // Cyan to blue
    [300, 340], // Magenta to red
    [60, 90],   // Yellow to lime
  ];
  
  // Select palette based on hash
  const paletteIndex = Math.abs(hash) % colorPalettes.length;
  const [minHue, maxHue] = colorPalettes[paletteIndex];
  
  // Handle wrap-around for red-pink palette
  if (maxHue < minHue) {
    const range = (360 - minHue) + maxHue;
    const offset = Math.abs(hash) % range;
    return offset <= (360 - minHue) ? minHue + offset : offset - (360 - minHue);
  }
  
  // Normal range calculation
  const range = maxHue - minHue;
  return minHue + (Math.abs(hash) % range);
};

export default function Home() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [hoveredStory, setHoveredStory] = useState(null);
  const [accentHue, setAccentHue] = useState(155);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStoryHover = (storySlug) => {
    setHoveredStory(storySlug);
    setIsTransitioning(true);
    
    // Smooth color transition with 1 second duration
    const targetHue = hashStringToHue(storySlug);
    const startHue = accentHue;
    const startTime = Date.now();
    const duration = 1000; // 1 second
    
    const animateHue = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth transition
      const easedProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
      
      // Calculate shortest path between hues (handles wrap-around)
      let diff = targetHue - startHue;
      if (Math.abs(diff) > 180) {
        diff = diff > 0 ? diff - 360 : diff + 360;
      }
      
      const currentHue = startHue + (diff * easedProgress);
      setAccentHue(((currentHue % 360) + 360) % 360); // Normalize to 0-360
      
      if (progress < 1) {
        requestAnimationFrame(animateHue);
      } else {
        setIsTransitioning(false);
      }
    };
    
    requestAnimationFrame(animateHue);
  };

  const handleStoryLeave = () => {
    setHoveredStory(null);
    setIsTransitioning(true);
    
    // Smooth transition back to default
    const targetHue = 155; // default sea-green
    const startHue = accentHue;
    const startTime = Date.now();
    const duration = 1000; // 1 second
    
    const animateHue = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth transition
      const easedProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
      
      // Calculate shortest path between hues (handles wrap-around)
      let diff = targetHue - startHue;
      if (Math.abs(diff) > 180) {
        diff = diff > 0 ? diff - 360 : diff + 360;
      }
      
      const currentHue = startHue + (diff * easedProgress);
      setAccentHue(((currentHue % 360) + 360) % 360); // Normalize to 0-360
      
      if (progress < 1) {
        requestAnimationFrame(animateHue);
      } else {
        setIsTransitioning(false);
      }
    };
    
    requestAnimationFrame(animateHue);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 overflow-x-hidden">
      {/* Hero section with reduced spacing */}
      <section className="flex flex-col items-center justify-center min-h-[65vh] px-4 sm:px-8 lg:px-16 relative py-8 sm:py-12">
        {/* Decorative ASCII-inspired elements - hidden on mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[hsla(150,60%,80%,0.03)] to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[hsla(150,60%,80%,0.03)] to-transparent"></div>
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-32 h-full bg-gradient-to-r from-[hsla(150,60%,80%,0.03)] to-transparent"></div>
          <div className="absolute top-1/2 -translate-y-1/2 right-0 w-32 h-full bg-gradient-to-l from-[hsla(150,60%,80%,0.03)] to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full relative">
          {/* Title and intro with improved typography */}
          <div className="text-center mb-6 sm:mb-8 md:mb-12 relative">
            <div className="absolute -top-2 sm:-top-4 left-1/2 -translate-x-1/2 w-20 sm:w-32 h-px bg-gradient-to-r from-transparent via-[hsla(150,60%,80%,0.2)] to-transparent"></div>
            <h1
              className="site-title text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 relative"
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
            <p className="font-extralight tracking-wide text-sm sm:text-base opacity-70 relative mb-2 sm:mb-4">
              Short stories, essays, and other writings.
              <span className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-[hsla(150,60%,80%,0.2)] to-transparent"></span>
            </p>
          </div>

          {/* Mobile Stories Unified List - Show 3 most recent */}
          <div className="md:hidden space-y-4 sm:space-y-6 mb-6 sm:mb-8">
            {stories.length > 0 && stories
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 3)
              .map((story, index) => (
                <Link
                  key={story.slug}
                  to={`/story/${story.slug}`}
                  className={`block group relative ${index === 0 ? 'overflow-hidden rounded-lg' : ''}`}
                  onMouseEnter={() => handleStoryHover(story.slug)}
                  onMouseLeave={handleStoryLeave}
                >
                  {index === 0 && (
                    <div className="absolute inset-0 z-0">
                      <Suspense fallback={<div className="w-full h-full bg-foreground/6" />}>
                        <MobileShader />
                      </Suspense>
                    </div>
                  )}
                  <article className={`relative p-4 sm:p-6 rounded-lg transition-all duration-1000 ${
                    index === 0 
                      ? 'bg-foreground/5 backdrop-blur-[2px] hover:bg-foreground/10 min-h-[120px] sm:min-h-[140px] flex flex-col justify-center p-12 sm:p-8 hover:scale-[1.01] hover:backdrop-blur-[3px] active:scale-[0.99] cursor-pointer' 
                      : 'hover:bg-foreground/5 border border-foreground/5'
                  }`}>
                    {index === 0 && (
                      <div className="absolute -right-1 top-1/2 w-1.5 h-1.5 rounded-full bg-[hsla(150,60%,80%,0.4)] animate-pulse z-10"></div>
                    )}
                    <h3 className={`tracking-wide mb-1 sm:mb-2 relative z-10 ${
                      index === 0 ? 'text-lg sm:text-xl font-medium text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]' : 'text-sm sm:text-base font-extralight'
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
            {/* Desktop Left side stories - Show 3 most recent, filter for left side */}
            <div className="hidden md:block w-1/10 lg:w-1/8 xl:w-1/6 space-y-16 pt-20 pr-2 lg:pr-4 relative">
              {stories.length > 0 && stories
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 3)
                .filter((_, index) => index % 2 === 0)
                .map((story, index) => (
                  <Link
                    key={story.slug}
                    to={`/story/${story.slug}`}
                    className={`block group relative z-20 ${index === 0 ? 'latest-post' : ''}`}
                    style={{ marginTop: `${index * 4}rem` }}
                    onMouseEnter={() => handleStoryHover(story.slug)}
                    onMouseLeave={handleStoryLeave}
                  >
                    <article className="text-right transition-all duration-1000 relative p-6 rounded-lg group-hover:scale-[1.02] group-hover:bg-foreground/3 group-hover:backdrop-blur-sm transform-gpu">
                      {index === 0 && (
                        <div className="absolute -right-2 top-1/2 w-2 h-2 rounded-full bg-[hsla(150,60%,80%,0.6)] animate-pulse"></div>
                      )}
                      <div className={`absolute right-0 top-1/2 w-0 h-px transform translate-x-full group-hover:w-16 transition-all duration-1000 delay-100 ${index === 0 ? 'bg-gradient-to-l from-[hsla(150,60%,80%,0.6)] to-transparent' : 'bg-gradient-to-l from-foreground/30 to-transparent'}`} 
                           style={{ transform: 'translateX(100%)' }}></div>
                      <h3 className={`tracking-wide mb-2 group-hover:translate-x-[-4px] transition-transform duration-1000 ${index === 0 ? 'text-xl font-light' : 'text-lg font-extralight'}`} 
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

            {/* Center shader art with expanded dimensions */}
            <div className="w-[calc(100vw-2rem)] sm:w-[calc(100vw-4rem)] md:w-4/5 lg:w-3/4 xl:w-2/3 relative z-10 mx-auto hidden md:block" 
                 style={{ 
                   minHeight: '700px',
                   height: '75vh',
                   maxHeight: '900px',
                   maxWidth: 'none'
                 }}>
              <div className="w-full h-full">
                <Suspense fallback={<div className="flex justify-center items-center h-full text-xs sm:text-sm opacity-50">Loading art...</div>}>
                  <AsciiGradientMatrix hoveredStory={hoveredStory} accentHue={accentHue} />
                </Suspense>
              </div>
            </div>

            {/* Desktop Right side stories - Show 3 most recent, filter for right side */}
            <div className="hidden md:block w-1/10 lg:w-1/8 xl:w-1/6 space-y-16 pt-24 pl-2 lg:pl-4 relative">
              {stories.length > 0 && stories
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 3)
                .filter((_, index) => index % 2 === 1)
                .map((story, index) => (
                  <Link
                    key={story.slug}
                    to={`/story/${story.slug}`}
                    className={`block group relative z-20 ${index === 0 ? 'latest-post' : ''}`}
                    style={{ marginTop: `${index * 4}rem` }}
                    onMouseEnter={() => handleStoryHover(story.slug)}
                    onMouseLeave={handleStoryLeave}
                  >
                    <article className="text-left transition-all duration-1000 relative p-6 rounded-lg group-hover:scale-[1.02] group-hover:bg-foreground/3 group-hover:backdrop-blur-sm transform-gpu">
                      {index === 0 && (
                        <div className="absolute -left-2 top-1/2 w-2 h-2 rounded-full bg-[hsla(150,60%,80%,0.6)] animate-pulse"></div>
                      )}
                      <div className={`absolute left-0 top-1/2 w-0 h-px transform -translate-x-full group-hover:w-16 transition-all duration-1000 delay-100 ${index === 0 ? 'bg-gradient-to-r from-[hsla(150,60%,80%,0.6)] to-transparent' : 'bg-gradient-to-r from-foreground/30 to-transparent'}`}></div>
                      <h3 className={`tracking-wide mb-2 group-hover:translate-x-[4px] transition-transform duration-1000 ${index === 0 ? 'text-xl font-light' : 'text-lg font-extralight'}`} 
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

          {/* View All Stories Link */}
          <div className="text-center mt-12 md:mt-16">
            <Link 
              to="/archive"
              className="inline-block px-6 py-3 border border-[hsla(150,60%,80%,0.2)] rounded-lg hover:bg-[hsla(150,60%,80%,0.05)] transition-all duration-300 group"
            >
              <span className="text-sm font-extralight tracking-wide opacity-70 group-hover:opacity-100" style={{color: 'hsl(var(--foreground))'}}>
                View All Stories →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 