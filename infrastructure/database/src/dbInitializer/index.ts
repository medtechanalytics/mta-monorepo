import { Pool } from 'pg';
import * as AWS from 'aws-sdk';
import _ from 'lodash';
import crypto from 'crypto';

function generatePassword(l: number) {
  return Array(l)
    .fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")
    .map(function (x) {
      return x[crypto.randomInt(0, 10_000) % x.length];
    })
    .join("");
}

interface ScriptParams {
  params: {
    stage: string,
    rdsSecretName: string,
    dbName: string,
    dbSecretName: string,
  }
}

let pgPool: Pool;
let secretParams: {
  username: string,
  password: string,
  host: string,
  port: number | string,
  dbname: string,
  dbClusterIdentifier: string,
  engine: string
};

const sm = new AWS.SecretsManager();

exports.handler = async ({ params }: ScriptParams) => {

  const { rdsSecretName, stage, dbName, dbSecretName } = params;

  if (!secretParams) {
    const secret: any = await sm.getSecretValue({ SecretId: rdsSecretName }).promise();
    secretParams = JSON.parse(secret.SecretString);
  }

  if (!pgPool) {
    pgPool = new Pool({
      user: secretParams.username,
      password: secretParams.password,
      host: secretParams.host,
      database: secretParams.dbname,
      port: secretParams.port as number,
      ssl: true
    });
  }
  const pgClient = await pgPool.connect();

  const queryResult = await pgClient.query("SELECT datname as Database FROM pg_database;");

  const dbExists = _.size(queryResult.rows.filter(row => row.database === dbName))
  if (dbExists) {
    console.log(`Database ${dbName} already exists.`);
    return;
  }

  const dbUser = `${secretParams.username}_${stage}`;
  const dbPassword = generatePassword(12);
  const dbSecretString = JSON.stringify({
    ...secretParams, ...{
      username: dbUser,
      password: dbPassword,
      dbname: dbName
    }
  })

  console.log(`Creating ${dbName}.`);
  try {
    await pgClient.query(`CREATE DATABASE ${dbName};`);
    await pgClient.query(`REVOKE ALL ON DATABASE ${dbName} FROM public;`);

    await pgClient.query('BEGIN')
    await pgClient.query(`CREATE USER ${dbUser} WITH ENCRYPTED PASSWORD '${dbPassword}';`)
    await pgClient.query(`GRANT ALL PRIVILEGES ON DATABASE ${dbName} TO ${dbUser};`)
    await pgClient.query('COMMIT')

    const secretsList = await sm.listSecrets().promise();

    if (_.size(_.get(secretsList, 'SecretList', []).filter(secret => secret.Name === dbSecretName))) {
      console.log(`Updating secret ${dbSecretName}`)
      await sm.updateSecret({
        SecretId: dbSecretName,
        SecretString: dbSecretString
      }).promise()
    }
    else {
      console.log(`Creating new secret ${dbSecretName}`)
      await sm.createSecret({
        Name: dbSecretName,
        SecretString: dbSecretString
      }).promise()
    }
  }
  catch (e) {
    await pgClient.query('ROLLBACK')
    throw e
  }
  finally {
    pgClient.release()
  }

  return {
    "statusCode": 200
  }
}