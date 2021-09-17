/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from 'bcrypt';

import { BcryptAdapter, SALT } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  hash: async () => 'hashed password',
  compare: async () => true,
}));

const makeSut = () => new BcryptAdapter(SALT);

describe('Bcrypt Adapter', () => {
  it('Shoud call bcrypt with correct value', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', SALT);
  });

  it('Shoud returns hashed password for a correct value', async () => {
    const sut = makeSut();
    const hashedPassword = await sut.encrypt('any_values');
    expect(hashedPassword).toBe('hashed password');
  });

  it('Shoud throw exception if bcrypt throws', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => {
      throw new Error();
    });
    const promise = sut.encrypt('any_values');
    await expect(promise).rejects.toThrow();
  });

  it('Shoud return false when password is incorrect', async () => {
    const sut = makeSut();
    const hash = await sut.encrypt('any_password');
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => false);
    const result = await sut.compare('incorrect_password', hash);
    expect(result).toBe(false);
  });

  it('Shoud return true if password is correct', async () => {
    const sut = makeSut();
    const hash = await sut.encrypt('any_password');
    const result = await sut.compare('any_password', hash);
    expect(result).toBe(true);
  });
});
