/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Near-black terminal background
        navy: {
          950: '#030805',
          900: '#060f06',
          800: '#0c1e0c',
          700: '#122810',
        },
        // Neon green accent (matches LC game color)
        gold: {
          DEFAULT: '#00ff99',
          light:   '#66ffcc',
          dark:    '#00bb77',
          muted:   '#0a4d2e',
        },
        // Text colors — bright enough to read on near-black
        moonstone: {
          DEFAULT: '#ccf5e4',
          dark:    '#4a8a64',
        },
        // Tier colors
        tier: {
          zayin: '#4ade80',
          teth:  '#60a5fa',
          he:    '#fbbf24',
          waw:   '#fb923c',
          aleph: '#f87171',
        },
        // Damage types
        damage: {
          red:   '#f87171',
          white: '#e5e7eb',
          black: '#6b7280',
          pale:  '#7dd3fc',
        },
      },
      fontFamily: {
        display:  ['Cinzel', 'serif'],
        body:     ['Inter', 'sans-serif'],
        mono:     ['JetBrains Mono', 'monospace'],
        counter:  ['Orbitron', 'sans-serif'],
      },
      boxShadow: {
        'gold':       '0 0 20px rgba(0, 255, 153, 0.3)',
        'gold-lg':    '0 0 40px rgba(0, 255, 153, 0.4)',
        'gold-sm':    '0 0 8px rgba(0, 255, 153, 0.25)',
        'tier-zayin': '0 0 12px rgba(74, 222, 128, 0.4)',
        'tier-teth':  '0 0 12px rgba(96, 165, 250, 0.4)',
        'tier-he':    '0 0 12px rgba(251, 191, 36, 0.4)',
        'tier-waw':   '0 0 12px rgba(251, 146, 60, 0.4)',
        'tier-aleph': '0 0 12px rgba(248, 113, 113, 0.4)',
      },
    },
  },
  plugins: [],
}
