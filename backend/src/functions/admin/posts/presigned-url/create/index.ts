import { handlerPath } from '@libs/handler-resolver';
import schema from './schema';

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      http: {
        method: 'post',
        path: 'api/admin/posts/images/presigned-url',
        request: {
          schemas: {
            'application/json': schema,
          },
        },
        cors: {
          origin: '*',
          headers: [
            '*'
          ]
        },
        authorizer: {
          arn: '${self:custom.cognitoUserPoolArn}',
        },
        private: true,
      },
    },
  ],
};
