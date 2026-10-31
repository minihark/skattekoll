/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      colors: {
        nordic: {
          bg: '#F8F7F4',
          card: '#FFFFFF',
          ink: '#111827',
          muted: '#4B5563',
          hairline: '#E5E2DA',
          border: '#D1CDC2',
          spruce: '#14532D',
          'spruce-light': '#F0FDF4',
          'spruce-border': '#BBF7D0',
          navy: '#1E3A8A',
          'navy-light': '#EFF6FF',
          'navy-border': '#BFDBFE',
          plum: '#581C87',
          'plum-light': '#FAF5FF',
          'plum-border': '#E9D5FF',
        },
      },
    },
  },
  plugins: [],
}
