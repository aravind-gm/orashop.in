/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ORA Brand Colors (STRICT - DO NOT CHANGE)
        primary: {
          DEFAULT: '#FFD6E8', // Baby Pink
          dark: '#FFC0DB',
          light: '#FFE8F0',
        },
        background: {
          DEFAULT: '#FDFBF7', // Ivory
          white: '#FFFFFF',
        },
        text: {
          primary: '#2D2D2D', // Charcoal
          secondary: '#6B6B6B',
          muted: '#A0A0A0',
        },
        accent: {
          DEFAULT: '#D4AF77', // Muted Gold
        },
        border: {
          DEFAULT: '#E8E8E8',
        },
        error: '#D88B8B',
        success: '#A8D5BA',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'serif'],
        sans: ['Inter', 'Montserrat', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'display-md': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['2rem', { lineHeight: '1.3' }],
      },
      spacing: {
        '2xs': '0.25rem',
        'xs': '0.5rem',
        'sm': '1rem',
        'md': '1.5rem',
        'lg': '2rem',
        'xl': '3rem',
        '2xl': '4rem',
        '3xl': '6rem',
      },
      borderRadius: {
        'luxury': '8px',
      },
      boxShadow: {
        'luxury': '0 4px 20px rgba(0, 0, 0, 0.04)',
        'luxury-hover': '0 8px 30px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        skeleton: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
};
