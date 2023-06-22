import { PUBLIC_BASE_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';
import type CreateBlogPost from './interfaces/CreateBlogPost';
import type CreatePresignedUrl from './interfaces/CreatePresignedUrl';
import type UpdateBlogPost from './interfaces/UpdateBlogPost';
import type { PresignedUrl } from './interfaces/PresignedUrl';

const POSTS_URL = `${PUBLIC_BASE_URL}/api/posts`;
const ADMIN_POSTS_URL = `${PUBLIC_BASE_URL}/api/admin/posts`;

const listPosts = async (
	fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>,
	nextToken = '',
	limit = 12,
	exclude = ''
) => {
	console.time(`list-posts-${nextToken}`);
	const url = `${POSTS_URL}?limit=${limit}&nextToken=${nextToken}&exclude=${exclude}`;
	const params = {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
		},
	};
	console.debug(params);
	const res = await fetch(url, params);
	console.info('Posts fetched');
	const posts = await res.json();
	console.timeEnd(`list-posts-${nextToken}`);
	console.debug(posts);

	if (posts.data && Object.keys(posts.data).length) {
		return posts.data;
	}
	return [];
};

const listPostsAdmin = async (
	fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>,
	token: string,
	nextToken = '',
	limit = 12
) => {
	console.time(`list-posts-admin-${nextToken}`);
	const url = `${ADMIN_POSTS_URL}?limit=${limit}&nextToken=${nextToken}`;
	const params = {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	};
	const res = await fetch(url, params);
	console.info('Posts fetched for admin');
	const posts = await res.json();
	console.timeEnd(`list-posts-admin-${nextToken}`);
	console.debug(posts);

	if (posts.data && Object.keys(posts.data).length) {
		return posts.data;
	}
	return [];
};

const getPost = async (
	fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>,
	id: string
) => {
	console.time(`get-post-${id}`);
	const url = `${POSTS_URL}/${id}`;
	const params = {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
		},
	};
	console.debug(params);
	const res = await fetch(url, params);
	console.info('Post fetched');
	const posts = await res.json();
	console.timeEnd(`get-post-${id}`);
	console.debug(posts);


	if (posts.data && Object.keys(posts.data).length) {
		return posts.data;
	}
	throw error(404, 'Not found');
};

const getPostAdmin = async (
	fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>,
	id: string,
	token: string
) => {
	console.time(`get-post-admin-${id}`);
	const url = `${ADMIN_POSTS_URL}/${id}`;
	const params = {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	};
	console.debug(params);
	const res = await fetch(url, params);
	console.info('Post fetched admin');
	const posts = await res.json();
	console.timeEnd(`get-post-admin-${id}`);
	console.debug(posts);

	if (posts.data && Object.keys(posts.data).length) {
		return posts.data;
	}
	throw error(404, 'Not found');
};

const updatePost = async (
	fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>,
	token: string,
	id: string,
	data: UpdateBlogPost
) => {
	console.time(`update-post-${id}`);
	const url = `${ADMIN_POSTS_URL}/${id}`;
	const params = {
		method: 'PUT',
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	};
	console.debug(params);
	const res = await fetch(url, params);
	console.info('Post updated');
	console.timeEnd(`update-post-${id}`);
	console.debug(res);
};

const createPost = async (
	fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>,
	token: string,
	data: CreateBlogPost
) => {
	console.time('create-post');
	const url = `${ADMIN_POSTS_URL}`;
	const params = {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	};
	console.debug(params);
	const res = await fetch(url, params);
	console.info('Post created');
	const id = await res.json();
	console.timeEnd('create-post');
	console.debug(res);
	return id;
};

const deletePost = async (
	fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>,
	token: string,
	id: string
) => {
	console.time(`delete-post-${id}`);
	const url = `${ADMIN_POSTS_URL}/${id}`;
	const params = {
		method: 'PUT',
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	};
	console.debug(params);
	const res = await fetch(url, params);
	console.info('Post deleted');
	console.timeEnd(`delete-post-${id}`);
	console.debug(res);
};

const publishPost = async (
	fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>,
	token: string,
	id: string
) => {
	console.time(`publish-post-${id}`);
	const url = `${ADMIN_POSTS_URL}/${id}/publish`;
	const params = {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	};
	console.debug(params);
	const res = await fetch(url, params);
	console.info('Post published');
	console.timeEnd(`publish-post-${id}`);
	console.debug(res);
};

const createPresignedUrl = async (
	fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>,
	token: string,
	data: CreatePresignedUrl,
	id?: string
): Promise<PresignedUrl> => {
	console.time(`create-presigned-url-${id}`);
	const url = `${ADMIN_POSTS_URL}/images/presigned-url${id ? `?id=${id}` : ''}`;
	const params = {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	};
	console.debug(params);
	const res = await fetch(url, params);
	console.info('Done creating presigned url');
	const presignedUrl = await res.json();
	console.timeEnd(`create-presigned-url-${id}`);
	console.debug(res);

	console.debug(presignedUrl.data);
	return presignedUrl.data;
};

export {
	listPosts,
	getPost,
	updatePost,
	createPost,
	deletePost,
	publishPost,
	createPresignedUrl,
	listPostsAdmin,
	getPostAdmin,
};
