import { App, Environment, StackProps } from 'aws-cdk-lib';
import { getConfig } from './lib/common/build-config';
import { BuildConfig } from './lib/common/config.interface';
import { Tags } from 'aws-cdk-lib';
import { PostsTableStack } from './stacks/posts-table';
import { BlogApiGatewayStack } from './stacks/api-gateway';
import { DomainsStack } from './stacks/domains';
import { BlogAuthorizerStack } from './stacks/cognito-auth';
import { ContentBucketStack } from './stacks/content-storage';
import { BlogCdnStack } from './stacks/cloudfront-cdn';
import { NewsletterTableStack } from './stacks/newsletter-table';

const app = new App();

const buildConfig: BuildConfig = getConfig(app);
Tags.of(app).add('Environment', buildConfig.environment);
Tags.of(app).add('Project', buildConfig.project);
Tags.of(app).add('Cdk', 'true');

const env: Environment = { account: buildConfig.account, region: buildConfig.region };
const stackId = `${buildConfig.environment}-${buildConfig.project}`;
const baseProps: StackProps = { env };

const blogAuthorizerStackId = `${stackId}-auth`;
const blogApiGatewayStackId = `${stackId}-api`;
const blogContentBucketStackId = `${stackId}-content`;
const postsTableStackId = `${stackId}-posts-table`;
const blogDomainsStackId = `${stackId}-domains`;
const blogMonitoringStackId = `${stackId}-monitoring`;
const blogCdnStackId = `${stackId}`;
const newsletterTableStackId = `${stackId}-newsletter-table`;

const postsTableStack = new PostsTableStack(
	app,
	postsTableStackId,
	{
		...baseProps,
		stackName: postsTableStackId,
	},
	buildConfig
);

const blogDomainsStack = new DomainsStack(
	app,
	blogDomainsStackId,
	{
		...baseProps,
		stackName: blogDomainsStackId,
	},
	buildConfig
);

const blogAuthorizerStack = new BlogAuthorizerStack(
	app,
	blogAuthorizerStackId,
	{
		...baseProps,
		stackName: blogAuthorizerStackId,
	},
	buildConfig
);

const blogApiGatewayStack = new BlogApiGatewayStack(
	app,
	blogApiGatewayStackId,
	{
		...baseProps,
		stackName: blogApiGatewayStackId,
		postsTableArn: postsTableStack.postsTable.tableArn,
		postsTableName: postsTableStack.postsTable.tableName,
		blogUserPool: blogAuthorizerStack.userPool,
		blogUserPoolClient: blogAuthorizerStack.userPoolClient,
	},
	buildConfig
);

new BlogCdnStack(
	app,
	blogCdnStackId,
	{
		...baseProps,
		stackName: blogCdnStackId,
		blogCertificateArn: blogDomainsStack.urlCertificate.certificateArn,
		blogApiId: blogApiGatewayStack.blogApiGateway.restApiId,
		blogApiRootId: blogApiGatewayStack.blogApiGateway.restApiRootResourceId,
		blogApiUrl: blogApiGatewayStack.blogApiGateway.url,
	},
	buildConfig
);

new ContentBucketStack(
	app,
	blogContentBucketStackId,
	{
		...baseProps,
		stackName: blogContentBucketStackId,
		blogContentCertificateArn: blogDomainsStack.contentCertificate.certificateArn,
	},
	buildConfig
);

new NewsletterTableStack(
	app,
	newsletterTableStackId,
	{
		...baseProps,
		stackName: newsletterTableStackId,
	},
	buildConfig
);
