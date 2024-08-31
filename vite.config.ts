import { sveltekit } from '@sveltejs/kit/vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { defineConfig } from 'vitest/config';


export default defineConfig({
	plugins: [sveltekit(), nodePolyfills({
		globals: {
			Buffer: true,
			global: true,
			process: true,
		},
		include: ['buffer', 'process', 'global'],
		protocolImports: true,
	})],
	server: {
		cors: true,
		host: '127.0.0.1',
		port: 5173
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
