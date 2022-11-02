import { StackContext } from "@serverless-stack/resources";
import { aws_route53 as route53, Duration, Fn, Tags } from "aws-cdk-lib";
import fs from 'fs';

export function DnsStack({ stack, app }: StackContext) {
  const zoneName: string = (app.stage === 'production' ? process.env.DNS_ZONE_NAME : `${app.stage}.${process.env.DNS_ZONE_NAME}`) as string;

  const dnsZone = new route53.PublicHostedZone(stack, 'HostedZone', {
    zoneName
  });
  Tags.of(dnsZone).add('Name', `${process.env.APP_NAME}/${app.stage}/HostedZone`);

  if (app.stage === 'production') {
    const nameservers = JSON.parse(fs.readFileSync('subdomains.json', 'utf-8'))
    for (const subdomain in nameservers) {
      new route53.NsRecord(stack, `NSRecord-${subdomain}`, {
        zone: dnsZone,
        recordName: subdomain,
        values: nameservers[subdomain],
        ttl: Duration.minutes(90)
      });
    }
  }

  stack.addOutputs({
    DnsZone: dnsZone.zoneName,
    NS0: Fn.select(0, dnsZone.hostedZoneNameServers as string[]),
    NS1: Fn.select(1, dnsZone.hostedZoneNameServers as string[]),
    NS2: Fn.select(2, dnsZone.hostedZoneNameServers as string[]),
    NS3: Fn.select(3, dnsZone.hostedZoneNameServers as string[])
  });
}
