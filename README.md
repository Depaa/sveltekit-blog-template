Link to the series:
- Part 1: https://medium.com/@depascalematteo/serverless-infrastructure-on-aws-for-blog-website-15bb66fc35b1
- Part 2: https://medium.com/@depascalematteo/blog-series-from-zero-to-hero-part-2-serverless-backend-api-on-aws-for-blog-website-ad2af596b2e0
- Part 3: https://medium.com/@depascalematteo/building-static-backoffice-on-aws-with-sveltekit-11937a2d13c
- Part 4: https://medium.com/@depascalematteo/building-a-lightning-fast-serverless-blog-on-aws-with-sveltekit-part-4-5ca74d6dfa4a
- Part 5:


## To release it follow these steps:

1. update parameters in infra/cdk.json and cdk.context.json. Parameters that needs to be changed are:
- {ACCOUNT_ID}: 012345678901
- {REGION}: eu-central-1
- {ENV}: prod
- {API_SECRET_STRING}: s8urgjf-oid8cnj-asjkcxn-286a5s
- {OPTIONAL_R53_ZONE_ID}: QWERTHDF65T
- {OPTIONAL_R53_ZONE_NAME}: example.com
- {OPTIONAL_DOMAIN_NAME}: blog.example.com
- {OPTIONAL_DOMAIN_NAME_FOR_IMAGES}: blog-images.example.com

2. npm install in infra/

3. npm run deploy in infra/

4. npm install in backend/

5. npm run deploy in backend/

6. npm install in frontend/

7. update environment variabiles in frontend/.env.production and frontend/.env.quality
- {ENVIRONMENT}: prod
- {DOMAIN_NAME}: example.com
- {DOMAIN_URL}: https://blog.example.com
- {IMAGE_DOMAIN_URL}: https://blog-images.example.com
- {LOGO_FILE_PATH}: logo.png
- {GITHUB_USERNAME}: Depaa
- {GITHUB_URL}: https://github.com/Depaa
- {LINKEDIN_USERNAME}: matteo-depascale 
- {LINKEDIN_URL}: https://www.linkedin.com/in/matteo-depascale/
- {TWITTER_USERNAME}: DepascaleMatteo
- {TWITTER_URL}: https://twitter.com/DepascaleMatteo

8. update variables in frontend/src/aws-exports.ts with the variables from cognito
- {REGION}
- {USERPOOL_ID}
- {USERPOOL_CLIENT_ID}
- {USERPOOL_DOMAIN_URL}

9. update adapter.prodution.json and adapter.quality.json with your preferrend configuration, I'll leave an example out there. What you must do is updating the existing resources:
- {DISTRIBUTION_ID}: id of the CloudFront distribution created a few minutes ago
- {CLOUDFRONT_URL}: url of the CloudFront distribution created a few minutes ago

10. npm run dev in frontend

11. you are probably missing your user, just create one from the cognito aws console or cli and assign it to "admin" user group

12. 🎉

<i>Disclaimer: this is a WIP project, it's actually a series of blogpost starting from stratch where I document the process of creating my own blog and releasing it open source for everyone. Hope you are not in a hurry, the project will be completed in a few month from when you read, if not please read this paragraph again :)</i>
