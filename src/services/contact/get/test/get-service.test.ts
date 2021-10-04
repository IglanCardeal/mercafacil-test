/* eslint-disable @typescript-eslint/no-unused-vars */
import { ClientRepository } from '@src/repositories/contact-repository';
import { GetContacts } from '../get-service';
import { GetContactsDTO, GetContactsRepository } from '../ports';

class ClientRepositoryStub implements ClientRepository {
  public varejao = {
    async findClientByKey (key: string): Promise<any> {
      return {};
    },
  };

  public macapa = {
    async findClientByKey (key: string): Promise<any> {
      return {};
    },
  };
}

class GetContactsRepositoryStub implements GetContactsRepository {
  public varejao = {
    async getContacts (): Promise<any> {
      return [{}];
    },
  };

  public macapa = {
    async getContacts (): Promise<any> {
      return [{}];
    },
  };
}

const makeBody = (): GetContactsDTO => ({
  uuid: 'unique_key',
  type: 'macapa',
});

const sutFactory = () => {
  const clientRepositoryStub = new ClientRepositoryStub();
  const getContactsRepositoryStub = new GetContactsRepositoryStub();
  return {
    sut: new GetContacts(clientRepositoryStub, getContactsRepositoryStub),
    clientRepositoryStub,
  };
};

describe('Get Client Contacts', () => {
  it('Should return failure when client type is not allowed', async () => {
    const { sut } = sutFactory();
    const response = await sut.execute({
      ...makeBody(),
      type: 'macapas' as any,
    });
    expect(response.isFailure).toBe(true);
    expect(response.error).toBe(
      `Invalid client type: macapas. Must be "varejao" or "macapa"`
    );
  });

  it('Should return failure when client key is not found', async () => {
    const { sut, clientRepositoryStub } = sutFactory();
    jest
      .spyOn(clientRepositoryStub.macapa, 'findClientByKey')
      .mockResolvedValueOnce(null);
    const response = await sut.execute({
      ...makeBody(),
      uuid: 'dont_exist_unique_key',
    });
    expect(response.isFailure).toBe(true);
    expect(response.type).toBe('unauthorized');
    expect(response.error).toBe('Client not found. Action not authorized');
  });

  it('Should return client contacts when success', async () => {
    const { sut } = sutFactory();
    const response = await sut.execute(makeBody());
    expect(response.isSuccess).toBe(true);
    expect(response.getValue()).toEqual(expect.any(Array));
  });
});
