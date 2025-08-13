// tailwind.config.js
import typography from '@tailwindcss/typography'; // Add this import

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: ['class', '[data-theme="dark"]'],
    theme: {
        extend: {
            fontFamily: {
                'serif': ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
                'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
                'mono': ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace'],
                'display': ['Playfair Display', 'Georgia', 'serif'],
            },
            colors: {
                // --- ADOPTING THE HSL CUSTOM PROPERTY APPROACH ---
                // This makes it easy to switch themes (e.g., dark mode) by just changing the HSL values in CSS
                'background': 'hsl(var(--background))',
                'foreground': 'hsl(var(--foreground))',
                'card': 'hsl(var(--card))',
                'card-foreground': 'hsl(var(--card-foreground))',
                'primary': 'hsl(var(--primary))',
                'primary-foreground': 'hsl(var(--primary-foreground))',
                'secondary': 'hsl(var(--secondary))',
                'secondary-foreground': 'hsl(var(--secondary-foreground))',
                'muted': 'hsl(var(--muted))',
                'muted-foreground': 'hsl(var(--muted-foreground))',
                'accent': 'hsl(var(--accent))',
                'accent-foreground': 'hsl(var(--accent-foreground))',
                'border': 'hsl(var(--border))',
                'input': 'hsl(var(--input))',
                'ring': 'hsl(var(--ring))',

                // Specific custom colors from the example for text/backgrounds
                'vivid-background': 'var(--vivid-background)', // used for body background
                'vivid-foreground': 'var(--vivid-foreground)', // used for body text
                'dull-background': 'var(--dull-background)',
                'dull-foreground': 'var(--dull-foreground)',
                'race-background': 'var(--race-background)', // specific accent color
                'slowdown-background': 'var(--slowdown-background)', // specific accent color

                // Your existing accent and neutral could map to the HSL variables
                // No need for these if you fully adopt the HSL var system
                // 'custom-accent-500': '#f59e0b',
                // 'custom-neutral-700': '#404040',
            },
            spacing: {
                // Keep your custom spacing or adjust
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
                'toc-margin': '10px', // For the TOC margin
                'grid-gap-xl': '32px', // For the main grid gaps
            },
            maxWidth: {
                'reading': '65ch', // Excellent, keep this for your main content
                '8xl': '88rem',
                '9xl': '96rem',
                'content-col': '700px', // From the example grid
                'graphic-col': '430px', // From the example grid
            },
            fontSize: {
                // Manually define specific font sizes to match the example's precise hierarchy
                // These will be used for your custom CSS if not using @typography for everything
                'base': '1.4rem', // For paragraphs, similar to '1.4rem' from eb8e0ea56b7a3d7c.css
                'lg': '1.125rem', // Default Tailwind text-lg
                'xl': '1.25rem', // Default Tailwind text-xl
                '2xl': '1.5rem', // Default Tailwind text-2xl
                '3xl': '1.875rem', // Default Tailwind text-3xl
                '4xl': '2.25rem', // Default Tailwind text-4xl
                '5xl': '2.625rem', // Approx 42px
                '6xl': '3.2rem', // From h1 in eb8e0ea56b7a3d7c.css (68px)
                // Add more custom font sizes from the example CSS if needed
                'custom-h1': '68px',
                'custom-h2': '2.2rem',
                'custom-h3': '1.7rem',
                'custom-h4': '1.5rem',
                'custom-h5': '1.3rem',
                'custom-paragraph': '1.4rem',
                'custom-footnote': '1.1rem',
            },
            lineHeight: {
                // Match the example's line heights
                'reading': '2rem', // From eb8e0ea56b7a3d7c.css for paragraphs
                'tight': '1.2', // Default Tailwind
                'normal': '1.5', // Default Tailwind
            },
            // Custom breakpoints to match the example's container logic
            // Note: Tailwind's default md is 768px, example has 930px.
            // Use their exact values or adjust based on preference.
            screens: {
                'sm': '640px',
                'md': '930px', // Custom breakpoint from example
                'lg': '1024px',
                'xl': '1280px',
                '2xl': '1536px',
                '3xl': '1601px', // Custom breakpoint from example
            },
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: '65ch', // Your good base reading width
                        color: 'hsl(var(--foreground))', // Use HSL variable
                        lineHeight: '2rem', // Apply the reading line height
                        p: {
                            // Adjust paragraph margins to match the example
                            // The example uses 1.4rem (22.4px)
                            marginTop: '1.4rem',
                            marginBottom: '1.4rem',
                            textAlign: 'justify', // If you want justified text
                        },
                        'h1': {
                            fontSize: '68px', // Directly apply from example
                            marginTop: '0',
                            marginBottom: '1.5rem',
                            lineHeight: '1',
                            fontWeight: '400',
                            fontFamily: 'var(--font-et-book), var(--font-serif)', // Use your custom font
                            color: 'hsl(var(--foreground))',
                        },
                        'h2': {
                            fontSize: '2.2rem',
                            marginTop: '5rem',
                            marginBottom: '2rem',
                            lineHeight: '1',
                            fontWeight: '400',
                            fontFamily: 'var(--font-et-book), var(--font-serif)',
                            color: 'hsl(var(--foreground))',
                        },
                        'h3': {
                            fontSize: '1.7rem',
                            marginTop: '2rem',
                            marginBottom: '1.4rem',
                            lineHeight: '1',
                            fontWeight: '400',
                            fontFamily: 'var(--font-et-book), var(--font-serif)',
                            fontStyle: 'italic',
                            color: 'hsl(var(--foreground))',
                        },
                        'h4': {
                            fontSize: '1.5rem',
                            marginTop: '1.3rem',
                            marginBottom: '1.1rem',
                            lineHeight: '1',
                            fontWeight: '400',
                            fontFamily: 'var(--font-et-book), var(--font-serif)',
                            fontStyle: 'italic',
                            color: 'hsl(var(--foreground))',
                        },
                        'h5': {
                            fontSize: '1.3rem',
                            marginTop: '1.1rem',
                            marginBottom: '.9rem',
                            lineHeight: '1',
                            fontWeight: '400',
                            fontFamily: 'var(--font-et-book), var(--font-serif)',
                            fontStyle: 'italic',
                            color: 'hsl(var(--foreground))',
                        },
                        'dl, ol, ul, summary': {
                            fontSize: '1.4rem', // Match paragraph font size
                            lineHeight: '2rem', // Match paragraph line height
                            listStyle: 'revert', // Allow default list styling
                        },
                        'li:not(:first-child)': {
                            marginTop: '.25rem', // Slight spacing between list items
                        },
                        'a': {
                            color: 'inherit', // Inherit text color
                            textDecoration: 'underline',
                            textDecorationSkipInk: 'auto',
                            textDecorationThickness: '1.5px',
                            textUnderlineOffset: '1.5px',
                            '&:hover': {
                                textDecorationThickness: 'from-font', // Nice touch from example
                            },
                        },
                        // Blockquote styles
                        blockquote: {
                            borderLeftColor: 'hsl(var(--primary))', // Use HSL variable
                            color: 'hsl(var(--foreground))', // Use HSL variable
                            // Example blockquote styles from eb8e0ea56b7a3d7c.css
                            fontSize: '1.4rem',
                            p: {
                                width: '100%',
                                marginRight: '40px', // This assumes some spacing outside the prose container
                                marginTop: '1.4rem',
                                marginBottom: '1.4rem',
                            },
                            footer: {
                                width: '100%',
                                fontSize: '1.1rem',
                                textAlign: 'right',
                                fontStyle: 'normal',
                            },
                            'footer > cite': {
                                fontStyle: 'italic',
                            }
                        },
                        // Figure and figcaption styles
                        figure: {
                            padding: '0',
                            border: '0',
                            fontSize: '100%',
                            font: 'inherit',
                            maxWidth: '100%',
                            margin: '0 0 3em', // Add margin below figures
                        },
                        figcaption: {
                            paddingTop: '1.5em',
                            top: '3.5em', // Relative positioning to align with content
                            fontSize: '1.1rem',
                            lineHeight: '1.6',
                            fontStyle: 'italic',
                            position: 'relative',
                            opacity: '.654',
                        },
                    },
                },
            },
            animation: {
                // Keep your custom animations
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.6s ease-out',
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                // Add the revealDown animation from the example
                'reveal-down': 'revealDown 1.5s ease-out forwards',
            },
            keyframes: {
                // Keep your keyframes
                fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
                slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
                float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-20px)' } },
                // Add the revealDown keyframe
                revealDown: {
                    '0%': { clipPath: 'inset(0 0 100% 0)', opacity: '1' },
                    '50%': { opacity: '.8', clipPath: 'inset(0 0 95% 0)' },
                    '100%': { clipPath: 'inset(0 0 0 0)', opacity: '1' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [
        typography, // Add typography plugin here
    ],
}