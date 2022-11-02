import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';


// Update with your config settings.

async function fetchConfiguration() {
  const SecretId = process.env.RDS_SECRET;
  console.log(`Retrieving credentials from ${SecretId}`);

  const secretsManager = new SecretsManagerClient({});
  const secret = await secretsManager.send(
    new GetSecretValueCommand({ SecretId })
  );

  if (!secret.SecretString)
    throw new Error("Database connection settings not found.")

  const credentials = JSON.parse(secret.SecretString);

  return {
    connection: {
      host: credentials.host,
      user: credentials.username,
      password: credentials.password,
      database: credentials.dbname,
      ssl: true
    },
  }
}

module.exports = async () => {
  let configuration = {}
  try {
    configuration = await fetchConfiguration();
  }
  catch {
    console.log("Could not get credentials")
  }
  return {
    ...configuration,
    client: 'pg',
    debug: false,
    pool: {
      min: 2,
      max: 10
    },
    seeds: {
      directory: [
        process.env.RDS_SEEDS_PATH || './seeds'
      ]
    },
    migrations: {
      tableName: "knex_migrations",
      extension: 'js',
      directory: [
        process.env.RDS_MIGRATIONS_PATH || './migrations'
      ]
    }
  }
};
