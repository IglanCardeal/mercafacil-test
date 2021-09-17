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
});
