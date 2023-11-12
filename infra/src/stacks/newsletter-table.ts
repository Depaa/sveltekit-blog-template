import { App, CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { BuildConfig } from '../lib/common/config.interface';

export class NewsletterTableStack extends Stack {

  constructor(scope: App, id: string, props: StackProps, buildConfig: BuildConfig) {
    super(scope, id, props);

    const newsletterTable = this.createTable(id, buildConfig);   

		new CfnOutput(this, `ExportsOutputNewsletterTableName`, {
			value: newsletterTable.tableName,
			exportName: `${id}-name`,
		});

		new CfnOutput(this, `ExportsOutputNewsletterTableArn`, {
			value: newsletterTable.tableArn,
			exportName: `${id}-arn`,
		});
  }

  private createTable = (name: string, buildConfig: BuildConfig): Table => {
    const table = new Table(this, name, {
      tableName: name,
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: buildConfig.environment != 'prod' ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
      partitionKey: {
        name: 'email',
        type: AttributeType.STRING,
      },
    });

    return table;
  }
}