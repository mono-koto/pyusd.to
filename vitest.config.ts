import { defineConfig } from 'vitest/config';

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
  },
});
