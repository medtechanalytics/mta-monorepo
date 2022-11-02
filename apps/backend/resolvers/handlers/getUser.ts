import { User } from '../entities/user';
import { getUser } from '../data/getUser'

export async function handler (
  input: any
): Promise<User[]> {

  if (!input.athleteId) {
    return new Promise((resolve) => {
      resolve([])
    })
  }

  const userInput = new User({
    id: input.userId
  })

  const { users, error } = await getUser({
    user: userInput
  })

  return new Promise((resolve, reject) => {
    if (error)
      reject(error)
    resolve(users)
  })
}