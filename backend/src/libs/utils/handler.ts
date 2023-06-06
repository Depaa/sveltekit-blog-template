import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, DynamoDBStreamEvent, Handler, S3Event } from 'aws-lambda';
import logger from '@libs/logger';

export const middleware = (handler: (event: APIGatewayProxyEventV2) => Promise<any>, statusCode = 200, message?: string): Handler => {
  return async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
      logger.debug(event);
      if (event.body) {
        event.body = JSON.parse(event.body) || event.body;
      }
      const data = await handler(event);

      return parseResponse(statusCode, message, data);
    } catch (error: any) {
      return errorParsing(error);
    }
  };
}

export const streamMiddleware = (handler: (event: DynamoDBStreamEvent | S3Event) => Promise<void>): Handler => {
  return async (event: DynamoDBStreamEvent): Promise<void> => {
    try {
      logger.debug(event);

      await handler(event);
    } catch (error: any) {
      errorParsing(error);
    }
  };
}

const errorParsing = (error: any): APIGatewayProxyResultV2 => {
  logger.error(error);

  switch (error.name) {
    case 'ValidationException' || 'SerializationException' || 'ConditionalCheckFailedException':
      return parseResponse(400, process.env.ENV !== 'prod' ? error.message : undefined);
    case 'AccessDeniedException':
      return parseResponse(401, process.env.ENV !== 'prod' ? error.message : undefined);
    case 'NotFoundException':
      return parseResponse(404);
    default:
      return parseResponse(500);
  }
}

const parseResponse = (statusCode = 200, message?: string, data = {}): APIGatewayProxyResultV2 => {
  return {
    headers: {
      "Content-Type": "application/json",
      'Access-Control-Allow-Origin': process.env.ENV === 'dev' ? '*' : `https://${process.env.BLOG_CDN_URL}`,
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': '*', //TODO
      'Cache-Control': statusCode >= 300 ? 'no-cache' : 'public', //TODO
    },
    statusCode,
    body: JSON.stringify({
      message,
      data,
    })
  }
}
