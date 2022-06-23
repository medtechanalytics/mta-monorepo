import { App } from "@serverless-stack/resources";
import { AppsyncStack } from "./AppsyncStack";
import { DbMigratorStack } from "./DbMigratorStack"
import { DependencyStack } from "./DependencyStack"

export default function (app: App) {
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    bundle: {
      format: "esm",
    },
  });
  app.stack(DependencyStack)
    .stack(DbMigratorStack)
    .stack(AppsyncStack);
}
