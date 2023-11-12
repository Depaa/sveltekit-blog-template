import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      http: {
        method: 'post',
        path: 'api/newsletter/subscribe',
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
        private: true,
      },
    },
  ],
};
