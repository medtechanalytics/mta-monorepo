import { App } from "@serverless-stack/resources";
import { AppsyncStack } from "./AppsyncStack";
import { DependencyStack } from "./DependencyStack"
import { ResolversStack } from "./ResolversStack"

export default function (app: App) {
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    bundle: {
      format: "esm",
    },
  });
  app.stack(DependencyStack)
    .stack(AppsyncStack)
    .stack(ResolversStack);
}
