/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import jsonwebtoken from 'jsonwebtoken';

import * as JWTAdapter from './jwt-adapter';

const { JsonWebTokenAdapter } = JWTAdapter;

const makeSut = () => {
  return new JsonWebTokenAdapter();
};

describe('JWT Adapter', () => {
  it('Should call jwt sign', () => {
    const sut = makeSut();
    const signSpy = jest
      .spyOn(jsonwebtoken, 'sign')
      .mockImplementationOnce((payload: any): string => {
        return 'generate-token';
      });
    sut.generate({ uuid: 'any data' });
    expect(signSpy).toHaveBeenCalled();
  });

  it('Should return a production token', () => {
    const sut = makeSut();
    jest
      .spyOn(jsonwebtoken, 'sign')
      .mockImplementationOnce((payload: any): string => {
        return 'generate-token';
      });
    const token = sut.generate({ uuid: 'any data' });
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

  it('Should return a production client data', () => {
    const sut = makeSut();
    const clientToken = sut.generate({ uuid: 'any data', type: 'macapa' });
    jest
      .spyOn(jsonwebtoken, 'verify')
      .mockImplementationOnce((payload: any): any => {
        return { uuid: 'any data', type: 'macapa' };
      });
    const clientData = sut.verify(clientToken);
    expect(clientData).toEqual(
      expect.objectContaining({
        uuid: 'any data',
        type: 'macapa',
      })
    );
  });
});
