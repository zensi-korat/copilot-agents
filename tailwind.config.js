/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        /* Map Tailwind color keys to CSS design tokens (defined in src/index.css)
           - Use these keys (`primary`, `accent`, `background`, `muted`, etc.) across the app.
           - Avoid using Tailwind's built-in color swatches directly in components.
        */
        primary: "var(--color-primary)",
        "primary-foreground": "var(--color-primary-foreground)",
        accent: "var(--color-accent)",
        "accent-foreground": "var(--color-accent-foreground)",
        background: "var(--color-bg)",
        surface: "var(--color-surface)",
        card: "var(--color-card)",
        foreground: "var(--color-foreground)",
        muted: "var(--color-muted)",
        border: "var(--color-border)",
        ring: "var(--color-ring)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        destructive: "var(--color-destructive)",
        sidebar: "var(--color-sidebar)",
        "sidebar-foreground": "var(--color-sidebar-foreground)",
        "sidebar-muted": "var(--color-sidebar-muted)",
        "sidebar-active-bg": "var(--color-sidebar-active-bg)",
        subtle: "var(--color-subtle)",
        "primary-subtle": "var(--color-primary-subtle)",
      },
    },
  },
  plugins: [],
};
