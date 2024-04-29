import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/app/**/*.tsx', './src/components/**/*.tsx'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
