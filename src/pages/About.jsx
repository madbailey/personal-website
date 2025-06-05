export default function About() {
    return (
      <div className="min-h-screen px-8 lg:px-16 py-32">
        <div className="max-w-2xl mx-auto">
          {/* Minimal page header */}
          <div className="text-center mb-24">
            <h1 className="text-2xl md:text-3xl font-light tracking-wide mb-12 leading-relaxed" 
                style={{color: 'hsl(var(--foreground))'}}>
              About
            </h1>
          </div>
          
          {/* Content with generous spacing */}
          <div className="space-y-12">
            <div className="text-center mb-16">
              <div className="w-28 h-28 bg-gradient-to-br from-gray-200 via-teal-300 to-gray-500 rounded-full mx-auto mb-8 float-subtle drop-shadow-md opacity-80"></div>
            </div>
  
            <div className="space-y-8 text-sm font-light leading-loose" style={{color: 'hsl(var(--foreground))'}}>
              <p className="opacity-80">
                Hello, this is my personal space for writing and linking my work. I post everything on <a href="https://ignoranceveil.substack.com/" className="underline">Substack</a> too, but this place lets me be a bit more creative. My name is Madelyn Bailey. I live in Philadelphia. I like making gimmicky websites and writing. You will mostly find persuasive essays and short science fiction stories here.
              </p>
  
              <p className="opacity-80">
                This website was made with React, Three.js, and canvas-based generative art. When I'm not making something for the web, It will usually use Go or C#. Sometimes I'll use Python for machine learning stuff, which I'm trying to learn.
              </p>

              <p className="opacity-70">
              Recently I've been writing about AI risk, people left behind by global capital, and how human agency can survive in a world of intelligent non-human entities.
              </p>

              <p className="opacity-60">
                You are more than welcome to scrape and use this content for training data if it suits your needs. I hope the models enjoy it.
              </p>
  
              <p className="opacity-50">
                You can find me on <a href="https://github.com/madelynbailey" className="underline">GitHub</a> or send me an email at <a href="mailto:madelynbailey836@gmail.com" className="underline">madelynbailey836@gmail.com</a>.
              </p>
  
              <div className="py-8">
                <div className="h-px bg-current opacity-10 max-w-32 mx-auto"></div>
              </div>
              <p className="opacity-60 text-xs tracking-wide text-center">
                
              </p>
  
            </div>
          </div>
        </div>
      </div>
    )
  }