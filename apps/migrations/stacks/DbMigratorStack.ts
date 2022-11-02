import { Script, StackContext, use } from "@serverless-stack/resources";
import { aws_ec2 as ec2 } from "aws-cdk-lib"
import { DependencyStack } from "./DependencyStack"

export function DbMigratorStack({ stack, app }: StackContext) {
  const { vpc, dbSecretName } = use(DependencyStack);

  const migrationsSource = 'migrations';
  const migrationsDestination = "migrations";

  new Script(stack, "MigrationScript", {
      onCreate: {
        handler: 'dbMigrator/index.handler',
        srcPath: 'src',
        timeout: 120,
        functionName: app.logicalPrefixedName('migration-on-create')
      },
      onUpdate: {
        handler: 'dbMigrator/index.handler',
        srcPath: 'src',
        timeout: 120,
        functionName: app.logicalPrefixedName('migration-on-update')
      },
      defaults: {
        function: {
          logRetention: "two_weeks",
          runtime: "nodejs14.x",
          memorySize: 1024,
          timeout: 900,
          permissions: ["secretsmanager"],
          vpc,
          vpcSubnets: {
            subnetType: ec2.SubnetType.PRIVATE_WITH_NAT
          },
          environment: {
            RDS_SECRET: `arn:aws:secretsmanager:${app.region}:${app.account}:secret:${dbSecretName}`,
            RDS_MIGRATIONS_PATH: './migrations'
          },
          bundle: {
            nodeModules: ['pg', 'knex'],
            copyFiles: [
              {
                from: migrationsSource,
                to: migrationsDestination
              },
              {
                from: '../certs',
                to: 'certs'
              }
            ]
          }
        }
      }
    }
  );

}
