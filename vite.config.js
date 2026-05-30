import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        boids: resolve(__dirname, 'Boids.html'), // Replace with your static HTML file name
      },
    },
  },
});