import { adapter } from '@mdepascale/sveltekit-aws-adapter';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const qualityConfig = require('./adapter.quality.json');
const productionConfig = require('./adapter.production.json');

console.log(process.env.NODE_ENV);
const stageConfig = process.env.NODE_ENV === 'production' ? productionConfig : qualityConfig;

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		// SSR with AWS
		adapter: adapter(stageConfig),
	},
};

export default config;
