import { Handler } from 'aws-lambda';
import { middleware } from '@libs/utils/handler';
import { createSignedUrl } from '@libs/services/s3';
import { randomUUID } from 'crypto';

const processHandler = async (event: any) => {
	const id = event.queryStringParameters?.id;
	const { type } = event.body;

	const key = `images/${id ? `${id}/${randomUUID()}` : randomUUID()}`;
	const signedUrl = await createSignedUrl(key, type, process.env.CONTENT_BUCKET_NAME, 'max-age=31536000,public');
	const image = `https://${process.env.CONTENT_CDN_URL}/${key}`;

	return {
		signedUrl,
		key,
		image
	};
};

export const handler: Handler = middleware(processHandler, 200);
