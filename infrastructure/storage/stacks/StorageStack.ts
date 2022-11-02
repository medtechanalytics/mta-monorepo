import { Bucket, StackContext } from "@serverless-stack/resources";
import { aws_kms as kms, aws_s3 as s3, RemovalPolicy } from "aws-cdk-lib";

export function StorageStack({ stack, app }: StackContext) {

  const encryptionKey = new kms.Key(stack, `${app.stage}-s3key`, {
    removalPolicy: RemovalPolicy.RETAIN,
    description: 'KMS key for encrypting the objects in an S3 bucket',
  })
  encryptionKey.addAlias(`${app.stage}/s3/${process.env.APP_NAME}`)

  const bucketSuffix = app.stage === 'production' ? '' : `-${app.stage}`

  new Bucket(stack, 'bucketDataLake', {
      cdk: {
        bucket: {
          bucketName: `${process.env.APP_NAME}-data-lake${bucketSuffix}`,
          blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
          removalPolicy: RemovalPolicy.RETAIN,
          bucketKeyEnabled: true,
          encryption: s3.BucketEncryption.KMS,
          encryptionKey,
          eventBridgeEnabled: true
        },
      },
    })

  new Bucket(stack, 'bucketAthena', {
    cdk: {
      bucket: {
        bucketName: `${process.env.APP_NAME}-athena${bucketSuffix}`,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        removalPolicy: RemovalPolicy.RETAIN,
        bucketKeyEnabled: true,
        encryption: s3.BucketEncryption.KMS,
        encryptionKey
      },
    },
  })
}
