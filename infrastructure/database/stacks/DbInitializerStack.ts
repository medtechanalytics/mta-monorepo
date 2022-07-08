import { dependsOn, Script, StackContext, use } from "@serverless-stack/resources";
import { RetentionDays } from "aws-cdk-lib/aws-logs"
import { aws_ec2 as ec2 } from "aws-cdk-lib"
import { DependencyStack } from "./DependencyStack"
import { RdsStack } from "./RdsStack"

export function DbInitializerStack({ stack, app }: StackContext) {
  const { vpc, rdsSecretName, dbName, dbSecretName } = use(DependencyStack);

  if (!process.env.DB_STAGE)
    dependsOn(RdsStack);

  new Script(stack, "DbInitializerScript", {
      defaults: {
        function: {
          logRetention: RetentionDays.TWO_WEEKS,
          timeout: 60,
          runtime: "nodejs14.x",
          memorySize: 512,
          permissions: ["secretsmanager"],
          vpc,
          vpcSubnets: {
            subnetType: ec2.SubnetType.PRIVATE_WITH_NAT
          },
          bundle: {
            nodeModules: ['pg'],
          }
        }
      },
      params: {
        rdsSecretName,
        stage: app.stage,
        dbName,
        dbSecretName
      },
      onCreate: "src/dbInitializer/index.handler",
      onUpdate: "src/dbInitializer/index.handler"
    }
  );
}
