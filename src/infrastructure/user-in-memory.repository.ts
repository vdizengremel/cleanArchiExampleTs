import UserRepository from '../core/domain/user.repository'
import User from '../core/domain/user'

export default class UserInMemoryRepository implements UserRepository {
  private readonly users: User[]

  constructor() {
    this.users = []
    this.users.push(new User('jean.bon', 'valid'))
  }

  async findByName(name: string): Promise<User | undefined> {
    return this.users.find((user) => user.name === name)
  }
}
