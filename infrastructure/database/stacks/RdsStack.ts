import { RDS, StackContext, use } from "@serverless-stack/resources";
import { DependencyStack } from "./DependencyStack"
import {
  Duration,
  aws_ec2 as ec2,
  aws_rds as rds,
  aws_kms as kms,
  aws_route53 as route53,
  Aspects,
} from "aws-cdk-lib"
import { CfnDBCluster } from "aws-cdk-lib/aws-rds"

export function RdsStack({ stack, app }: StackContext) {
  const { vpc, hostedZone, rdsClusterName, rdsSecretName } = use(DependencyStack)

  const POSTGRES_PORT = 5432;

  const storageEncryptionKey = new kms.Key(stack, 'dbKey', {
    enableKeyRotation: true
  });
  storageEncryptionKey.addAlias(`alias/${app.name}/${app.stage}/rds`);

  const sg = new ec2.SecurityGroup(stack, 'rdsSecurityGroup', {
    vpc,
    securityGroupName: `${process.env.APP_NAME}-${app.stage}-rds`
  })
  sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(POSTGRES_PORT), 'RDS Ingress')

  const engine = rds.DatabaseClusterEngine.auroraPostgres({
    version: rds.AuroraPostgresEngineVersion.VER_14_4,
  })

  const parameterGroup = new rds.ParameterGroup(stack, "serverlessParameterGroup", {
    engine,
    description: `serverless v2 parameter group ${app.stage}`
  })

  const dbCluster = new rds.DatabaseCluster(stack, 'ServerlessDbCluster', {
    engine,
    credentials: {
      username: `${process.env.APP_NAME}_admin`,
      secretName: rdsSecretName,
    },
    storageEncrypted: true,
    storageEncryptionKey,
    clusterIdentifier: rdsClusterName,
    parameterGroup,
    deletionProtection: true,
    backup: {
      retention: Duration.days(7)
    },
    instances: 1,
    instanceProps: {
      vpc,
      instanceType: new ec2.InstanceType('serverless'),
      autoMinorVersionUpgrade: true,
      publiclyAccessible: false,
      securityGroups: [sg],
      vpcSubnets: vpc.selectSubnets({
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      }),
      enablePerformanceInsights: true
    },
    port: POSTGRES_PORT
  })

  Aspects.of(dbCluster).add({
    visit(node) {
      if (node instanceof CfnDBCluster) {
        node.serverlessV2ScalingConfiguration = {
          minCapacity: 0.5,
          maxCapacity: 8,
        }
      }
    },
  })

  // new route53.CnameRecord(stack, 'dbCname', {
  //   zone: hostedZone,
  //   recordName: 'db',
  //   domainName: db.clusterEndpoint.hostname
  // })

}
