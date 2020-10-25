import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise(resolve => resolve('hash'))
  }
}))

describe('BCrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const salt = 12
    const sut = new BCryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
})

describe('BCrypt Adapter', () => {
  test('Should return a hash with success', async () => {
    const salt = 12
    const sut = new BCryptAdapter(salt)
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hash')
    // expect(hash).toBe('$2b$12$/0sG05z7Yk45i0o2O2b3EuIm./X5tt3skUP18yx6IB7UZOY0SpX1G')
  })
})
