export default function About() {
    return (
      <div className="min-h-screen px-8 lg:px-16 py-32">
        <div className="max-w-2xl mx-auto">
          {/* Minimal page header */}
          <div className="text-center mb-24">
            <h1 className="text-2xl md:text-3xl font-light tracking-wide mb-8 leading-relaxed" 
                style={{color: 'hsl(var(--foreground))'}}>
              About
            </h1>
          </div>
          
          {/* Content with generous spacing */}
          <div className="space-y-12">
            <div className="text-center mb-16">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 rounded-full mx-auto mb-8 float-subtle opacity-60"></div>
            </div>
  
            <div className="space-y-8 text-sm font-light leading-loose" style={{color: 'hsl(var(--foreground))'}}>
              <p className="opacity-80">
                This is a quiet corner of the internet where I collect short stories, 
                fragments, and experiments in digital narrative.
              </p>
  
              <p className="opacity-80">
                Each piece is accompanied by visual elements—generative art, subtle 
                animations, or interactive experiences—that aim to enhance rather 
                than distract from the reading experience.
              </p>
  
              <p className="opacity-80">
                The site itself is an ongoing experiment in minimal design and 
                thoughtful typography, built with React and animated with Three.js 
                and canvas-based generative art.
              </p>
  
              <div className="py-8">
                <div className="h-px bg-current opacity-10 max-w-32 mx-auto"></div>
              </div>
  
              <p className="opacity-60 text-xs tracking-wide text-center">
                A space for stories to breathe
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }