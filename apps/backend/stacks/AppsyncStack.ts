import { AppSyncApi, StackContext, use } from "@serverless-stack/resources";
import * as appsync_lib from "@aws-cdk/aws-appsync-alpha";
import { DependencyStack } from "./DependencyStack"
import { Expiration, Duration } from "aws-cdk-lib";

export function AppsyncStack({ stack, app }: StackContext) {
  const { zoneName, userPool } = use(DependencyStack);

  const additionalAuthModes = stack.stage === 'production' ? {} : {
    additionalAuthorizationModes: [{
      authorizationType: appsync_lib.AuthorizationType.API_KEY,
      apiKeyConfig: {
        name: `${stack.stage}-test-api-key`,
        description: `API Key for Testing Purposes Only (${stack.stage})`,
        expires: Expiration.after(Duration.days(365))
      }
    }]
  }

  const api = new AppSyncApi(stack, "GraphqlApi", {
    cdk: {
      graphqlApi: {
        name: `${process.env.APP_NAME}-${app.stage}`,
        authorizationConfig: {
          defaultAuthorization: {
            authorizationType: appsync_lib.AuthorizationType.USER_POOL,
            userPoolConfig: {
              userPool,
            },
          },
          ...additionalAuthModes
        },
      }
    },
    customDomain: `api.${zoneName}`,
    schema: "graphql/schema.graphql"
  });

  return { api }

}
