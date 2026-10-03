/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-elevated": "var(--surface-elevated)",
        ink: {
          DEFAULT: "var(--ink)",
          2: "var(--ink-2)",
          muted: "var(--ink-muted)",
        },
        border: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          active: "var(--primary-active)",
        },
        secondary: "var(--secondary)",
        accent: {
          DEFAULT: "var(--accent)",
          soft: "var(--accent-soft)",
        },
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
        info: "var(--info)",
        hood: {
          bg: "#16191A",
          surface: "#1F2324",
          border: "#2C3234",
          text: "#E6E2DA",
          muted: "#9A958B",
          success: "#7FB391",
          warning: "#D9A441",
          error: "#D97A6C",
          info: "#7FA6C4",
          accent: "#C9906F",
        }
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      borderRadius: {
        'xs': '2px',
        'sm': '6px',
        'md': '10px',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(30, 27, 24, 0.06)',
        'md': '0 8px 24px rgba(30, 27, 24, 0.08)',
        'lg': '0 24px 60px rgba(30, 27, 24, 0.14)',
      },
      transitionDuration: {
        'fast': '120ms',
        'med': '240ms',
        'slow': '480ms',
      },
      transitionTimingFunction: {
        'ease-out-custom': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'ease-in-out-custom': 'cubic-bezier(0.65, 0, 0.35, 1)',
      }
    },
  },
  plugins: [],
}
