import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://chuhai.eastlaw.wang',
  base: '/',
  output: 'static',
  build: {
    assets: 'assets'
  }
});
