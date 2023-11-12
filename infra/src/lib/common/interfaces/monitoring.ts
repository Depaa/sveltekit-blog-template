import { StackProps } from "aws-cdk-lib";

export interface MonitoringStackProps extends StackProps {
  readonly urls: string[];
}
