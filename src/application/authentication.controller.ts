import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi'
import AuthenticateUserUseCase, {
  AuthenticateUserUseCasePresenter,
} from '../core/usecase/authenticate-user.use-case'
import Token from '../core/domain/token'

interface AuthenticateUserRequestBody {
  name: string
  password: string
}

export default class AuthenticationController {
  constructor(private readonly authenticateUserUseCase: AuthenticateUserUseCase) {}

  authenticateUser(request: Request, reply: ResponseToolkit): Promise<ResponseObject> {
    const payload = request.payload as AuthenticateUserRequestBody
    return this.authenticateUserUseCase.execute(
      payload,
      new AuthenticateUserUseCaseHapiPresenter(reply)
    )
  }
}

class AuthenticateUserUseCaseHapiPresenter
  implements AuthenticateUserUseCasePresenter<ResponseObject>
{
  constructor(private readonly reply: ResponseToolkit) {}

  authenticationIsValid(generatedToken: Token): ResponseObject {
    return this.reply.response({ token: generatedToken.value }).code(200)
  }

  authenticationIsInvalid(): ResponseObject {
    return this.reply.response().code(401)
  }

  userIsUnknown(): ResponseObject {
    return this.reply.response().code(401)
  }

  nameOrPasswordIsMissing(): ResponseObject {
    return this.reply.response().code(401)
  }
}
