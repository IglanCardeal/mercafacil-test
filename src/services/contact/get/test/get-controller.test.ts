/* eslint-disable @typescript-eslint/no-unused-vars */
import { GetContactsService } from '@src/domain/services/contact';
import { DomainError, MissingParamError } from '@src/shared/errors';
import {
  badRequest,
  internalServerError,
  ok,
  unauthorized,
} from '@src/shared/http';
import { Result } from '@src/shared/result/result';
import { GetController } from '../get-controller';

class GetContactServiceStub implements GetContactsService {
  async execute (data: any): Promise<any> {
    return Result.ok([
      { id: 'any_id', name: 'Any Name', cellphone: '5541999999999' },
    ]);
  }
}

const makeRequest = () => ({
  body: {
    type: 'varejao',
    uuid: 'client_key',
  },
});

const sutFactory = () => {
  const getContactServiceStub = new GetContactServiceStub();
  return {
    sut: new GetController(getContactServiceStub),
    getContactServiceStub,
  };
};

describe('Get Contact Controller', () => {
  it('Should return 400 when type is not provided', async () => {
    const { sut } = sutFactory();
    const response = await sut.handle({
      body: {
        ...makeRequest().body,
        type: '',
      },
    });
    expect(response).toEqual(badRequest(new MissingParamError('type')));
  });

  it('Should return 400 when key is not provided', async () => {
    const { sut } = sutFactory();
    const response = await sut.handle({
      body: {
        ...makeRequest().body,
        uuid: '',
      },
    });
    expect(response).toEqual(badRequest(new MissingParamError('uuid')));
  });

  it('Should return 401 when client key was not found', async () => {
    const { sut, getContactServiceStub } = sutFactory();
    jest
      .spyOn(getContactServiceStub, 'execute')
      .mockImplementationOnce(async () => {
        return Result.fail(
          `Client not found. Action not authorized`,
          'unauthorized'
        );
      });
    const response = await sut.handle({
      body: {
        ...makeRequest().body,
        uuid: 'key_not_exist',
      },
    });
    expect(response).toEqual(
      unauthorized(new DomainError('Client not found. Action not authorized'))
    );
  });

  it('Should return 400 when get service returns any domain error', async () => {
    const { sut, getContactServiceStub } = sutFactory();
    jest
      .spyOn(getContactServiceStub, 'execute')
      .mockImplementationOnce(async () => {
        return Result.fail('any domain error');
      });
    const response = await sut.handle(makeRequest());
    expect(response).toEqual(badRequest(new DomainError('any domain error')));
  });

  it('Should return 500 when get service throws', async () => {
    const { sut, getContactServiceStub } = sutFactory();
    jest
      .spyOn(getContactServiceStub, 'execute')
      .mockImplementationOnce(async () => {
        throw new Error();
      });
    const response = await sut.handle(makeRequest());
    expect(response).toEqual(internalServerError());
  });

  it('Should return 200 when get contacts success', async () => {
    const { sut } = sutFactory();
    const response = await sut.handle(makeRequest());
    expect(response).toEqual(
      ok({
        contacts: [
          { id: 'any_id', name: 'Any Name', cellphone: '5541999999999' },
        ],
      })
    );
  });
});
