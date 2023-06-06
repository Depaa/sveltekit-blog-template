export interface BuildConfig {
  readonly account: string;
  readonly region: string;
  readonly environment: string;
  readonly project: string;
  readonly version: string;
  readonly build: string;
  readonly stacks: BuildStaks;
}

interface BuildStaks {
  api: APIStack;
  domain: DomainsStack;
}

interface APIStack {
  key: string;
}

interface DomainsStack {
  url: string;
  content: string;
  hostedZoneId: string;
  hostedZoneName: string;
}