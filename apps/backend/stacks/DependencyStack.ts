import { StackContext } from "@serverless-stack/resources";
import { aws_ec2 as ec2, aws_route53 as route53 } from "aws-cdk-lib";

export function DependencyStack({ stack, app }: StackContext) {

  const zoneName: string = (app.stage === 'production' ? process.env.DNS_ZONE_NAME : `${app.stage}.${process.env.DNS_ZONE_NAME}`) as string;

  const vpc = ec2.Vpc.fromLookup(stack, 'vpc', {
    vpcName: `vpc/${process.env.APP_NAME}-${process.env.VPC_STAGE || app.stage}`
  })

  const hostedZone = route53.HostedZone.fromLookup(stack, 'hostedZone', {
    domainName: zoneName
  })

  const rdsClusterName = `${process.env.DB_STAGE || app.stage}-${process.env.APP_NAME}`
  const rdsSecretName = `${process.env.DB_STAGE || app.stage}/rds/${rdsClusterName}`
  const dbName = `${process.env.APP_NAME}_${app.stage}`
  const dbSecretName = `${app.stage}/db/${dbName}`;

  return { vpc, hostedZone, zoneName, rdsClusterName, rdsSecretName, dbName, dbSecretName };
}
