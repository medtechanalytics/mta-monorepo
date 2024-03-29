import { StackContext, use } from "@serverless-stack/resources";
import { aws_ec2 as ec2, aws_logs as logs } from "aws-cdk-lib";
import { VpcStack } from "./VpcStack"
import { ISubnet } from "aws-cdk-lib/aws-ec2"

export function VpnStack({ stack, app }: StackContext) {
  const { vpc } = use(VpcStack);

  const logGroup = new logs.LogGroup(stack, `vpcLogGroup`, {
    logGroupName: app.logicalPrefixedName('vpn-logs'),
    retention: logs.RetentionDays.ONE_MONTH
  });

  const securityGroup = new ec2.SecurityGroup(stack, `vpnSecurityGroup`, {
    vpc,
    allowAllOutbound: true,
  })

  if (process.env.VPN_CERTIFICATE_SERVER && process.env.VPN_CERTIFICATE_CLIENT) {

    const subnets: ISubnet[] = vpc.privateSubnets.filter( x => x.subnetId === vpc.privateSubnets[0].subnetId);

    new ec2.ClientVpnEndpoint(stack, 'vpcEndpoint', {
      vpc,
      vpcSubnets: {
        subnets: subnets,
      },
      cidr: process.env.VPN_CIDR || '10.100.0.0/16',
      serverCertificateArn: process.env.VPN_CERTIFICATE_SERVER as string,
      clientCertificateArn: process.env.VPN_CERTIFICATE_CLIENT as string,
      logGroup,
      securityGroups: [securityGroup],
      splitTunnel: true
    })
  }

}
