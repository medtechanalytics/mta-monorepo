import { StackContext } from "@serverless-stack/resources";
import { VerifySesDomain, VerifySesEmailAddress } from "@seeebiii/ses-verify-identities";
import { EmailForwardingRuleSet } from "@seeebiii/ses-email-forwarding";

export function SesStack({ stack, app }: StackContext) {

  const domainName: string = app.stage === 'production' ?
    `${process.env.DNS_ZONE_NAME}` : `${app.stage}.${process.env.DNS_ZONE_NAME}`;

  new VerifySesDomain(stack, 'SesDomainVerification', {
    domainName
  });

  if (process.env.EMAILS_TO_VERIFY) {
    (<string>process.env.EMAILS_TO_VERIFY).split(';').map((email, id) =>
      new VerifySesEmailAddress(stack, `SesEmailVerification-${id}`, {
        emailAddress: email
      })
    );
  }

  new VerifySesEmailAddress(stack, 'SesEmailVerificationNoReply', {
    emailAddress: `${process.env.EMAIL_FROM_PREFIX}@${domainName}`
  })

  if ((app.stage === 'production') && process.env.CATCH_ALL_EMAIL_FORWARD_TO) {
    new EmailForwardingRuleSet(stack, 'CatchAllEmailFowarder', {
      enableRuleSet: true,
      ruleSetName: `${process.env.APP_NAME}-catch-all-forwarding`,
      emailForwardingProps: [{
        domainName,
        verifyDomain: false,
        fromPrefix: process.env.EMAIL_FROM_PREFIX || 'noreply',
        verifyTargetEmailAddresses: true,
        emailMappings: [
          {
            receiveEmail: domainName,
            targetEmails: [process.env.CATCH_ALL_EMAIL_FORWARD_TO]
          }]
      }]
    });
  }
}
