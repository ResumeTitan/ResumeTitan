import type { Config } from 'tailwindcss';

/**
 * Tailwind CSS Configuration
 *
 * Colors are defined as CSS custom properties in src/lib/styles/themes/colors.css
 * and referenced here for Tailwind utility classes. This ensures a single source of truth.
 */
export default {
    content: ['./src/**/*.{html,js,svelte,ts,css}'],
    theme: {
        screens: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px',
        },
        extend: {
            colors: {
                // Primary brand colors - teal palette
                'main-green': 'var(--color-main-green, #115E59)',
                'dark-green': 'var(--color-dark-green, #0e4a45)',
                'darker-green': 'var(--color-darker-green, #0b3733)',
                'darkest-green': 'var(--color-darkest-green, #082421)',
                'lightest-green': 'var(--color-lightest-green, #e0f2f1)',
                'lighter-green': 'var(--color-lighter-green, #b2dfdb)',
                'light-green': 'var(--color-light-green, #80cbc4)',

                // Complementary colors
                'main-opposite': 'var(--color-main-opposite, #59115e)',
                'analogous-green': 'var(--color-analogous-green, #115e45)',
                'analogous-blue': 'var(--color-analogous-blue, #115e73)',

                // Semantic colors
                success: 'var(--color-success, #10b981)',
                error: 'var(--color-error, #ef4444)',
                warning: 'var(--color-warning, #f59e0b)',
                info: 'var(--color-info, #3b82f6)',

                // Layout
                background: 'var(--color-background, #475569)',
            },
            scale: {
                '25': '0.25',
                '40': '0.40',
                '50': '0.50',
                '60': '0.60',
                '70': '0.70',
                '80': '0.80',
                '90': '0.90',
            },
            animation: {
                'fade-in': 'fadeIn 1s ease-out',
                'slide-up': 'slideUp 0.5s ease-out forwards',
                'slide-up-fade': 'slideUpAndFadeIn 0.5s ease-out forwards',
                'fade-in-out': 'fadeInOut 2s cubic-bezier(0.4, 0, 0.2, 1)',
                pulse: 'pulse 2s ease-in-out infinite',
            },
            keyframes: {
                pulse: {
                    '0%, 100%': { opacity: '0.5' },
                    '50%': { opacity: '0.2' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                rollDown: {
                    '0%': { transform: 'translateY(0)', opacity: '1' },
                    '100%': { transform: 'translateY(100%)', opacity: '0' },
                },
                rollUp: {
                    '0%': { transform: 'translateY(100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)' },
                    '100%': { transform: 'translateY(0)' },
                },
                slideUpAndFadeIn: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeInOut: {
                    '0%': { opacity: '0', transform: 'translate(-50%, 10px)' },
                    '10%': { opacity: '1', transform: 'translate(-50%, 0)' },
                    '90%': { opacity: '1', transform: 'translate(-50%, 0)' },
                    '100%': { opacity: '0', transform: 'translate(-50%, -5px)' },
                },
            },
        },
    },
    plugins: [],
} satisfies Config;
