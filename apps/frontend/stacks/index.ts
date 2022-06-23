import { App } from "@serverless-stack/resources";
import { ViteStack } from "./ViteStack";
import { DependencyStack } from "./DependencyStack"

export default function (app: App) {
  app.stack(DependencyStack)
    .stack(ViteStack);
}
