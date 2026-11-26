import type { Config } from 'tailwindcss';

const v = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Admin panel > Settings > Theme theke change hoy
        leaf: v('primary'), // mehedi pata — main color
        stain: v('accent'), // mehedi-r rong — price, highlight
        haldi: v('highlight'), // holud — CTA button
        mist: v('bg'), // halka sobuj background
        ink: v('text'),
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      container: { center: true, padding: { DEFAULT: '1.25rem', md: '2rem' }, screens: { '2xl': '1180px' } },
      keyframes: {
        rise: { from: { opacity: '0', transform: 'translateY(18px)' }, to: { opacity: '1', transform: 'none' } },
        draw: { from: { strokeDashoffset: '1200' }, to: { strokeDashoffset: '0' } },
      },
      animation: {
        rise: 'rise .7s cubic-bezier(.2,.7,.2,1) both',
        draw: 'draw 2.4s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
