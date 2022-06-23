import { RDS, StackContext, use } from "@serverless-stack/resources";
import { DependencyStack } from "./DependencyStack"
import { Duration, aws_ec2 as ec2, aws_rds as rds, aws_kms as kms, aws_route53 as route53 } from "aws-cdk-lib"

export function RdsStack({ stack, app }: StackContext) {
  const { vpc, hostedZone } = use(DependencyStack)

  const clusterIdentifier = `${app.stage}-${process.env.APP_NAME || 'db'}`;
  const clusterSecretName = `${app.stage}/rds/${clusterIdentifier}`;

  const config: any = {
    autoPause: true,
    minCapacity: "ACU_2",
    maxCapacity: "ACU_2",
  };

  const storageEncryptionKey = new kms.Key(stack, 'dbKey', {
    enableKeyRotation: true
  });
  storageEncryptionKey.addAlias(`alias/${app.name}/${app.stage}/rds`);

  const sg = new ec2.SecurityGroup(stack, 'rdsSecurityGroup', {
    vpc,
    securityGroupName: `${process.env.APP_NAME}-${app.stage}-rds`
  })

  const serverlessV1Engine = rds.DatabaseClusterEngine.auroraPostgres({
    version: rds.AuroraPostgresEngineVersion.of('10.4', '10')
  })

  const parameterGroup = new rds.ParameterGroup(stack, 'dbParameterGroup', {
    engine: serverlessV1Engine,
    parameters: {
      'rds.force_ssl': '1'
    }
  });

  const credentials = new rds.DatabaseSecret(stack, 'dbCredentials', {
    secretName: clusterSecretName,
    username: `${process.env.APP_NAME}admin`
  });

  const db = new RDS(stack, "Database", {
    engine: "postgresql10.14",
    defaultDatabaseName: process.env.DB_NAME || 'default',
    scaling: config,
    cdk: {
      cluster: {
        credentials: rds.Credentials.fromSecret(credentials),
        parameterGroup,
        vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,

        },
        storageEncryptionKey,
        clusterIdentifier,
        enableDataApi: true,
        backupRetention: Duration.days(7),
        securityGroups: [sg]
      }
    },
  });
  sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(db.clusterEndpoint.port), 'RDS Ingress')

  new route53.CnameRecord(stack, 'dbCname', {
    zone: hostedZone,
    recordName: 'db',
    domainName: db.clusterEndpoint.hostname
  })

}
