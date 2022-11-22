import { dependsOn, Script, StackContext, use } from "@serverless-stack/resources";
import { aws_ec2 as ec2, aws_lambda as lambda } from "aws-cdk-lib"
import { DependencyStack } from "./DependencyStack"
import { RdsStack } from "./RdsStack"

export function DbInitializerStack({ stack, app }: StackContext) {
  const { vpc, rdsSecretName, dbName, dbSecretName } = use(DependencyStack);

  if (!process.env.DB_STAGE)
    dependsOn(RdsStack);

  const awsLambdaLayerPg = lambda.LayerVersion.fromLayerVersionArn(stack,
    'nodejs-pg',
    `arn:aws:lambda:${stack.region}:${stack.account}:layer:nodejs-pg:1`)


  new Script(stack, "DbInitializerScript", {
      defaults: {
        function: {
          logRetention: "two_weeks",
          timeout: 60,
          runtime: "nodejs16.x",
          memorySize: 512,
          permissions: ["secretsmanager"],
          vpc,
          vpcSubnets: {
            subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS
          },
          layers: [
            awsLambdaLayerPg
          ],
          bundle: {
            externalModules: ['pg'],
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
