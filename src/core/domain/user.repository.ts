import User from './user'

export default interface UserRepository {
  findByName(name: string): Promise<User | undefined>
}
