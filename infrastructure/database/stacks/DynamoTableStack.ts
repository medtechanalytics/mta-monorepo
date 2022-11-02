import { Table, StackContext } from "@serverless-stack/resources";
import { RemovalPolicy } from "aws-cdk-lib"

export function DynamoTableStack({ stack, app }: StackContext) {

  const tableName = `${app.stage}-${process.env.DYNAMODB_NAME || 'table'}`

  new Table(stack, tableName, {
    fields: {
      primary: "string",
      secondary: "string",
    },
    primaryIndex: { partitionKey: "primary", sortKey: "secondary" },
    cdk: {
      table: {
        tableName,
        removalPolicy: RemovalPolicy.RETAIN,
      },
    },
  });


}
