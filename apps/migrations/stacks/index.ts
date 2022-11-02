import { App } from "@serverless-stack/resources";
import { DependencyStack } from "./DependencyStack"
import { DbMigratorStack } from "./DbMigratorStack"

export default function (app: App) {
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    bundle: {
      format: "esm",
    },
  });
  app.stack(DependencyStack)
    .stack(DbMigratorStack)
}
