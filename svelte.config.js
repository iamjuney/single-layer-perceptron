import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
	},
	preprocess: vitePreprocess(),
	vitePlugin: {
		experimental: {
			inspector: true
		}
	}
};

export default config;
