import { StackProps } from "aws-cdk-lib";

export interface BlogCdnStackProps extends StackProps {
  readonly blogApiId: string;
  readonly blogApiRootId?: string;
  readonly blogApiUrl: string;
  readonly blogCertificateArn: string;
}
