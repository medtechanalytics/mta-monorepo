import { Auth, StackContext } from "@serverless-stack/resources";
import { UserPoolEmail } from "aws-cdk-lib/aws-cognito";

export function CognitoStack({ stack, app}: StackContext) {

  const domainName = (app.stage === 'production' ?
    process.env.DNS_ZONE_NAME : `${app.stage}.${process.env.DNS_ZONE_NAME}`)

  const auth = new Auth(stack, "Auth", {
      login: ["email", "phone"],
      cdk: {
        userPool: {
          selfSignUpEnabled: true,
          userPoolName: `${app.stage}-${process.env.APP_NAME}`,
          signInCaseSensitive: false,
          standardAttributes: {
            email: {
              mutable: false,
              required: true
            },
            fullname: {
              mutable: true,
              required: false
            },
          },
          passwordPolicy: {
            minLength: 8,
            requireLowercase: false,
            requireDigits: false,
            requireSymbols: false,
            requireUppercase: false
          },
          email: UserPoolEmail.withSES({
            fromEmail: `${process.env.EMAIL_FROM_PREFIX}@${domainName}`,
            // fromName: '',
            sesRegion: app.region,
            sesVerifiedDomain: domainName
          })
        }
      }
    }
  );

  auth.cdk.userPool.addDomain('userPoolDomain', {
    cognitoDomain: {
      domainPrefix: (app.stage === 'production' ?
        `${process.env.APP_NAME}` :
        `${process.env.APP_NAME}-${app.stage}`)
    }
  })


}
