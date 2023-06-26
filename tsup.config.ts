// Read about how to use custom configuration:
// https://tsup.egoist.dev/#using-custom-configuration

import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  clean: true
});
