module.exports = {
    darkMode: 'class',
    content: ['./src/**/*.{astro,html,svelte,vue,js,ts,jsx,tsx}'],
    plugins: [require("@tailwindcss/typography")],
    theme: {
      extend: {
        colors: {
          'light-bg': '#f8f0e3',
          'light-text': '#2d3748',
          'light-primary': '#c44512',
          'light-secondary': '#4a5568',
          'dark-bg': '#1a1a1a',
          'dark-text': '#e2e8f0',
          'dark-primary': '#e58a4e',
          'dark-secondary': '#718096',
        },
        typography: (theme) => ({
          DEFAULT: {
            css: {
              '--tw-prose-body': theme('colors.light-text'),
              '--tw-prose-headings': theme('colors.light-primary'),
              '--tw-prose-links': theme('colors.light-primary'),
              '--tw-prose-bold': theme('colors.light-text'),
              '--tw-prose-counters': theme('colors.light-secondary'),
              '--tw-prose-bullets': theme('colors.light-secondary'),
              // Corrected font family access
              fontSize: '1.125rem',
              lineHeight: '1.6',
            },
          },
          dark: {
            css: {
              '--tw-prose-body': theme('colors.dark-text'),
              '--tw-prose-headings': theme('colors.dark-primary'),
              '--tw-prose-links': theme('colors.dark-primary'),
              '--tw-prose-bold': theme('colors.dark-text'),
              '--tw-prose-counters': theme('colors.dark-secondary'),
              '--tw-prose-bullets': theme('colors.dark-secondary'),
            },
          },
        }),
      },
    },
  }