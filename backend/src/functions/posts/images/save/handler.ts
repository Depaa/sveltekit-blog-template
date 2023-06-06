import { Handler, S3Event } from 'aws-lambda';
import { streamMiddleware } from '@libs/utils/handler';
import logger from '@libs/logger';
import { updateItem } from '@libs/services/dynamodb';

const processHandler = async (event: S3Event) => {
	logger.info(`Received ${event.Records.length} records`);

	for (const record of event.Records) {
		const { key } = record.s3.object;
		const ids = record.s3.object.key.split('/');
		if (ids.length > 2) {
			const image = `https://${process.env.CONTENT_CDN_URL}/${key}`;
			await updateItem(process.env.POSTS_TABLE_NAME!, { image }, 'id', ids[1]);
		}
	}
};

export const handler: Handler = streamMiddleware(processHandler);
