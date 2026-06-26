import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		// Mapbox GL is intentionally lazy-loaded by MapCanvas. Its vendor chunk is
		// large, but it is not part of the initial app shell.
		chunkSizeWarningLimit: 2000
	}
});
