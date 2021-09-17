/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import jsonwebtoken from 'jsonwebtoken';

import * as JWTAdapter from './jwt-adapter';

const { JsonWebTokenAdapter } = JWTAdapter;

const signSpy = jest
  .spyOn(jsonwebtoken, 'sign')
  .mockImplementation((payload: any): string => {
    return 'generate-token';
  });

const makeSut = () => {
  return new JsonWebTokenAdapter();
};

describe('JWT Adapter', () => {
  it('Should call jwt sign', () => {
    const sut = makeSut();
    sut.generate({ key: 'any data' });
    expect(signSpy).toHaveBeenCalled();
  });

  it('Should return a token', () => {
    const sut = makeSut();
    const token = sut.generate({ key: 'any data' });
    expect(token).toBe('generate-token');
  });

  it('Should throw if jwt throws', () => {
    const sut = makeSut();
    jest
      .spyOn(jsonwebtoken, 'sign')
      .mockImplementationOnce((payload: any): string => {
        throw new Error();
      });
    expect(() => sut.generate(null)).toThrow();
  });
});
