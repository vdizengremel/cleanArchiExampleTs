import { ServerRoute } from '@hapi/hapi'
import AuthenticationController from './authentication.controller'

export function createAuthenticationRoute(
  authenticationController: AuthenticationController
): ServerRoute[] {
  return [
    {
      method: 'POST',
      path: '/api/auth',
      handler: authenticationController.authenticateUser.bind(authenticationController),
    },
  ]
}
