import {defineConfig} from 'vite'
import {svelte} from '@sveltejs/vite-plugin-svelte'
import checker from "vite-plugin-checker";

// https://vitejs.dev/config/
export default defineConfig({
  base: '/geo-timeline/',
  plugins: [
    checker({typescript: true}),
    svelte(),
  ],
})
