import { handler as getUser } from './handlers/getUser';
import { Identity } from './types';
import { Knex } from "knex"
import _ from "lodash"

// const knexConfiguration = require('../knexfile')

interface QueryEvent {
  type: string; //QueryType | MutationType;
  identity: Identity;
  params:
    | string
    | any;
}

const lookupUserId = async (
  db: Knex<any>,
  identity: Identity
) => {
  let userId = await db.table('user').where({
    sub: identity.claims.sub
  }).select('id')
  console.log(userId)
  if (_.isEmpty(userId)) {
    userId = await db.table('user').insert({
      sub: identity.claims.sub,
      email: identity.claims.email
    }, 'id')
  }
  return _.get(_.first(userId), 'id')
}

export async function main(
  { type, params, identity }: QueryEvent,
  context?: any
): Promise<any> {
  try {
    // console.log(`Invoked with params: `, type, params, identity);

    // const db = require('knex')(await knexConfiguration());

    // const userId: String = await lookupUserId(db, identity)

    switch (type) {
      case 'getUser':
        return await getUser(params.input)
      default:
        throw new Error('Query not implemented');
    }
  }
  catch (error) {
    console.log(error);
    throw error;
  }
}

if (require.main === module) {
  const event = JSON.parse(process.argv[2]) as QueryEvent;
  console.log(`Invoking query main with event ${event}`);
  main(event);
}
