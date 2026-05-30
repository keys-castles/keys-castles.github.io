import { defineConfig } from 'vite';

export default defineConfig({
  base: '/keys-castles.github.io/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        boids: resolve(__dirname, 'Boids.html'), // Replace with your static HTML file name
      },
    },
  },
});