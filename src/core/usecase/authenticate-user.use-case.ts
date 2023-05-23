import UserRepository from '../domain/user.repository'
import TokenService from '../domain/token.service'
import Token from '../domain/token'

interface AuthenticateUserUseCaseCommand {
  name: string
  password: string
}

export interface AuthenticateUserUseCasePresenter<T> {
  authenticationIsValid(generatedToken: Token): T
  authenticationIsInvalid(): T
  userIsUnknown(): T
  nameOrPasswordIsMissing(): T
}

export default class AuthenticateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService
  ) {}

  async execute<T>(
    command: AuthenticateUserUseCaseCommand,
    presenter: AuthenticateUserUseCasePresenter<T>
  ): Promise<T> {
    if (!command.name || !command.password) {
      return presenter.nameOrPasswordIsMissing()
    }

    const user = await this.userRepository.findByName(command.name)

    if (!user) {
      return presenter.userIsUnknown()
    }

    if (user.hasPassword(command.password)) {
      const generatedToken = this.tokenService.generateToken()
      return presenter.authenticationIsValid(generatedToken)
    }

    return presenter.authenticationIsInvalid()
  }
}
