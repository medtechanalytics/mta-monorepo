"use strict";

const knexConfiguration = require('../../knexfile')

export async function handler(evt: any) {
  const pg = require('knex')(await knexConfiguration());

  if (!evt.type || evt.type === "latest") {
    try {
      console.log("Migrating to latest");
      const result = await pg.migrate.latest();
      console.log("Completed migrations:", result)
    }
    catch (e) {
      console.log("Failed to migrate to latest.")
      // process.exit(0)
    }
  }

  if (evt.type === "rollback") {
    try {
      console.log("Rolling back migrations");
      const result = await pg.migrate.rollback();
      console.log("Rolled back migrations:", result)
    }
    catch (e) {
      // process.exit(1)
      console.log("Failed rollback.")
      return
    }
  }

  if (!evt.type || evt.type === "latest" || evt.type === "list") {
    try {
      const status = await pg.migrate.list()
      console.log("Applied migrations:", status[0].map((x: any) => x.name));
      console.log("Pending migrations:", status[1].map((x: any) => x.name));
    }
    catch (e) {
      // process.exit(1)
      console.log("Failed list.")
      return
    }
  }

  try {
    await pg.destroy()
  }
  catch (e) {
    console.log("Error closing DB connection", e)
  }
}
