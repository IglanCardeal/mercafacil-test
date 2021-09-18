/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateContactsService } from '@src/domain/services/contact';
import { Result } from '@src/shared/result/result';
import { CreateController } from '../create-controller';

class CreateServiceStub implements CreateContactsService {
  async execute(data: any): Promise<Result<any>> {
    return Result.ok([
      {
        name: 'Any Name',
        cellphone: '5541999999999',
        id: 'any_id',
      },
    ]);
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
  it('Should return 400 when no client key is provided', async () => {
    const { sut } = sutFactory();
    const request = {
      body: {
        uuid: '',
        type: 'macapa',
        contacts: [{}],
      },
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Missing param: uuid');
  });

  it('Should return 400 when no client type is provided', async () => {
    const { sut } = sutFactory();
    const request = {
      body: {
        uuid: 'unique_key',
        type: '',
        contacts: [{}],
      },
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Missing param: type');
  });

  it('Should return 400 when no contacts is provided', async () => {
    const { sut } = sutFactory();
    const request = {
      body: {
        uuid: 'unique_key',
        type: 'macapa',
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
        uuid: 'unique_key',
        type: 'macapa',
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
        uuid: 'unique_key',
        type: 'macapa',
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
        uuid: 'unique_key',
        type: 'macapa',
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

  it('Should return 400 when create service returns any domain error', async () => {
    const { sut, createServiceStub } = sutFactory();
    const request = {
      body: {
        uuid: 'unique_key',
        type: 'macapa',
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
        return Result.fail('any error');
      });
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('any error');
  });

  it('Should return 401 when user key is not found', async () => {
    const { sut, createServiceStub } = sutFactory();
    const request = {
      body: {
        uuid: 'unique_key',
        type: 'macapa',
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
        uuid: 'unique_key',
        type: 'macapa',
        contacts: [
          {
            name: 'Any Name',
            cellphone: '5541999999999',
          },
        ],
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
        uuid: 'unique_key',
        type: 'macapa',
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

  it('Should return 201 when contact creation success', async () => {
    const { sut, createServiceStub } = sutFactory();
    const request = {
      body: {
        uuid: 'unique_key',
        type: 'macapa',
        contacts: [
          {
            name: 'Any Name',
            cellphone: '5541999999999',
          },
        ],
      },
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(201);
    expect(response.body.contacts[0]).toEqual(
      expect.objectContaining({
        ...request.body.contacts[0],
        id: expect.any(String),
      })
    );
  });
});
