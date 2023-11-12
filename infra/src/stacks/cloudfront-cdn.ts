import { App, CfnOutput, Duration, Fn, Stack } from 'aws-cdk-lib';
import { BuildConfig } from '../lib/common/config.interface';
import { name } from '../lib/common/utils';
import {
	AllowedMethods,
	CachedMethods,
	CacheHeaderBehavior,
	CachePolicy,
	CacheQueryStringBehavior,
	Distribution,
	HttpVersion,
	IDistribution,
	OriginProtocolPolicy,
	OriginRequestPolicy,
	OriginSslPolicy,
	PriceClass,
	ResponseHeadersPolicy,
	SecurityPolicyProtocol,
	SSLMethod,
	ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { ARecord, CnameRecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { BlogCdnStackProps } from '../lib/common/interfaces/postsApiCdn';
import { BlockPublicAccess, Bucket, BucketAccessControl, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { HttpOrigin, S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';

export class BlogCdnStack extends Stack {
	public readonly blogCdnId: string;
	public readonly spaBucket: Bucket;

	constructor(scope: App, id: string, props: BlogCdnStackProps, buildConfig: BuildConfig) {
		super(scope, id, props);

		const cdn = this.createApiCDN(id, buildConfig, props);
		this.blogCdnId = cdn.distributionId;

		const route53Record = this.createRoute53Record(name(id, 'record'), buildConfig, cdn);
		route53Record.node.addDependency(cdn);

		new CfnOutput(this, `ExportsOutputBlogDistributionId`, {
			value: cdn.distributionId,
			exportName: `${id}-id`,
		});

		new CfnOutput(this, `ExportsOutputBlogDistributionArn`, {
			value: `arn:aws:cloudfront::${buildConfig.account}:distribution/${cdn.distributionId}`,
			exportName: `${id}-arn`,
		});

		new CfnOutput(this, `ExportsOutputBlogDistributionUrl`, {
			value: route53Record.domainName,
			exportName: `${id}-url`,
		});
	}

	private createApiCDN = (name: string, buildConfig: BuildConfig, props: BlogCdnStackProps): Distribution => {
		const apiOrigin = new HttpOrigin(`${Fn.select(2, Fn.split('/', props.blogApiUrl))}`, {
			originId: 'api',
			originPath: `/${buildConfig.environment}`,
			customHeaders: {
				'X-Api-Key': buildConfig.stacks.api.key,
			},
			originSslProtocols: [OriginSslPolicy.TLS_V1_2],
			protocolPolicy: OriginProtocolPolicy.HTTPS_ONLY,
		});
		const analyticsOrigin = new HttpOrigin('plausible.io', {
			originId: 'analytics',
			originSslProtocols: [OriginSslPolicy.TLS_V1_2],
			protocolPolicy: OriginProtocolPolicy.HTTPS_ONLY,
		});

		const allowedHeaders = ['Authorization'];
		const adminCachePolicy = new CachePolicy(this, `${name}-admin-policy`, {
			enableAcceptEncodingGzip: true,
			defaultTtl: Duration.seconds(1),
			minTtl: Duration.seconds(1),
			queryStringBehavior: CacheQueryStringBehavior.all(),
			headerBehavior: CacheHeaderBehavior.allowList(...allowedHeaders),
		});
		const cachePolicy = new CachePolicy(this, `${name}-policy`, {
			enableAcceptEncodingGzip: true,
			defaultTtl: Duration.days(365),
			minTtl: Duration.days(365),
			queryStringBehavior: CacheQueryStringBehavior.all(),
		});
		const certificate = Certificate.fromCertificateArn(this, `${name}-certificate`, props.blogCertificateArn!);

		const cdn = new Distribution(this, 'spaDist', {
			defaultBehavior: {
				origin: apiOrigin,
				viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
				cachePolicy: cachePolicy,
				compress: true,
				allowedMethods: AllowedMethods.ALLOW_ALL,
				cachedMethods: CachedMethods.CACHE_GET_HEAD_OPTIONS,
				responseHeadersPolicy: ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS_WITH_PREFLIGHT_AND_SECURITY_HEADERS
			},
			additionalBehaviors: {
				'/js/script.*': {
					origin: analyticsOrigin,
					viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
					allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
				},
				'/api/event': {
					origin: analyticsOrigin,
					viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
					allowedMethods: AllowedMethods.ALLOW_ALL,
					originRequestPolicy: OriginRequestPolicy.USER_AGENT_REFERER_HEADERS
				},
				'api/admin/*': {
					origin: apiOrigin,
					viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
					cachePolicy: adminCachePolicy,
					allowedMethods: AllowedMethods.ALLOW_ALL,
					cachedMethods: CachedMethods.CACHE_GET_HEAD_OPTIONS
				},
				'api/*': {
					origin: apiOrigin,
					viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
					cachePolicy: cachePolicy,
					compress: true,
					allowedMethods: AllowedMethods.ALLOW_ALL,
					cachedMethods: CachedMethods.CACHE_GET_HEAD_OPTIONS,
					responseHeadersPolicy: ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS_WITH_PREFLIGHT_AND_SECURITY_HEADERS
				},
			},
			minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
			sslSupportMethod: SSLMethod.SNI,
			httpVersion: HttpVersion.HTTP2_AND_3,
			priceClass: PriceClass.PRICE_CLASS_ALL,
			domainNames: [buildConfig.stacks.domain.url],
			certificate,
		});
		return cdn;
	};

	private createRoute53Record = (name: string, buildConfig: BuildConfig, distribution: IDistribution): CnameRecord => {
		const hostedZone = HostedZone.fromHostedZoneAttributes(this, `${name}-zone`, {
			zoneName: buildConfig.stacks.domain.hostedZoneName,
			hostedZoneId: buildConfig.stacks.domain.hostedZoneId,
		});

		return new ARecord(this, `${name}-alias`, {
			target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
			zone: hostedZone,
			recordName: buildConfig.stacks.domain.url,
		});
	};
}
