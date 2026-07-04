import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	ssr: {
		noExternal: ['@ergodot/ui-kit']
	},
	server: {
		proxy: {},
		open: '/'
	}
});
