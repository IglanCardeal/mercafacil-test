/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateContactService } from '@src/domain/services/contact';
import { Result } from '@src/shared/result/result';
import { CreateController } from '../create-controller';

class CreateServiceStub implements CreateContactService {
  async execute(data: any): Promise<Result<any>> {
    return Result.ok();
  }
}

const sutFactory = () => {
  const createServiceStub = new CreateServiceStub();
  return {
    sut: new CreateController(createServiceStub),
    createServiceStub,
  };
};

describe('Create Contact Controller', () => {
  it('Should return 400 when no contacts is provided', async () => {
    const { sut } = sutFactory();
    const request = {
      body: {
        contacts: '',
      },
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Missing param: contacts');
  });

  it('Should return 400 when contacts is not an array', async () => {
    const { sut } = sutFactory();
    const request = {
      body: {
        contacts: {},
      },
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(
      'Invalid param: contacts must be an array'
    );
  });

  it('Should return 400 when contact name is not provided', async () => {
    const { sut } = sutFactory();
    const request = {
      body: {
        contacts: [
          {
            name: '',
            cellphone: '5541999999999',
          },
        ],
      },
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Missing param: contact name');
  });

  it('Should return 400 when contact cellphone is not provided', async () => {
    const { sut } = sutFactory();
    const request = {
      body: {
        contacts: [
          {
            name: 'Any Name',
            cellphone: '',
          },
        ],
      },
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Missing param: contact cellphone');
  });

  it('Should return 401 when user key is not found', async () => {
    const { sut, createServiceStub } = sutFactory();
    const request = {
      body: {
        contacts: [
          {
            name: 'Any Name',
            cellphone: '5541999999999',
          },
        ],
      },
    };
    jest
      .spyOn(createServiceStub, 'execute')
      .mockImplementationOnce(async () => {
        return Result.fail(
          'Client not found. Action not authorized',
          'unauthorized'
        );
      });
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Client not found. Action not authorized');
  });

  it('Should call create service with correct values', async () => {
    const { sut, createServiceStub } = sutFactory();
    const request = {
      body: {
        contacts: [
          {
            name: 'Any Name',
            cellphone: '5541999999999',
          },
        ],
        key: 'unique_key',
        type: 'varejao',
      },
    };
    const executeSpy = jest.spyOn(createServiceStub, 'execute');
    await sut.handle(request);
    expect(executeSpy).toHaveBeenCalledWith(request.body);
  });

  it('Should return 500 when create service throws', async () => {
    const { sut, createServiceStub } = sutFactory();
    const request = {
      body: {
        contacts: [
          {
            name: 'Any Name',
            cellphone: '5541999999999',
          },
        ],
      },
    };
    jest
      .spyOn(createServiceStub, 'execute')
      .mockImplementationOnce(async () => {
        throw new Error();
      });
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(500);
  });
});
