import { Handler } from 'aws-lambda';
import { middleware } from '@libs/utils/handler';
import { listItems } from '@libs/services/dynamodb';

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
  const exclude = event.queryStringParameters?.exclude;

  const res = await listItems(
    process.env.POSTS_TABLE_NAME!,
    '#state = :state',
    { state: 'PUBLIC' },
    `${process.env.ENV}-blog-posts-table-state-index`,
    limit,
    nextToken,
    false,
    undefined,
    'slug, title, description, image, tags, readingTime, featured, seo, publishedAt, createdAt',
  );

  if (!exclude) {
    res.items = sortItems(res.items);
    return res;
  }

  const relatedItems = [];
  for (const item of res.items) {
    if (item.slug !== exclude) {
      relatedItems.push(item);
    }
  }
  return relatedItems;
}

export const handler: Handler = middleware(processHandler, 200);
