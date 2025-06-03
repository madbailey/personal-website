import {Link, useLocation} from 'react-router-dom'
import {useState, useEffect} from 'react'

export default function Layout({ children }) {
    const [darkMode, setDarkMode] = useState(false)
    const [scrolled, setScrolled] = useState(false)
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

const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    if (newMode) {
        document.documentElement.classList.add('data-theme', 'dark')
        localStorage.setItem('theme', 'dark')
    } else {
        document.documentElement.classList.remove('data-theme', 'dark')
        localStorage.setItem('theme', 'light')
    }
}

return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Enhanced Navigation with backdrop blur and scroll effects */}
      <nav className={`fixed top-0 left-0 right-0 z-50 ${
        scrolled 
          ? 'bg-white/40 dark:bg-black/40 backdrop-blur-sm border-b border-gray-200/10 dark:border-gray-800/10' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 lg:px-16 py-4">
          {/* Logo/Home link */}
          <Link 
            to="/" 
            className="font-light tracking-wide hover:opacity-60 transition-opacity duration-200"
            style={{color: 'hsl(var(--foreground))'}}
          >
            Madelyn
          </Link>

          {/* Navigation links */}
          <div className="flex items-center space-x-12">
            <Link 
              to="/" 
              className={`text-sm font-light tracking-wide hover:opacity-60 transition-opacity duration-200 ${
                location.pathname === '/' ? 'opacity-100' : 'opacity-70'
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
      </nav>

      {/* Main content with top padding for fixed nav */}
      <main className="pt-24">
        {children}
      </main>

      {/* Minimal Footer */}
      <footer className="py-16 px-8 lg:px-16 mt-32">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs font-light tracking-wide opacity-40" style={{color: 'hsl(var(--foreground))'}}>
            © 2025
          </p>
        </div>
      </footer>
    </div>
  )
}