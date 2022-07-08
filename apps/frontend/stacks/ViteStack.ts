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
      VITE_API_URL: apiUrl,
      VITE_COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID as string,
      VITE_COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID as string,
      VITE_COGNITO_DOMAIN: process.env.COGNITO_DOMAIN as string,
      VITE_COGNITO_CALLBACK: process.env.COGNITO_CALLBACK as string,
      VITE_APP_VERSION: process.env.APP_VERSION as string
    }
  })

}
