export class User {

  public id: string;
  public email: string;

  constructor({
                id = undefined, email = undefined
              }) {
    this.id = id
    this.email = email;
  }
}

export const userFromItem = (item) => {
  return new User({
    id: item.id,
    email: item.email
  })
}
