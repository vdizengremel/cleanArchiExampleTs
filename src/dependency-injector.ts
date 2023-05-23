import { Server, ServerRoute } from '@hapi/hapi'
import AuthenticationController from './application/authentication.controller'
import { createAuthenticationRoute } from './application/authentication.route'
import AuthenticateUserUseCase from './core/usecase/authenticate-user.use-case'
import UserRepository from './core/domain/user.repository'
import UserInMemoryRepository from './infrastructure/user-in-memory.repository'
import TokenService from './core/domain/token.service'
import TokenUidService from './infrastructure/token-uid.service'

interface Controllers {
  authenticationController: AuthenticationController
}

interface UseCases {
  authenticateUserUseCase: AuthenticateUserUseCase
}

interface Repositories {
  userRepository: UserRepository
}

interface Services {
  tokenService: TokenService
}

export function injectServer(): Server {
  const repositories = createRepositories()
  const services = createServices()
  const useCases = createUseCases(repositories, services)
  const controllers = createControllers(useCases)
  const routes = createRoutes(controllers)
  return createServer(routes)
}

function createServer(routes: ServerRoute[]): Server {
  const server = new Server({
    port: 3000,
    host: 'localhost',
  })

  server.route(routes)

  return server
}

function createRoutes(controllers: Controllers): ServerRoute[] {
  return [...createAuthenticationRoute(controllers.authenticationController)]
}

function createControllers(useCases: UseCases): Controllers {
  return {
    authenticationController: new AuthenticationController(useCases.authenticateUserUseCase),
  }
}

function createUseCases(repositories: Repositories, services: Services): UseCases {
  return {
    authenticateUserUseCase: new AuthenticateUserUseCase(
      repositories.userRepository,
      services.tokenService
    ),
  }
}

function createRepositories(): Repositories {
  return {
    userRepository: new UserInMemoryRepository(),
  }
}

function createServices(): Services {
  return {
    tokenService: new TokenUidService(),
  }
}
