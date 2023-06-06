import { Handler } from 'aws-lambda';
import { middleware } from '@libs/utils/handler';
import { updateItem } from '@libs/services/dynamodb';
import { calculateReadingTime } from '@libs/utils/readingTime';

const processHandler = async (event: any) => {
	const id = event.pathParameters.id;
	const body = event.body!;
	body.slug =
		body.slug ||
		body.title
			.replace(/([^\w ]|_)/g, '')
			.replace(/ /g, '-')
			.toLowerCase();
	body.title = body.title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
	body.content = body.content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
	body.contentMd = body.contentMd.replace(/</g, '&lt;').replace(/>/g, '&gt;');
	body.description = body.description.replace(/</g, '&lt;').replace(/>/g, '&gt;');
	body.readingTime = calculateReadingTime(body.content);
	body.updatedBy = event.requestContext.authorizer.claims.sub;
	if (body.image) {
		body.image = `https://${process.env.CONTENT_CDN_URL}/images/${body.image}`;
	}

	await updateItem(process.env.POSTS_TABLE_NAME!, body, 'id', id);

	return { id, slug: body.slug };
};

export const handler: Handler = middleware(processHandler, 200);
