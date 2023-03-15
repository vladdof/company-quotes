import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [
    vue({
      template: {
        transformAssetUrls: {
          base: null,
          includeAbsolute: false,
        },
      },
    }),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: [
      {
        find: '@/',
        replacement: `${path.resolve(__dirname, './src')}/`,
      },
      {
        find: /^~(.*)$/,
        replacement: 'node_modules/$1',
      },
    ],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
});
