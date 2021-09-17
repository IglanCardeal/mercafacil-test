/* eslint-disable @typescript-eslint/no-unused-vars */
import { ClientRepository } from '@src/repositories/contact-repository';
import { GetContacts } from '../get-service';
import { GetContactsDTO } from '../ports';

class ClientRepositoryStub implements ClientRepository {
  public varejao = {
    async findClientByKey(key: string): Promise<any> {
      return {};
    },
  };

  public macapa = {
    async findClientByKey(key: string): Promise<any> {
      return {};
    },
  };
}

const sutFactory = () => {
  const clientRepositoryStub = new ClientRepositoryStub();
  return {
    sut: new GetContacts(clientRepositoryStub),
    clientRepositoryStub,
  };
};

describe('Get Client Contacts', () => {
  it('Should return failure when client type is not allowed', async () => {
    const { sut } = sutFactory();
    const data: GetContactsDTO = {
      key: 'unique_key',
      type: 'macapas' as any,
    };
    const response = await sut.execute(data);
    expect(response.isFailure).toBe(true);
    expect(response.error).toBe(
      `Invalid client type: ${data.type}. Must be "varejao" or "macapa"`
    );
  });

  it('Should return failure when client key is not found', async () => {
    const { sut, clientRepositoryStub } = sutFactory();
    const data: GetContactsDTO = {
      key: 'dont_exist_unique_key',
      type: 'macapa',
    };
    jest
      .spyOn(clientRepositoryStub.macapa, 'findClientByKey')
      .mockResolvedValueOnce(null);
    const response = await sut.execute(data);
    expect(response.isFailure).toBe(true);
    expect(response.type).toBe('unauthorized');
    expect(response.error).toBe('Client not found. Action not authorized');
  });
});
