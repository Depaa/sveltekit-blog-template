import { authGuard, getIsLogged } from '$lib/auth/auth';
import { listPosts, listPostsAdmin } from '$lib/services/posts';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const isLoggedIn = getIsLogged();
		if (isLoggedIn) {
			const token = await authGuard().getToken()
			return { ...(await listPostsAdmin(fetch, token)), isLoggedIn };
		} else {
			return { ...(await listPosts(fetch)), isLoggedIn };
		}
	} catch (error) {
		console.error(error);
	}
};