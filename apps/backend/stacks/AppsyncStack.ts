import { AppSyncApi, StackContext, use } from "@serverless-stack/resources";
import { DependencyStack } from "./DependencyStack"

export function AppsyncStack({ stack, app }: StackContext) {
  const { zoneName } = use(DependencyStack);

  new AppSyncApi(stack, "GraphqlApi", {
    cdk: {
      graphqlApi: {
        name: `${process.env.APP_NAME}-${app.stage}`
      }
    },
    customDomain: `api.${zoneName}`,
    schema: "graphql/schema.graphql"
  });

}
