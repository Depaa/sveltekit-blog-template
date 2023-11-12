export default {
  type: 'object',
  required: [
    'email',
  ],
  properties: {
    email: {
      type: 'string',
      pattern: "[a-z0-9\._%+!$&*=^|~#%{}\/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,22})",
    },
  },
  additionalProperties: false
} as const;
