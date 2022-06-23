import { StackContext } from "@serverless-stack/resources";
import { aws_ec2 as ec2 } from "aws-cdk-lib";

export function VpcStack({ stack, app }: StackContext) {

  const vpc = new ec2.Vpc(stack, 'vpc', {
    vpcName: `vpc/${process.env.APP_NAME}-${app.stage}`,
    cidr: process.env.CIDR,
    maxAzs: 3,
    natGateways: 1,
    subnetConfiguration: [
      {
        subnetType: ec2.SubnetType.PUBLIC,
        name: 'Public',
        cidrMask: 24,
        mapPublicIpOnLaunch: true
      },
      {
        cidrMask: 24,
        name: 'Application',
        subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
      },
      {
        cidrMask: 24,
        name: 'Database',
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      }
    ],
  })

  stack.addOutputs({
    "VPC": vpc.vpcId,
  });
  return {
    vpc
  }
}
