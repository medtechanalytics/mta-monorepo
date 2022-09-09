// Credit to the Serverless Stack team
// Source: https://raw.githubusercontent.com/serverless-stack/serverless-stack/master/packages/resources/assets/RDS/migrator/index.js

"use strict";

import * as path from "path";
import { promises as fs } from 'fs';
import { Kysely, Migrator, NO_MIGRATIONS, FileMigrationProvider } from "kysely";
import { DataApiDialect } from "kysely-data-api";
import RDSDataService = require("aws-sdk/clients/rdsdataservice");

export async function handler(evt: any) {
  const db = new Kysely<any>({
    dialect: new DataApiDialect({
      mode: process.env.RDS_ENGINE_MODE === 'mysql' ? 'mysql': 'postgres',
      driver: {
        client: new RDSDataService(),
        database: evt?.database || process.env.RDS_DATABASE,
        secretArn: process.env.RDS_SECRET || '',
        resourceArn: process.env.RDS_ARN || ''
      }
    })
  })

  const __dirname = path.resolve();
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, 'migrations'),
      // path.resolve(process.env.RDS_MIGRATIONS_PATH)
    })
  });

  if (!evt.type || evt.type === "latest") {
    const result = await migrator.migrateToLatest();
    const err = result.error || result.results?.find(r => r.status === "Error");
    if (err) throw err;
    return result;
  }

  if (evt.type === "to") {
    if (!evt.data?.name) return await migrator.migrateTo(NO_MIGRATIONS);
    const result = await migrator.migrateTo(evt.data.name);
    const err = result.error || result.results?.find(r => r.status === "Error");
    if (err) throw err;
    return result;
  }

  if (evt.type === "list") {
    return await migrator.getMigrations();
  }

  if (evt.type === "down") {
    return await migrator.migrateDown();
  }

}