import type { Config } from "tailwindcss";

/**
 * Tailwind is wired to the design tokens defined in app/tokens.css.
 * Every value below points at a CSS variable — there are NO hardcoded
 * brand colors here. To re-theme the product, edit app/tokens.css only.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light surfaces
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        "surface-2": "var(--color-surface-2)",
        foreground: "var(--color-foreground)",
        muted: "var(--color-muted)",
        "muted-2": "var(--color-muted-2)",
        border: "var(--color-border)",
        overlay: "var(--color-overlay)",
        // Primary (dark pill button)
        primary: "var(--color-primary)",
        "primary-foreground": "var(--color-primary-foreground)",
        // Accent (promo pill / highlights)
        accent: "var(--color-accent)",
        "accent-foreground": "var(--color-accent-foreground)",
        // Danger (graceful error states)
        danger: "var(--color-danger)",
        "danger-surface": "var(--color-danger-surface)",
        "danger-border": "var(--color-danger-border)",
        // Dark surfaces (Resources mega-dropdown)
        "dark-surface": "var(--color-dark-surface)",
        "dark-surface-2": "var(--color-dark-surface-2)",
        "dark-foreground": "var(--color-dark-foreground)",
        "dark-muted": "var(--color-dark-muted)",
        "dark-border": "var(--color-dark-border)",
      },
      fontFamily: {
        sans: "var(--font-sans)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        pop: "var(--shadow-pop)",
      },
      maxWidth: {
        page: "var(--page-max)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease both",
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
