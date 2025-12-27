import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		alias: {
			$lib: './src/lib',
			$components: './src/lib/components',
			$stores: './src/lib/stores',
			$types: './src/lib/types',
			$api: './src/lib/api',
			$utils: './src/lib/utils',
			$config: './src/lib/config',
			$styles: './src/lib/styles'
		}
	}
};

export default config;