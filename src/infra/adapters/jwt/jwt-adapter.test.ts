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
    sut.generate('any data');
    expect(signSpy).toHaveBeenCalled();
  });

  it('Should return a token', () => {
    const sut = makeSut();
    const token = sut.generate('any data');
    expect(token).toBe('generate-token');
  });

  it('Should throw if jwt throws', () => {
    const sut = makeSut();
    jest
      .spyOn(jsonwebtoken, 'sign')
      .mockImplementation((payload: any): string => {
        throw new Error();
      });
    expect(() => sut.generate(null)).toThrow();
  });

  // it('Should return a production token', () => {
  //   const sut = makeSut();
  //   const token = sut.generate('any data');
  //   expect(token).toBeTruthy();
  // });

  // it('Should validate the production token and return correct data', () => {
  //   const sut = makeSut();
  //   const token = sut.generate('any data');
  //   const data = jsonwebtoken.verify(token, 'jest_any_secret');
  //   expect(data).toBe('any data');
  // });
});
