import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';
import typographyPlugin from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,json,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // West 52 BBQ Brand Colors
        primary: 'var(--aw-color-primary)',
        secondary: 'var(--aw-color-secondary)',
        accent: 'var(--aw-color-accent)',
        default: 'var(--aw-color-text-default)',
        muted: 'var(--aw-color-text-muted)',

        // Direct brand color utilities
        'burnt-orange': '#FF6633',
        'charcoal': '#2B2B2B',
        'steel-gray': '#8B8D8E',
        'brick-red': '#C84B31',
        'off-white': '#F5F5F5',
      },
      fontFamily: {
        sans: ['var(--aw-font-sans, ui-sans-serif)', ...defaultTheme.fontFamily.sans],
        serif: ['var(--aw-font-serif, ui-serif)', ...defaultTheme.fontFamily.serif],
        heading: ['var(--aw-font-heading, ui-sans-serif)', ...defaultTheme.fontFamily.sans],
      },

      lineHeight: {
        tighter: '1.1',
      },

      animation: {
        fade: 'fadeInUp 1s both',
      },

      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(2rem)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    typographyPlugin,
    plugin(({ addVariant, addUtilities }) => {
      addVariant('intersect', '&:not([no-intersect])');

      // Add custom intersection observer utilities
      addUtilities({
        '.intersect-once': {
          'data-intersect-once': 'true',
        },
        '.intersect-quarter': {
          'data-intersect-threshold': '0.25',
        },
        '.intersect-no-queue': {
          'data-intersect-no-queue': 'true',
        },
      });
    }),
  ],
  darkMode: 'class',
};
