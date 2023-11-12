import { Handler } from 'aws-lambda';
import { middleware } from '@libs/utils/handler';
import { putItem } from '@libs/services/dynamodb';

const processHandler = async (event: any) => {
	const body = event.body!;
	await putItem(process.env.NEWSLETTER_TABLE_NAME!, body);
};

export const handler: Handler = middleware(processHandler, 201);
