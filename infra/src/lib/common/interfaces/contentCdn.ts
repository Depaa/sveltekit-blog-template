import { StackProps } from "aws-cdk-lib";

export interface ContentCdnStackProps extends StackProps {
  readonly blogContentCertificateArn: string;
}
