/* eslint-disable prettier/prettier */
import swc from 'unplugin-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'
import dotenv from 'dotenv';

dotenv.config();

export const userConfig = {
  plugins: [
    tsconfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
  },
}

export default defineConfig(userConfig)
