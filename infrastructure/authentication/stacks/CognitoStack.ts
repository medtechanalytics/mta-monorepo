import { Auth, StackContext } from "@serverless-stack/resources";
import {
  UserPoolEmail, VerificationEmailStyle,
  UserPoolIdentityProviderGoogle, ProviderAttribute,
  UserPoolClientIdentityProvider,
  StringAttribute
} from "aws-cdk-lib/aws-cognito";

export function CognitoStack({ stack, app }: StackContext) {

  const domainName = (app.stage === 'production' ?
    process.env.DNS_ZONE_NAME : `${app.stage}.${process.env.DNS_ZONE_NAME}`)

  const auth = new Auth(stack, "Auth", {
      login: ["email"],
      cdk: {
        userPool: {
          selfSignUpEnabled: true,
          userPoolName: `${app.stage}-${process.env.APP_NAME}`,
          signInCaseSensitive: false,
          standardAttributes: {
            email: {
              mutable: true,
              required: true
            },
            fullname: {
              mutable: true,
              required: false
            },
          },
          customAttributes: {
            refreshToken: new StringAttribute({ mutable: true }),
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
            sesVerifiedDomain: domainName,
          }),
          userVerification: {
            emailSubject: `Verification Code for ${domainName}`,
            emailBody: 'Your verification code is {####}',
            emailStyle: VerificationEmailStyle.CODE,
            smsMessage: 'Your verification code is {####}',
          },
        }
      }
    }
  );

  const google = new UserPoolIdentityProviderGoogle(stack, 'Google', {
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    userPool: auth.cdk.userPool,
    scopes: [
      "profile email openid"
    ],
    attributeMapping: {
      email: ProviderAttribute.GOOGLE_EMAIL,
      givenName: ProviderAttribute.GOOGLE_GIVEN_NAME,
      familyName: ProviderAttribute.GOOGLE_FAMILY_NAME,
      gender: ProviderAttribute.GOOGLE_GENDER,
      phoneNumber: ProviderAttribute.GOOGLE_PHONE_NUMBERS,
      custom: {
        refreshToken: ProviderAttribute.other('refresh_token')
      }
    },
  });

  const client = auth.cdk.userPool.addClient('app-client', {
    supportedIdentityProviders: [
      UserPoolClientIdentityProvider.GOOGLE,
      UserPoolClientIdentityProvider.COGNITO
    ],
    generateSecret: false,
    oAuth: {
          callbackUrls: [
            `https://${domainName}/oauth`,
            "http://localhost:3000/oauth",
          ],
          logoutUrls: [
            `https://${domainName}`,
            "http://localhost:3000",
          ],

    }
  });
  client.node.addDependency(google);

  auth.cdk.userPool.addDomain('userPoolDomain', {
    cognitoDomain: {
      domainPrefix: (app.stage === 'production' ?
        `${process.env.APP_NAME}` :
        `${process.env.APP_NAME}-${app.stage}`)
    }
  })


}
