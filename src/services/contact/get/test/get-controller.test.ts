/* eslint-disable @typescript-eslint/no-unused-vars */
import { GetContactService } from '@src/domain/services/contact';
import { Result } from '@src/shared/result/result';
import { GetController } from '../get-controller';

class GetContactServiceStub implements GetContactService {
  async execute(data: any): Promise<any> {
    return Result.ok();
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
});
