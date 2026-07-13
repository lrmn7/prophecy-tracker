import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/claim': {
        target: 'https://prophecypoints.somnia.network',
        changeOrigin: true,
      },
      '/api/v1/forwards': {
        target: 'https://api.prophecy.social',
        changeOrigin: true,
      },
    },
  },
});
