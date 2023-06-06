import { Handler } from 'aws-lambda';
import { middleware } from '@libs/utils/handler';
import { getItem, listItems } from '@libs/services/dynamodb';
import { NotFoundException } from '@libs/errors/not-found';

const processHandler = async (event: any) => {
	const id = event.pathParameters.id;

	const posts = await listItems(
		process.env.POSTS_TABLE_NAME!,
		'#slug = :slug',
		{ slug: id },
		`${process.env.ENV}-blog-posts-table-slug-index`,
		1
	);
	let post = posts.items.length > 0 ? posts.items[0] : null;

	if (!post) {
		post = await getItem(process.env.POSTS_TABLE_NAME!, 'id', id);
	}
	if (!post) {
		throw new NotFoundException('Item not found');
	}

	return post;
};

export const handler: Handler = middleware(processHandler, 200);
