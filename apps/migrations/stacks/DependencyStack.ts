import { StackContext } from "@serverless-stack/resources";
import { aws_ec2 as ec2 } from "aws-cdk-lib";

export function DependencyStack({ stack, app }: StackContext) {

  const zoneName: string = (app.stage === 'production' ? process.env.DNS_ZONE_NAME : `${app.stage}.${process.env.DNS_ZONE_NAME}`) as string;

  const vpc = ec2.Vpc.fromLookup(stack, 'vpc', {
    vpcName: `vpc/${process.env.APP_NAME}-${process.env.VPC_STAGE || app.stage}`
  })

  const rdsClusterName = `${process.env.DB_STAGE || app.stage}-${process.env.APP_NAME}`
  const rdsSecretName = `${process.env.DB_STAGE || app.stage}/rds/${rdsClusterName}`
  const dbName = `${(process.env.APP_NAME || '').replace(/-/g, '')}_${app.stage}`
  const dbSecretName = `${app.stage}/db/${dbName}`;

  return { vpc, zoneName, rdsClusterName, rdsSecretName, dbName, dbSecretName };
}
