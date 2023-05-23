export default class User {
  constructor(public readonly name: string, private readonly password: string) {}

  hasPassword(password: string): boolean {
    return this.password === password
  }
}
