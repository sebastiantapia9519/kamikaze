/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],

    // --- SECCIÓN CORREGIDA ---
    // Mantenemos la corrección que hicimos para que las animaciones funcionen en producción.
    content: [
        "./index.html",
        "./src/**/*.{js,jsx}",
    ],
    // -------------------------

    prefix: "",

    // --- TU TEMA ORIGINAL (RESTAURADO) ---
    // Aquí está de vuelta toda tu configuración de colores, fuentes, sombras, etc.
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "var(--color-border)",
                input: "var(--color-input)",
                ring: "var(--color-ring)",
                background: "var(--color-background)", // <-- La clase que perdimos ya está aquí
                foreground: "var(--color-foreground)",
                primary: {
                    DEFAULT: "var(--color-primary)",
                    foreground: "var(--color-primary-foreground)",
                },
                secondary: {
                    DEFAULT: "var(--color-secondary)",
                    foreground: "var(--color-secondary-foreground)",
                },
                destructive: {
                    DEFAULT: "var(--color-destructive)",
                    foreground: "var(--color-destructive-foreground)",
                },
                muted: {
                    DEFAULT: "var(--color-muted)",
                    foreground: "var(--color-muted-foreground)",
                },
                accent: {
                    DEFAULT: "var(--color-accent)",
                    foreground: "var(--color-accent-foreground)",
                },
                popover: {
                    DEFAULT: "var(--color-popover)",
                    foreground: "var(--color-popover-foreground)",
                },
                card: {
                    DEFAULT: "var(--color-card)",
                    foreground: "var(--color-card-foreground)",
                },
                success: {
                    DEFAULT: "var(--color-success)",
                    foreground: "var(--color-success-foreground)",
                },
                warning: {
                    DEFAULT: "var(--color-warning)",
                    foreground: "var(--color-warning-foreground)",
                },
                error: {
                    DEFAULT: "var(--color-error)",
                    foreground: "var(--color-error-foreground)",
                },
                surface: "var(--color-surface)",
                "surface-foreground": "var(--color-surface-foreground)",
                "text-primary": "var(--color-text-primary)",
                "text-secondary": "var(--color-text-secondary)",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                heading: ['Fredoka One', 'cursive'],
                body: ['Inter', 'sans-serif'],
                caption: ['Roboto', 'sans-serif'],
                data: ['JetBrains Mono', 'monospace'],
            },
            boxShadow: {
                'graffiti-sm': '0 2px 4px rgba(0, 128, 255, 0.15), 0 1px 2px rgba(255, 20, 147, 0.1)',
                'graffiti-md': '0 4px 8px rgba(0, 128, 255, 0.2), 0 2px 4px rgba(255, 20, 147, 0.15)',
                'graffiti-lg': '0 8px 16px rgba(0, 128, 255, 0.25), 0 4px 8px rgba(255, 20, 147, 0.2)',
            },
            animation: {
                'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                'pulse-glow': {
                    '0%, 100%': {
                        opacity: '1',
                        boxShadow: '0 0 20px rgba(0, 128, 255, 0.3)',
                    },
                    '50%': {
                        opacity: '0.8',
                        boxShadow: '0 0 30px rgba(255, 20, 147, 0.4)',
                    },
                },
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
            },
            zIndex: {
                '100': '100',
                '150': '150',
                '200': '200',
                '300': '300',
            },
        },
    },
    // Tu plugin también está restaurado.
    plugins: [
        require("tailwindcss-animate"),
    ],
}