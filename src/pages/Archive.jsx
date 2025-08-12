import { Link } from 'react-router-dom'
import { getAllStories } from '../utils/storyLoader'

export default function Archive() {
  const stories = getAllStories()
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="min-h-screen bg-album-bg">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-light text-album-dark-text mb-4">
            Archive
          </h1>
        </header>

        <div className="max-w-4xl mx-auto">
          {stories.length > 0 ? (
            <div className="space-y-8">
              {stories.map((story, index) => (
                <Link
                  key={story.slug}
                  to={`/story/${story.slug}`}
                  className="block group"
                >
                  <article className="border-b border-album-green-light/20 pb-8 hover:bg-album-green-light/5 rounded-lg p-6 -m-6 transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <h2 className="text-2xl md:text-3xl font-serif font-light text-album-dark-text group-hover:text-album-green-dark transition-colors duration-300">
                        {story.title}
                      </h2>
                      {story.date && (
                        <time className="text-sm text-album-medium-text font-sans mt-2 md:mt-0 md:ml-4 flex-shrink-0">
                          {new Date(story.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </time>
                      )}
                    </div>
                    
                    {story.excerpt && (
                      <p className="text-album-medium-text leading-relaxed mb-4 font-serif italic">
                        {story.excerpt}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-album-green-dark group-hover:text-album-green-light transition-colors duration-300">
                        Read story →
                      </span>
                      
                      {story.shaderComponent && (
                        <span className="text-xs text-album-medium-text bg-album-green-light/10 px-2 py-1 rounded-full">
                          Interactive
                        </span>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-album-medium-text text-lg">
                No stories found. Check back soon for new content.
              </p>
            </div>
          )}
        </div>
        
        <footer className="mt-16 text-center">
          <Link 
            to="/" 
            className="inline-block px-6 py-3 bg-album-green-dark text-white rounded-sm hover:bg-album-green-light transition-colors duration-300"
          >
            ← Back to Home
          </Link>
        </footer>
      </div>
    </div>
  )
}