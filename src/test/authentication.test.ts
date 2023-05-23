import request from 'supertest'
import { injectServer } from '../dependency-injector'

jest.mock('uuid', () => {
  return {
    v4: jest.fn().mockReturnValue('1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'),
  }
})

describe('Authentication', () => {
  const server = injectServer()

  it('should return 401 when no name', async () => {
    await request(server.listener).post('/api/auth').send({ password: 'valid' }).expect(401)
  })

  it('should return 401 when no password', async () => {
    await request(server.listener).post('/api/auth').send({ name: 'jean.bon' }).expect(401)
  })

  it('should return 200 with a token when name and password are valid', async () => {
    const response = await request(server.listener)
      .post('/api/auth')
      .send({ name: 'jean.bon', password: 'valid' })
      .expect(200)
    expect(response.body).toEqual({ token: '1b9d6bcdbbfd4b2d9b5dab8dfbbd4bed' })
  })

  it('should return 401 when password is invalid', async () => {
    await request(server.listener)
      .post('/api/auth')
      .send({ name: 'jean.bon', password: 'invalid' })
      .expect(401)
  })

  it('should return 401 when user is unknown', async () => {
    await request(server.listener)
      .post('/api/auth')
      .send({ name: 'jean.neymar', password: 'valid' })
      .expect(401)
  })
})
