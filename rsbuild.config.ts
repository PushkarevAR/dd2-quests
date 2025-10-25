import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  output: {
    publicPath: './',
    assetPrefix: './',
    copy: [
      {
        from: 'public',
        to: '.',
      },
    ],
  },
});
