import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/graphql': {
        target: 'http://localhost:3001',
        secure: false,
        changeOrigin: true,
      },
      // Additional proxy settings if needed for other API routes
      '/api': {
        target: 'http://localhost:4000',
        secure: false,
        changeOrigin: true,
      },
    },
  },
  root: '.', // Ensure the root is set to the project directory
  publicDir: 'public', // Ensure the public directory is correctly specified
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});