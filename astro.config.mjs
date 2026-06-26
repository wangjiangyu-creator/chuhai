import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://wangjiangyu-creator.github.io',
  base: '/chuhai',
  output: 'static',
  build: {
    assets: 'assets'
  }
});
