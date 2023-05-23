import { v4 } from 'uuid'
import Token from '../core/domain/token'
import TokenService from '../core/domain/token.service'

export default class TokenUidService implements TokenService {
  generateToken(): Token {
    const uuid = v4()
    return new Token(uuid.replaceAll('-', ''))
  }
}
