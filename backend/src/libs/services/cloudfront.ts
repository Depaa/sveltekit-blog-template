import { CloudFrontClient, CreateInvalidationCommand } from '@aws-sdk/client-cloudfront';
import { randomUUID } from 'crypto';
import logger from '@libs/logger';

const cloudfront = new CloudFrontClient({});

export const invalidateCache = async (items?: string[], distributionId = null) => {
	logger.debug(items);
	if (items.length < 0) {
		logger.info(`Nothing to invalidate`);
		return;
	}
	try {
		const createInvalidationCommand = new CreateInvalidationCommand({
			DistributionId: distributionId,
			InvalidationBatch: {
				CallerReference: randomUUID(),
				Paths: {
					Quantity: items.length,
					Items: items,
				},
			},
		});
		const res = await cloudfront.send(createInvalidationCommand);
		logger.info(`Cache invalidated with id ${res.Invalidation?.Id}`);
	} catch (error) {
		logger.error(error);
	}
};
