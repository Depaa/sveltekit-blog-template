import { authGuard, getIsLogged } from '$lib/auth/auth';
import { getPost, getPostAdmin, listPosts } from '$lib/services/posts';
import type { PageLoad } from './$types';

/*
 * https://kit.svelte.dev/docs/page-options#prerender
 * it may be possible to pre-render, need to do more testing
 * Accessing url.searchParams during prerendering is forbidden.
 * If you need to use it, ensure you are only doing so in the browser (for example in onMount).
 */
// export const prerender = 'auto';

// we don't need any JS on this page, though we'll load
// it in dev so that we get hot module replacement
// export const csr = false;

export const load: PageLoad = async ({ fetch, params }) => {
	try {
		const isLoggedIn = getIsLogged();
		const related = await listPosts(fetch, '', 4, params.slug);
		if (isLoggedIn) {
			const token = await authGuard().getToken()
			const post = await getPostAdmin(fetch, params.slug, token);
			post.content = post.content
				.replace(/&lt;/g, '<')
				.replace(/&gt;/g, '>')
				.replaceAll('<code>', '<pre><code>')
				.replaceAll('</code>', '</code></pre>')
				.replaceAll('<pre><code>', '<pre class="theme-atom-one-dark code-container"><code class="hljs language-javascript">')
				.replaceAll('<link', '&lt;link')
				.replaceAll('<script', '&lt;script')
				.replaceAll('</script>', '&lt;/script&gt;')
				.replaceAll('<button', '&lt;button')
				.replaceAll('</button>', '&lt;/button&gt;')
			return { post, related }
		}
		const post = await getPost(fetch, params.slug);
		post.content = post.content
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replaceAll('<code>', '<pre><code>')
			.replaceAll('</code>', '</code></pre>')
			.replaceAll('<pre><code>', '<pre class="theme-atom-one-dark code-container"><code class="hljs language-javascript">')
			.replaceAll('<link', '&lt;link')
			.replaceAll('<script', '&lt;script')
			.replaceAll('</script>', '&lt;/script&gt;')
			.replaceAll('<button', '&lt;button')
			.replaceAll('</button>', '&lt;/button&gt;')

		return { post, related }
	} catch (error) {
		console.error(error);
	}
};
