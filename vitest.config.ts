import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    env: {
      NODE_ENV: 'test'
    },
    pool: 'threads',
    minThreads: 1,
    maxThreads: 1
  }
});


