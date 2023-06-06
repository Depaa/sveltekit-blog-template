import { adapter } from '@mdepascale/sveltekit-adapter-aws';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		// SSR with AWS
		adapter: adapter({
			stackName: 'dev-blog-ssr-adapter',
			autoDeploy: true,
			FQDN: '{FQDN}',
			esbuildOptions: {
				target: 'node18'
			},
			existingResources: {
				distributionId: '{DISTRIBUTION_ID}',
				distributionDomainName: '{CLOUDFRONT_URL}'
			},
			lambdaConfig: {
				memorySize: 512,
				runtime: 'NODEJS_18_X',
				architecture: 'ARM_64',
				timeout: 300,
				logRetentionDays: 7
			},
			cacheConfig: {
				staticAssets: {
					cacheControl: 'public,max-age=31536000'
				},
				distributionStatic: {
					maxTtl: 31_536_000,
					minTtl: 31_536_000,
					defaultTtl: 31_536_000,
					enableAcceptEncodingGzip: true,
					enableAcceptEncodingBrotli: true,
					comment: 'Static files cache policy.'
				},
				distributionDynamic: {
					maxTtl: 31_536_000,
					minTtl: 31_536_000,
					defaultTtl: 31_536_000,
					enableAcceptEncodingGzip: true,
					comment: 'Dynamic server cache policy.'
				}
			}
		})
	},
};

export default config;
