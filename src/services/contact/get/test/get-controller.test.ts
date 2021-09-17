/* eslint-disable @typescript-eslint/no-unused-vars */
import { GetContactsService } from '@src/domain/services/contact';
import { Result } from '@src/shared/result/result';
import { GetController } from '../get-controller';

class GetContactServiceStub implements GetContactsService {
  async execute(data: any): Promise<any> {
    return Result.ok([
      { id: 'any_id', name: 'Any Name', cellphone: '5541999999999' },
    ]);
  }
}

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
    const request = {
      body: {
        type: '',
        key: 'unique_key',
      },
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(`Missing param: type`);
  });

  it('Should return 400 when key is not provided', async () => {
    const { sut } = sutFactory();
    const request = {
      body: {
        type: 'varejao',
        key: '',
      },
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(`Missing param: key`);
  });

  it('Should return 401 when client key was not found', async () => {
    const { sut, getContactServiceStub } = sutFactory();
    const request = {
      body: {
        type: 'varejao',
        key: 'key_not_exist',
      },
    };
    jest
      .spyOn(getContactServiceStub, 'execute')
      .mockImplementationOnce(async () => {
        return Result.fail(
          `Client not found. Action not authorized`,
          'unauthorized'
        );
      });
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe(`Client not found. Action not authorized`);
  });

  it('Should return 400 when get service returns any domain error', async () => {
    const { sut, getContactServiceStub } = sutFactory();
    const request = {
      body: {
        type: 'varejao',
        key: 'key_not_exist',
      },
    };
    jest
      .spyOn(getContactServiceStub, 'execute')
      .mockImplementationOnce(async () => {
        return Result.fail('any domain error');
      });
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('any domain error');
  });

  it('Should return 500 when get service throws', async () => {
    const { sut, getContactServiceStub } = sutFactory();
    const request = {
      body: {
        type: 'varejao',
        key: 'client_key',
      },
    };
    jest
      .spyOn(getContactServiceStub, 'execute')
      .mockImplementationOnce(async () => {
        throw new Error();
      });
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('Internal server error');
  });

  it('Should return 200 when get contacts success', async () => {
    const { sut } = sutFactory();
    const request = {
      body: {
        type: 'varejao',
        key: 'client_key',
      },
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(200);
    expect(response.body.contacts).toEqual([
      { id: 'any_id', name: 'Any Name', cellphone: '5541999999999' },
    ]);
  });
});
