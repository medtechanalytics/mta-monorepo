import { App } from "@serverless-stack/resources";
import { VpcStack } from "./VpcStack";
import { DnsStack } from "./DnsStack";
import { VpnStack } from "./VpnStack"

export default function (app: App) {
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    bundle: {
      format: "esm",
    },
  });

  app.stack(DnsStack);

  if (!process.env.USE_VPC || process.env.USE_VPC === app.stage) {
    app.stack(VpcStack)
    if (process.env.DEPLOY_VPN?.toLowerCase() === 'true')
      app.stack(VpnStack);
  }
}
