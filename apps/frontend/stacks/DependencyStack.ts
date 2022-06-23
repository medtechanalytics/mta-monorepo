import { StackContext } from "@serverless-stack/resources";
import { aws_route53 as route53 } from "aws-cdk-lib";

export function DependencyStack({ stack, app }: StackContext) {

  const zoneName: string = (app.stage === 'production' ? process.env.DNS_ZONE_NAME : `${app.stage}.${process.env.DNS_ZONE_NAME}`) as string;

  const hostedZone = route53.HostedZone.fromLookup(stack, 'hostedZone', {
    domainName: zoneName
  })

  const apiUrl = `api.${zoneName}`

  return { apiUrl, zoneName, hostedZone };
}
