import { App } from "@serverless-stack/resources";
import { StorageStack } from "./StorageStack"

export default function (app: App) {
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    bundle: {
      format: "esm",
    },
  });

  app.stack(StorageStack)
}
