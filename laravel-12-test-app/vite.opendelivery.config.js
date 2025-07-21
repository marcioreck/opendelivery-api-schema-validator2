import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './resources/js'),
    },
  },
  build: {
    outDir: 'public/build',
    manifest: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'resources/js/main.tsx'),
        css: resolve(__dirname, 'resources/css/app.css'),
      },
    },
  },
  server: {
    port: 5173,
    hmr: {
      host: 'localhost',
    },
  },
});
