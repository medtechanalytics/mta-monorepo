import { User, userFromItem } from "../entities/user"
import { athenaClient } from '../libs/athenaClient'

interface Props {
  user: User
}

export const getUser = async ({
                                user,

                              }: Props) => {


  const query = {
    sql: `SELECT *
          FROM "users"
          WHERE id = \'${user.id}\';`,
    db: process.env.ATHENA_DB
  }
  try {
    const results = await athenaClient.query(query);


    return {
      users: results.Items.map(x => userFromItem(x))
    }
  }
  catch (error) {
    console.log('Error retrieving user', error)
    return {
      error: 'Could not retrieve user'
    }
  }
}