import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState, Suspense, lazy } from 'react';
import { getStory } from '../utils/storyLoader';
import { ErrorBoundary } from 'react-error-boundary';

const shaderComponents = {
  PineConeDelicate: lazy(() => import('../components/PineConeDelicate')),
  AnalogCube: lazy(() => import('../components/AnalogCube')),
  EmotionalDepth: lazy(() => import('../components/EmotionalDepth')),
  WashingOff: lazy(() => import('../components/WashingOff')),
  // Add more shaders here as needed
};

// Debug component to track MDX rendering
function MDXDebug({ component: Component, slug }) {
  useEffect(() => {
    console.log(`[MDXDebug] Mounting MDX component for slug: ${slug}`);
    return () => console.log(`[MDXDebug] Unmounting MDX component for slug: ${slug}`);
  }, [slug]);

  return <Component />;
}

function StoryContent() {
  const { slug } = useParams();
  const location = useLocation();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Add scroll handler for window
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    console.log(`[Story] Location changed:`, location);
    console.log(`[Story] Current slug:`, slug);
    setKey(prev => prev + 1); // Force remount on navigation
  }, [location, slug]);

  useEffect(() => {
    console.log(`[Story] Loading story for slug:`, slug);
    setLoading(true);
    try {
      const storyData = getStory(slug);
      console.log(`[Story] Story data loaded:`, storyData);
      setStory(storyData);
    } catch (error) {
      console.error("[Story] Error loading story:", error);
      setStory(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    console.log(`[Story] Rendering loading state for slug:`, slug);
    return (
      <div className="flex items-center justify-center min-h-screen bg-album-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-album-green-dark mx-auto"></div>
          <p className="text-album-medium-text mt-4">Loading story...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    console.log(`[Story] No story found for slug:`, slug);
    return (
      <div className="flex items-center justify-center min-h-screen bg-album-bg">
        <div className="text-center max-w-lg p-8">
          <h1 className="text-3xl font-serif text-album-dark-text mb-3">
            Story Not Found
          </h1>
          <p className="text-album-medium-text">
            Oops! We couldn't find the story you're looking for. It might have wandered off into the digital woods.
          </p>
          <a href="/" className="mt-6 inline-block px-6 py-2 bg-album-green-dark text-white rounded-sm hover:bg-album-green-light transition-colors">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  console.log(`[Story] Rendering story for slug:`, slug);
  const StoryComponent = story.component;
  const ShaderToRender = story.shaderComponent && shaderComponents[story.shaderComponent]
    ? shaderComponents[story.shaderComponent]
    : null;

  return (
    <div key={key} className="min-h-screen bg-album-bg">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 xl:gap-12">
          {/* Left Column: Story Header & MDX Content */}
          <div className="lg:col-span-7 xl:col-span-6">
            <header className="mb-10 md:mb-16">
              <h1 className="text-4xl md:text-5xl font-serif font-light text-album-dark-text mb-3 leading-tight">
                {story.title}
              </h1>
              {story.date && (
                <time className="text-sm text-album-medium-text font-sans">
                  {new Date(story.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
              )}
              {story.excerpt && (
                <p className="mt-6 text-lg font-serif italic text-album-medium-text leading-relaxed">
                  {story.excerpt}
                </p>
              )}
            </header>

            <article className="prose prose-lg prose-album max-w-none 
                            prose-headings:font-serif prose-p:font-serif 
                            prose-p:text-album-dark-text prose-headings:text-album-dark-text
                            prose-a:text-album-green-dark hover:prose-a:text-album-green-light
                            prose-blockquote:border-album-green-light prose-blockquote:text-album-medium-text
                            dark:prose-invert dark:prose-p:text-gray-300 dark:prose-headings:text-gray-200">
              <ErrorBoundary fallback={<div>Error loading story content</div>}>
                <Suspense fallback={<div>Loading story content...</div>}>
                  <MDXDebug component={StoryComponent} slug={slug} />
                </Suspense>
              </ErrorBoundary>
            </article>
          </div>

          {/* Right Column: Sticky Shader Art */}
          <aside className="hidden lg:block lg:col-span-5 xl:col-span-6 lg:sticky lg:top-16 xl:top-20 h-screen-minus-header max-h-[calc(100vh-8rem)]">
            <div className="w-full h-full flex items-center justify-center p-4">
              <div className="w-full aspect-9/16 max-w-md  overflow-hidden">
                <ErrorBoundary fallback={<div>Error loading shader</div>}>
                  <Suspense fallback={<div className="w-full h-full flex items-center shadow-lg justify-center text-album-medium-text">Loading Shader...</div>}>
                    {ShaderToRender ? (
                      <ShaderToRender scrollProgress={scrollProgress} />
                    ) : (
                      <div className="w-full h-full flex items-center shadow-lg justify-center text-album-medium-text">
                        No shader specified or shader not found
                      </div>
                    )}
                  </Suspense>
                </ErrorBoundary>
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile Shader */}
        <div className="lg:hidden mt-12 mb-8 px-4">
          <div className="w-full aspect-9/16 max-w-md mx-auto  overflow-hidden">
            <ErrorBoundary fallback={<div>Error loading shader</div>}>
              <Suspense fallback={<div className="w-full h-full flex items-center shadow-lg justify-center text-album-medium-text">Loading Shader...</div>}>
                {ShaderToRender ? (
                  <ShaderToRender scrollProgress={scrollProgress} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-album-medium-text">
                    No shader specified or shader not found
                  </div>
                )}
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Story component with error boundary
export default function Story() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong loading the story</div>}>
      <StoryContent />
    </ErrorBoundary>
  );
}
