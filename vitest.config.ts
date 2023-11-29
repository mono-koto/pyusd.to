import { defineConfig } from 'vitest/config';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  test: {
    environment: 'node',
    maxConcurrency: 1,
    sequence: {
      setupFiles: 'list',
    },
    threads: false,
    isolate: false,
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
