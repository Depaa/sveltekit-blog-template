import { App, Stack, StackProps } from 'aws-cdk-lib';
import { CertificateValidation, DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { HostedZone, IHostedZone } from 'aws-cdk-lib/aws-route53';
import { BuildConfig } from '../lib/common/config.interface';

export class DomainsStack extends Stack {
  public readonly urlCertificate: DnsValidatedCertificate;
  public readonly contentCertificate: DnsValidatedCertificate;

  constructor(scope: App, id: string, props: StackProps, buildConfig: BuildConfig) {
    super(scope, id, props);

    const hostedZone = HostedZone.fromHostedZoneAttributes(this, id, {
      zoneName: buildConfig.stacks.domain.hostedZoneName,
      hostedZoneId: buildConfig.stacks.domain.hostedZoneId,
    });

    const domainName = buildConfig.stacks.domain.url;
    const contentDomainName = buildConfig.stacks.domain.content;

    this.urlCertificate = this.createCertificate(`${id}-url`, domainName, hostedZone, 'us-east-1', buildConfig);
    this.contentCertificate = this.createCertificate(`${id}-content`, contentDomainName, hostedZone, 'us-east-1', buildConfig);
  }

  private createCertificate = (name: string, domainName: string, hostedZone: IHostedZone, region: string, buildConfig: BuildConfig): DnsValidatedCertificate => {
    return new DnsValidatedCertificate(this, name, {
      domainName,
      validation: CertificateValidation.fromDns(hostedZone),
      hostedZone,
      region,
      cleanupRoute53Records: buildConfig.environment !== 'prod' ? true : false,
    });
  };
}
