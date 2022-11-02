import * as sst from '@serverless-stack/resources';
import { StackContext, use } from "@serverless-stack/resources"
import { MappingTemplate } from '@aws-cdk/aws-appsync-alpha';
import _ from 'lodash';
import { DependencyStack } from "./DependencyStack"
import { AppsyncStack } from "./AppsyncStack"


export function ResolversStack({ stack, app }: StackContext) {

  const { api } = use(AppsyncStack);
  const { vpc, zoneName, dbSecretName, dbName, rdsClusterName } = use(DependencyStack);

  const queryLambda = new sst.Function(stack, 'queryLambda', {
    srcPath: 'resolvers/',
    handler: 'query.main',
    runtime: 'nodejs14.x',
    timeout: '30 seconds',
    environment: {
      ATHENA_DB: _.snakeCase(`${app.stage}-${process.env.APP_NAME}`),
      SITE_URL: `www.${zoneName}`,
      NOREPLY_EMAIL: `no-reply@${zoneName}`,
      RDS_ARN: `arn:aws:rds:${app.region}:${app.account}:cluster:${rdsClusterName}`,
      RDS_SECRET: `arn:aws:secretsmanager:${app.region}:${app.account}:secret:${dbSecretName}`,
      RDS_DATABASE: dbName,
      RDS_ENGINE: process.env.RDS_ENGINE || 'postgres',
    },
    permissions: ['secretsmanager', 'ses', 'athena', 'glue', 's3', 'kms'],
    bundle: {
      nodeModules: ['pg', 'knex'],
      // copyFiles: [
      //   {
      //     from: 'data',
      //     to: 'data'
      //   }
      // ]
    },
    vpc,
  });


  const localizeVtl = (filename: string, params: { [field: string]: string } = {}) => {
    const mt = MappingTemplate.fromFile(filename);
    const localizationString = `#set ($stage = "${stack.stage}")`;
    let renderedTemplate = mt.renderTemplate();
    Object.entries(params).forEach(([field, value]) => {
      const searchFor = new RegExp(`\{\{\\s*${_.escapeRegExp(field)}\\s*\}\}`);
      renderedTemplate = renderedTemplate.split(searchFor).join(value);
    });
    return MappingTemplate.fromString(
      `${localizationString}\n${renderedTemplate}`
    );
  }

  const addQueryResolvers = () => {
    const queryTypes = [
      'getUsers',
      'getUser'
    ];
    api.addDataSources(stack, {
      queryLambda: {
        function: queryLambda,
      },
    });
    queryTypes.forEach((queryType) => {
      console.log(`Query ${queryType}`);
      api.addResolvers(stack, {
        [`Query ${queryType}`]: {
          dataSource: 'queryLambda',
          cdk: {
            resolver: {
              requestMappingTemplate: localizeVtl(
                'resolvers/vtl/query/defaultQueryRequest.vtl.hbs',
                { queryType }
              ),
              responseMappingTemplate: MappingTemplate.lambdaResult(),
            },
          },
        },
      });
    });
  }

  const addMutationResolvers = () => {
    const mutationTypes = [
      'createUser'
    ];
    api.addDataSources(stack, {
      mutationLambda: {
        function: queryLambda,
      },
    });
    mutationTypes.forEach((mutationType) => {
      console.log(`Mutation ${mutationType}`);
      api.addResolvers(stack, {
        [`Mutation ${mutationType}`]: {
          dataSource: 'mutationLambda',
          cdk: {
            resolver: {
              requestMappingTemplate: localizeVtl(
                'resolvers/vtl/mutations/defaultMutationRequest.vtl.hbs',
                { mutationType }
              ),
              responseMappingTemplate: MappingTemplate.lambdaResult(),
            },
          },
        },
      });
    });
  }

  addQueryResolvers();
  addMutationResolvers();

}
