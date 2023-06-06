import { App, CfnOutput, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { CachePolicy, Distribution, HttpVersion, PriceClass, SecurityPolicyProtocol, SSLMethod, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { CnameRecord, HostedZone } from 'aws-cdk-lib/aws-route53';
import { BlockPublicAccess, Bucket, BucketAccessControl, HttpMethods } from 'aws-cdk-lib/aws-s3';
import { BuildConfig } from '../lib/common/config.interface';
import { ContentCdnStackProps } from '../lib/common/interfaces/contentCdn';

export class ContentBucketStack extends Stack {
	public readonly contentBucket: Bucket;

	constructor(scope: App, id: string, props: ContentCdnStackProps, buildConfig: BuildConfig) {
		super(scope, id, props);

		this.contentBucket = this.createBucket(id, buildConfig);
		const contentDistribution = this.createDistribution(`${id}-cdn`, buildConfig, props);

		const route53Record = this.createRoute53Record(`${id}-content-record`, buildConfig, contentDistribution.domainName);
		route53Record.node.addDependency(contentDistribution);

		new CfnOutput(this, `ExportsOutputContentBucketName`, {
			value: this.contentBucket.bucketName,
			exportName: `${id}-name`,
		});

		new CfnOutput(this, `ExportsOutputContentBucketArn`, {
			value: this.contentBucket.bucketArn,
			exportName: `${id}-arn`,
		});

		new CfnOutput(this, `ExportsOutputContentCdnId`, {
			value: contentDistribution.distributionId,
			exportName: `${id}-cdn-id`,
		});

		new CfnOutput(this, `ExportsOutputContentCdnUrl`, {
			value: route53Record.domainName,
			exportName: `${id}-cdn-url`,
		});

		new CfnOutput(this, `ExportsOutputContentCdnArn`, {
			value: `arn:aws:cloudfront::${buildConfig.account}:distribution/${contentDistribution.distributionId}`,
			exportName: `${id}-cdn-arn`,
		});
	}

	private createBucket = (id: string, buildConfig: BuildConfig): Bucket => {
		return new Bucket(this, id, {
			accessControl: BucketAccessControl.PRIVATE,
			blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
			publicReadAccess: false,
			cors: [
				{
					allowedMethods: [HttpMethods.PUT],
					allowedOrigins: [
						'http://localhost:5173',
						`https://${buildConfig.stacks.domain.url}`,
					],
					allowedHeaders: ['*'],
				},
			],
		});
	};

	private createDistribution = (id: string, buildConfig: BuildConfig, props: ContentCdnStackProps): Distribution => {
		const cachePolicy = new CachePolicy(this, `${id}-content-policy`, {
			enableAcceptEncodingGzip: true,
			enableAcceptEncodingBrotli: true,
			defaultTtl: Duration.days(365),
			minTtl: Duration.days(365),
		});

		const certificate = Certificate.fromCertificateArn(this, `${id}-certificate`, props.blogContentCertificateArn);

		return new Distribution(this, id, {
			comment: 'CDN for blog content',
			defaultBehavior: { 
				origin: new S3Origin(this.contentBucket),
				viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
				cachePolicy,
			},
			httpVersion: HttpVersion.HTTP3,
			priceClass: PriceClass.PRICE_CLASS_ALL,
			minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
			sslSupportMethod: SSLMethod.SNI,
			domainNames: [buildConfig.stacks.domain.content],
			certificate,
		});
	};

	private createRoute53Record = (name: string, buildConfig: BuildConfig, domainName: string): CnameRecord => {
		const hostedZone = HostedZone.fromHostedZoneAttributes(this, `${name}-content-zone`, {
			zoneName: buildConfig.stacks.domain.hostedZoneName,
			hostedZoneId: buildConfig.stacks.domain.hostedZoneId,
		});

		return new CnameRecord(this, name, {
			domainName,
			zone: hostedZone,
			recordName: buildConfig.stacks.domain.content,
		});
	};
}
