// import { App, Duration, Stack } from 'aws-cdk-lib';
// import { BuildConfig } from '../lib/common/config.interface';
// import { MonitoringStackProps } from '../lib/common/interfaces/monitoring';
// import { Canary, Runtime, Schedule, Test } from '@aws-cdk/aws-synthetics-alpha';
// import { Alarm, ComparisonOperator } from 'aws-cdk-lib/aws-cloudwatch';
// import { Code } from 'aws-cdk-lib/aws-lambda';
// import path = require('path');

// export class ClientMonitoringStack extends Stack {
// 	constructor(scope: App, id: string, props: MonitoringStackProps, buildConfig: BuildConfig) {
// 		super(scope, id, props);

// 		const SCHEDULE = Duration.hours(1)

// 		const canary = new Canary(this, id, {
// 			schedule: Schedule.rate(SCHEDULE),
// 			runtime: Runtime.SYNTHETICS_NODEJS_PUPPETEER_4_0,
// 			test: Test.custom({
// 				code: Code.fromAsset(path.join(__dirname, "../lib/canary")),
// 				handler: "index.handler",
// 			}),
// 			enableAutoDeleteLambdas: true,
// 			environmentVariables: {
// 				URLS: JSON.stringify(props.urls)
// 			}
// 		});

// 		new Alarm(this, `${id}-alarm`, {
// 			metric: canary.metricSuccessPercent({
// 				period: SCHEDULE
// 			}),
// 			evaluationPeriods: 2,
// 			threshold: 90,
// 			comparisonOperator: ComparisonOperator.LESS_THAN_THRESHOLD,
// 		});

// 	}
// }
