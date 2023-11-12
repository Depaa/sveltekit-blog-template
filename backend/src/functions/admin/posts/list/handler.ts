import { Handler } from 'aws-lambda';
import { middleware } from '@libs/utils/handler';
import { scanItems } from '@libs/services/dynamodb';

const sortItems = (items: any[]) => {
  items.sort((a, b) => {
    const featuredComparison = b.featured.localeCompare(a.featured);
    if (featuredComparison === 0) {
      const timeComparison = (b.publishedAt || b.createdAt) - (a.publishedAt || a.createdAt);
      return timeComparison;
    }
    return featuredComparison;
  });

  return items;
};

const processHandler = async (event: any) => {
	const nextToken = event.queryStringParameters?.nextToken;
	const limit = event.queryStringParameters?.limit;

	const res = await scanItems(
		process.env.POSTS_TABLE_NAME!,
		limit,
		nextToken,
	);

	res.items = sortItems(res.items);
	return res;
};

export const handler: Handler = middleware(processHandler, 200);
