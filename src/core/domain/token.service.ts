import Token from './token'

export default interface TokenService {
  generateToken(): Token
}
