import { useParams } from 'react-router-dom';
import { useEffect, useState, Suspense, lazy } from 'react'; // Added Suspense and lazy
import { getStory } from '../utils/storyLoader';



const shaderComponents = {
  PineConeDelicate: lazy(() => import('../components/PineConeDelicate')),
  // Add more shaders here as needed
};

export default function Story() {
  const { slug } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStory() {
      setLoading(true);
      try {
        const storyData = await getStory(slug);
        setStory(storyData);
      } catch (error) {
        console.error("Failed to load story:", error);
        setStory(null); // Ensure story is null on error
      } finally {
        setLoading(false);
      }
    }

    loadStory();
  }, [slug]);

  if (loading) {
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

  const StoryComponent = story.component;
  // Get the specified shader component with better error handling
  const ShaderToRender = story.shaderComponent && shaderComponents[story.shaderComponent]
    ? shaderComponents[story.shaderComponent]
    : null;  // Instead of defaulting to a non-existent shader, we'll handle null case


  return (
    <div className="min-h-screen bg-album-bg"> {/* Ensure background color */}
      <div className="container mx-auto px-4 py-12 md:py-16"> {/* Overall container */}
        {/* 
          Desktop Layout: CSS Grid for two columns.
          - Text content in the left ~1/3 (or slightly more for readability).
          - Shader pinned to the right ~2/3 mark.
        */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 xl:gap-12"> {/* Using 12-column grid for flexibility */}
          
          {/* Left Column: Story Header & MDX Content */}
          <div className="lg:col-span-7 xl:col-span-6"> {/* Adjust col-span for desired text width */}
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

            {/* MDX Content - Styled with Prose */}
            <article className="prose prose-lg prose-album max-w-none 
                              prose-headings:font-serif prose-p:font-serif 
                              prose-p:text-album-dark-text prose-headings:text-album-dark-text
                              prose-a:text-album-green-dark hover:prose-a:text-album-green-light
                              prose-blockquote:border-album-green-light prose-blockquote:text-album-medium-text
                              dark:prose-invert dark:prose-p:text-gray-300 dark:prose-headings:text-gray-200"> 
                              {/* Using 'prose-album' variant from tailwind.config.js */}
              <StoryComponent />
            </article>
          </div>

          {/* Right Column: Sticky Shader Art */}
          {/* Hidden on smaller than lg screens by default, shown as lg:block */}
          <aside className="hidden lg:block lg:col-span-5 xl:col-span-6 lg:sticky lg:top-16 xl:top-20 h-screen-minus-header max-h-[calc(100vh-8rem)]">
            {/* The h-screen-minus-header and max-h are to prevent it from overlapping footer if you have one */}
            {/* Adjust 'top' value to position it relative to your header height */}
            <div className="w-full h-full flex items-center justify-center p-4">
              <div className="w-full aspect-9/16 max-w-md bg-neutral-800/10 rounded-md shadow-lg overflow-hidden">
                <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-album-medium-text">Loading Shader...</div>}>
                  {ShaderToRender ? (
                    <ShaderToRender />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-album-medium-text">
                      No shader specified or shader not found
                    </div>
                  )}
                </Suspense>
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile: Shader could be here, above or below text, if not integrated differently */}
        <div className="lg:hidden mt-12 mb-8 px-4">
          <div className="w-full aspect-9/16 max-w-md mx-auto bg-neutral-800/10 rounded-md shadow-lg overflow-hidden">
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-album-medium-text">Loading Shader...</div>}>
              {ShaderToRender ? (
                <ShaderToRender />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-album-medium-text">
                  No shader specified or shader not found
                </div>
              )}
            </Suspense>
          </div>
        </div>

      </div>
    </div>
  );
}