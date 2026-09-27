import type { Config } from 'tailwindcss';
import preset from '@autional-cn/tailwind-preset';

const config: Config = {
  darkMode: 'class',
  presets: [preset],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
