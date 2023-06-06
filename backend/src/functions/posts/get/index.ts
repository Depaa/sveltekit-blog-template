import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      http: {
        method: 'get',
        path: 'api/posts/{id}',
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
