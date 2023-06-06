export default {
  type: 'object',
  required: [
    'title',
    'content',
    'contentMd',
    'description',
  ],
  properties: {
    title: {
      type: 'string',
      minLength: 1
    },
    content: {
      type: 'string',
      minLength: 1
    },
    contentMd: {
      type: 'string',
      minLength: 1
    },
    description: {
      type: 'string',
      minLength: 1
    },
    featured: {
      type: 'string',
      enum: [
        'false',
        'true'
      ],
      default: 'false'
    },
    tags: {
      type: 'array',
      items: {
        type: 'string',
        minLength: 1
      },
      minItems: 0,
      maxItems: 5,
      uniqueItems: true,
      default: []
    },
    slug: {
      type: 'string'
    },
    seo: {
      type: 'object',
      required: [
        'title',
        'description',
        'tags',
      ],
      properties: {
        title: {
          type: 'string'
        },
        description: {
          type: 'string'
        },
        tags: {
          type: 'array',
          items: {
            type: 'string',
            minLength: 1
          },
          minItems: 0,
          maxItems: 5,
          uniqueItems: true
        },
      }
    },
  },
  additionalProperties: false
} as const;
