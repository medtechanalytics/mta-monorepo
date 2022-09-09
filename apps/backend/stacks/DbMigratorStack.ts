import { Script, StackContext, use } from "@serverless-stack/resources";
import { aws_ec2 as ec2 } from "aws-cdk-lib"
import { DependencyStack } from "./DependencyStack"

export function DbMigratorStack({ stack, app }: StackContext) {
  const { vpc, rdsClusterName, dbName, dbSecretName } = use(DependencyStack);

  const migrationsSource = 'migrations';
  const migrationsDestination = "migrations";

  new Script(stack, "MigrationScript", {
      onCreate: {
        handler: 'dbMigrator/index.handler',
        srcPath: 'src',
        timeout: 60,
        functionName: app.logicalPrefixedName('migration-on-create')
      },
      onUpdate: {
        handler: 'dbMigrator/index.handler',
        srcPath: 'src',
        timeout: 60,
        functionName: app.logicalPrefixedName('migration-on-update')
      },
      defaults: {
        function: {
          logRetention: "two_weeks",
          runtime: "nodejs14.x",
          memorySize: 1024,
          timeout: 900,
          permissions: ["secretsmanager", "rds-data"],
          vpc,
          vpcSubnets: {
            subnetType: ec2.SubnetType.PRIVATE_WITH_NAT
          },
          environment: {
            RDS_ARN: `arn:aws:rds:${app.region}:${app.account}:cluster:${rdsClusterName}`,
            RDS_SECRET: `arn:aws:secretsmanager:${app.region}:${app.account}:secret:${dbSecretName}`,
            RDS_DATABASE: dbName,
            RDS_ENGINE_MODE: "postgres",
            RDS_MIGRATIONS_PATH: app.local ? migrationsSource : migrationsDestination
          },
          bundle: {
            nodeModules: ['pg', "kysely", "kysely-data-api"],
            format: "esm",
            copyFiles: [
              {
                from: migrationsSource,
                to: migrationsDestination
              }
            ]
          }
        }
      }
    }
  );

}
