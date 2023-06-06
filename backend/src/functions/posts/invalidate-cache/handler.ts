import { AttributeValue, DynamoDBStreamEvent, Handler } from 'aws-lambda';
import { streamMiddleware } from '@libs/utils/handler';
import { invalidateCache } from '@libs/services/cloudfront';
import logger from '@libs/logger';

const invalidateAll = (
	newItem: { [key: string]: AttributeValue } | undefined,
	oldItem: { [key: string]: AttributeValue } | undefined
) => {
	if (!newItem || !oldItem) {
		return false;
	}
	if (newItem.state.S === 'PRIVATE' && oldItem.state.S === 'PRIVATE') {
		return false;
	}
	return (
		oldItem.title.S !== newItem.title.S ||
		oldItem.description.S !== newItem.description.S ||
		oldItem.featured.S !== newItem.featured.S ||
		oldItem.state.S !== newItem.state.S ||
		JSON.stringify(oldItem.tags?.L) !== JSON.stringify(newItem.tags?.L) ||
		oldItem.slug.S !== newItem.slug.S
	);
};

const invalidateSingle = (
	newItem: { [key: string]: AttributeValue } | undefined,
	oldItem: { [key: string]: AttributeValue } | undefined
) => {
	return oldItem.content?.S !== newItem.content?.S;
};

const processHandler = async (event: DynamoDBStreamEvent) => {
	logger.info(`Received ${event.Records.length} records`);

	const pathToInvalidate: Set<string> = new Set();
	for (const record of event.Records) {
		if (record.eventName === 'INSERT' && record.dynamodb.NewImage.state.S === 'PUBLIC') {
			logger.info('List cache has to be flushed because insert');
			pathToInvalidate.add(`/api/posts?*`);
		} else if (record.eventName === 'REMOVE' && record.dynamodb.OldImage.state.S === 'PUBLIC') {
			logger.info('List cache has to be flushed because remove');
			pathToInvalidate.add(`/api/posts?*`);
			pathToInvalidate.add(`/api/posts/${record.dynamodb.OldImage!.id.S}`);
			pathToInvalidate.add(`/api/posts/${record.dynamodb.OldImage!.slug.S}`);
		} else if (invalidateAll(record.dynamodb.NewImage, record.dynamodb.OldImage)) {
			logger.info('List cache has to be flushed');
			pathToInvalidate.add(`/api/posts?*`);
			pathToInvalidate.add(`/api/posts/${record.dynamodb.OldImage!.id.S}`);
			pathToInvalidate.add(`/api/posts/${record.dynamodb.OldImage!.slug.S}`);
		} else if (invalidateSingle(record.dynamodb.NewImage, record.dynamodb.OldImage)) {
			logger.info('Single post cache has to be flushed');
			pathToInvalidate.add(`/api/posts/${record.dynamodb.OldImage!.id.S}`);
			pathToInvalidate.add(`/api/posts/${record.dynamodb.OldImage!.slug.S}`);
		}
	}
	await invalidateCache([...pathToInvalidate], process.env.BLOG_DISTRIBUTION_ID);
};

export const handler: Handler = streamMiddleware(processHandler);
