import { App } from "@serverless-stack/resources";
import { DependencyStack } from "./DependencyStack"
import { RdsStack } from "./RdsStack";
import { DbInitializerStack } from "./DbInitializerStack";
import { DynamoTableStack } from "./DynamoTableStack"

export default function (app: App) {
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    bundle: {
      format: "esm",
    },
  });
  app.stack(DependencyStack);
  if (!process.env.DB_STAGE || process.env.DB_STAGE === app.stage)
    app.stack(RdsStack);
  app.stack(DbInitializerStack);
  app.stack(DynamoTableStack);
}
