/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        accent: {
          DEFAULT: '#2563EB', // blue
          500: '#2563EB',
          600: '#1D4ED8'
        },
        cyanAccent: '#0284C7',
        slateCustom: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          300: '#CBD5E1',
          500: '#64748B',
          700: '#334155',
          900: '#0F172A'
        }
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px'
      },
      boxShadow: {
        soft: '0 6px 18px rgba(16,24,40,0.06)',
        mdSoft: '0 8px 24px rgba(16,24,40,0.08)'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}