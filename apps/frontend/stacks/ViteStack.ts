import { StackContext, use, ViteStaticSite } from "@serverless-stack/resources";
import { DependencyStack } from "./DependencyStack"

export function ViteStack({ stack }: StackContext) {
  const { apiUrl, zoneName, hostedZone } = use(DependencyStack);

  new ViteStaticSite(stack, 'viteStack', {
    path: 'vite',
    customDomain: {
      domainName: zoneName,
      domainAlias: `www.${zoneName}`,
      hostedZone: hostedZone.zoneName
    },
    environment: {
      VITE_API_URL: apiUrl
    }
  })

}
