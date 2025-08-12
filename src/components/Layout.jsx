import {Link, useLocation} from 'react-router-dom'
import {useState, useEffect} from 'react'

export default function Layout({ children }) {
    const [darkMode, setDarkMode] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const location = useLocation()

useEffect (() => {
    //check for saved theme
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
        setDarkMode(true)
        document.documentElement.classList.add('data-theme', 'dark')
    } 
}, [])

// Add scroll listener to change nav appearance
useEffect(() => {
    const handleScroll = () => {
        setScrolled(window.scrollY > 50)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
}, [])


return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Enhanced Navigation with mobile menu */}
      <nav className={`fixed top-0 left-0 right-0 z-50 ${
        scrolled 
          ? 'bg-white/40 dark:bg-black/40 backdrop-blur-sm border-b border-gray-200/10 dark:border-gray-800/10' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-8 lg:px-16 py-4">
          {/* Logo/Home link */}
          <Link 
            to="/" 
            className="font-light tracking-wide hover:opacity-60 transition-opacity duration-200 text-lg sm:text-base"
            style={{color: 'hsl(var(--foreground))'}}
          >
            Madelyn
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -mr-2 rounded-lg hover:bg-foreground/5 transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span className={`w-full h-px bg-current transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-full h-px bg-current transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-full h-px bg-current transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>

          {/* Desktop Navigation links */}
          <div className="hidden md:flex items-center space-x-12">
            <Link 
              to="/archive" 
              className={`text-sm font-light tracking-wide hover:opacity-60 transition-opacity duration-200 ${
                location.pathname === '/archive' ? 'opacity-100' : 'opacity-70'
              }`}
              style={{color: 'hsl(var(--foreground))'}}
            >
              Archive
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-light tracking-wide hover:opacity-60 transition-opacity duration-200 ${
                location.pathname === '/about' ? 'opacity-100' : 'opacity-70'
              }`}
              style={{color: 'hsl(var(--foreground))'}}
            >
              About
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-black/95 backdrop-blur-sm border-b border-gray-200/10 dark:border-gray-800/10 transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}>
          <div className="px-4 py-4 space-y-4">
            <Link 
              to="/archive" 
              className={`block text-base font-light tracking-wide hover:opacity-60 transition-opacity duration-200 ${
                location.pathname === '/archive' ? 'opacity-100' : 'opacity-70'
              }`}
              style={{color: 'hsl(var(--foreground))'}}
              onClick={() => setMobileMenuOpen(false)}
            >
              Archive
            </Link>
            <Link 
              to="/about" 
              className={`block text-base font-light tracking-wide hover:opacity-60 transition-opacity duration-200 ${
                location.pathname === '/about' ? 'opacity-100' : 'opacity-70'
              }`}
              style={{color: 'hsl(var(--foreground))'}}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content with adjusted top padding for mobile */}
      <main className="pt-16 sm:pt-24">
        {children}
      </main>

      {/* Minimal Footer with adjusted padding */}
      <footer className="py-8 sm:py-16 px-4 sm:px-8 lg:px-16 mt-16 sm:mt-32">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs font-light tracking-wide opacity-40" style={{color: 'hsl(var(--foreground))'}}>
            © 2025
          </p>
        </div>
      </footer>
    </div>
  )
}