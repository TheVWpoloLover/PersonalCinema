import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub Pages hosts this project under /PersonalCinema/, so relative URLs
  // keep built assets working from the project subpath.
  base: './',
});
