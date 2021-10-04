/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateContactsService } from '@src/domain/services/contact';
import {
  DomainError,
  InvalidParamError,
  MissingParamError,
} from '@src/shared/errors';
import {
  badRequest,
  created,
  internalServerError,
  unauthorized,
} from '@src/shared/http';
import { Result } from '@src/shared/result/result';
import { CreateController } from '../create-controller';

class CreateServiceStub implements CreateContactsService {
  async execute (data: any): Promise<Result<any>> {
    return Result.ok([
      {
        name: 'Any Name',
        cellphone: '5541999999999',
        id: 'any_id',
      },
    ]);
  }
}

const makeRequest = () => ({
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
});

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
    const response = await sut.handle({
      body: {
        ...makeRequest().body,
        uuid: '',
      },
    });
    expect(response).toEqual(badRequest(new MissingParamError('uuid')));
  });

  it('Should return 400 when no client type is provided', async () => {
    const { sut } = sutFactory();
    const response = await sut.handle({
      body: {
        ...makeRequest().body,
        type: '',
      },
    });
    expect(response).toEqual(badRequest(new MissingParamError('type')));
  });

  it('Should return 400 when no contacts is provided', async () => {
    const { sut } = sutFactory();
    const response = await sut.handle({
      body: {
        ...makeRequest().body,
        contacts: '',
      },
    });
    expect(response).toEqual(badRequest(new MissingParamError('contacts')));
  });

  it('Should return 400 when contacts is not an array', async () => {
    const { sut } = sutFactory();
    const response = await sut.handle({
      body: {
        ...makeRequest().body,
        contacts: {},
      },
    });
    expect(response).toEqual(
      badRequest(new InvalidParamError('contacts must be an array of contacts'))
    );
  });

  it('Should return 400 when contact name is not provided', async () => {
    const { sut } = sutFactory();
    const response = await sut.handle({
      body: {
        ...makeRequest().body,
        contacts: [
          {
            name: '',
            cellphone: '5541999999999',
          },
        ],
      },
    });
    expect(response).toEqual(badRequest(new MissingParamError('contact name')));
  });

  it('Should return 400 when contact cellphone is not provided', async () => {
    const { sut } = sutFactory();
    const response = await sut.handle({
      body: {
        ...makeRequest().body,
        contacts: [
          {
            name: 'Any Name',
            cellphone: '',
          },
        ],
      },
    });
    expect(response).toEqual(
      badRequest(new MissingParamError('contact cellphone'))
    );
  });

  it('Should return 400 when create service returns any domain error', async () => {
    const { sut, createServiceStub } = sutFactory();
    jest
      .spyOn(createServiceStub, 'execute')
      .mockImplementationOnce(async () => {
        return Result.fail('any error');
      });
    const response = await sut.handle(makeRequest());
    expect(response).toEqual(badRequest(new DomainError('any error')));
  });

  it('Should return 401 when user key is not found', async () => {
    const { sut, createServiceStub } = sutFactory();
    jest
      .spyOn(createServiceStub, 'execute')
      .mockImplementationOnce(async () => {
        return Result.fail(
          'Client not found. Action not authorized',
          'unauthorized'
        );
      });
    const response = await sut.handle(makeRequest());
    expect(response).toEqual(
      unauthorized(new DomainError('Client not found. Action not authorized'))
    );
  });

  it('Should call create service with correct values', async () => {
    const { sut, createServiceStub } = sutFactory();
    const executeSpy = jest.spyOn(createServiceStub, 'execute');
    await sut.handle(makeRequest());
    expect(executeSpy).toHaveBeenCalledWith(makeRequest().body);
  });

  it('Should return 500 when create service throws', async () => {
    const { sut, createServiceStub } = sutFactory();
    jest
      .spyOn(createServiceStub, 'execute')
      .mockImplementationOnce(async () => {
        throw new Error();
      });
    const response = await sut.handle(makeRequest());
    expect(response).toEqual(internalServerError());
  });

  it('Should return 201 when contact creation success', async () => {
    const { sut } = sutFactory();
    const response = await sut.handle(makeRequest());
    expect(response).toEqual(
      created({
        contacts: [
          {
            ...makeRequest().body.contacts[0],
            id: 'any_id',
          },
        ],
      })
    );
  });
});
