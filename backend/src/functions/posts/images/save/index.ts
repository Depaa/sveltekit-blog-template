import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      s3: {
        bucket: '${self:custom.contentBucketName}',
        event: "s3:ObjectCreated:Put",
        existing: true,
        rules: [
          {
            prefix: 'images/',
          }
        ]
      },
    },
  ],
};