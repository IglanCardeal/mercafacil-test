/* eslint-disable @typescript-eslint/no-unused-vars */
import { clientTypesArray } from '@src/domain/models/client';
import { Contact } from '@src/domain/models/contact';
import { Result } from '@src/shared/result/result';
import { CreateContactDTO } from '../create-contact-dto';
import { CreateService } from '../create-service';
import { ClientRepository, CreateContactRepository } from '../ports';

class CreateContactRepositoryStub implements CreateContactRepository {
  public varejao = {
    async createContact(contacts: any): Promise<Contact[]> {
      return contacts.map((contact: any) => ({
        ...contact,
        id: 'any_id',
      })) as Contact[];
    },
  };

  public macapa = {
    async createContact(contacts: any): Promise<Contact[]> {
      return contacts.map((contact: any) => ({
        ...contact,
        id: 'any_id',
      })) as Contact[];
    },
  };
}

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
  const createContactRepositoryStub = new CreateContactRepositoryStub();
  const clientRepositoryStub = new ClientRepositoryStub();
  return {
    sut: new CreateService(
      clientTypesArray,
      createContactRepositoryStub,
      clientRepositoryStub
    ),
    createContactRepositoryStub,
    clientRepositoryStub,
  };
};

describe('Create Contact Service', () => {
  it('Should return failure when client type is not allowed', async () => {
    const { sut } = sutFactory();
    const data: CreateContactDTO = {
      contacts: [{ name: 'Any Name', cellphone: '5541999999999' }],
      key: 'unique_key',
      type: 'invalid' as any,
    };
    const response: Result<Contact[]> = await sut.execute(data);
    expect(response.isFailure).toBe(true);
  });

  it('Should throws when client type repository does not exist', async () => {
    const { sut, createContactRepositoryStub } = sutFactory();
    createContactRepositoryStub.macapa = {} as any;
    const data: CreateContactDTO = {
      contacts: [{ name: 'Any Name', cellphone: '5541999999999' }],
      key: 'unique_key',
      type: 'macapa',
    };
    await expect(sut.execute(data)).rejects.toThrowError(
      `Client repository not found for type: ${data.type}`
    );
  });

  it('Should return failure when the client key does not exist', async () => {
    const { sut, clientRepositoryStub } = sutFactory();
    const data: CreateContactDTO = {
      contacts: [{ name: 'Any Name', cellphone: '5541999999999' }],
      key: 'dont_exist_client_key',
      type: 'macapa',
    };
    jest
      .spyOn(clientRepositoryStub.macapa, 'findClientByKey')
      .mockResolvedValueOnce(null);
    const response: Result<Contact[]> = await sut.execute(data);
    expect(response.isFailure).toBe(true);
    expect(response.error).toBe('Client not found. Action not authorized');
    expect(response.type).toBe('unauthorized');
  });

  it('Should return contact data when creation service success', async () => {
    const { sut } = sutFactory();
    const data: CreateContactDTO = {
      contacts: [{ name: 'Any Name', cellphone: '5541999999999' }],
      key: 'dont_exist_client_key',
      type: 'macapa',
    };
    const response: Result<Contact[]> = await sut.execute(data);
    expect(response.isSuccess).toBe(true);
    expect(response.getValue()[0]).toEqual({
      name: expect.any(String),
      cellphone: expect.any(String),
      id: expect.any(String),
    });
  });

  it('Should return contact data with correct "macapa" domain format', async () => {
    const { sut } = sutFactory();
    const data: CreateContactDTO = {
      contacts: [{ name: '   Any       Name   ', cellphone: '5541999999999' }],
      key: 'dont_exist_client_key',
      type: 'macapa',
    };
    const response: Result<Contact[]> = await sut.execute(data);
    expect(response.isSuccess).toBe(true);
    expect(response.getValue()[0]).toEqual({
      name: 'ANY NAME',
      cellphone: '+55 (41) 99999-9999',
      id: expect.any(String),
    });
  });

  it('Should return contact data with correct "varejao" domain format', async () => {
    const { sut } = sutFactory();
    const data: CreateContactDTO = {
      contacts: [
        { name: '   ANY    of   name   ', cellphone: '55419 99999999' },
      ],
      key: 'dont_exist_client_key',
      type: 'varejao',
    };
    const response: Result<Contact[]> = await sut.execute(data);
    expect(response.isSuccess).toBe(true);
    expect(response.getValue()[0]).toEqual({
      name: 'Any of Name',
      cellphone: '5541999999999',
      id: expect.any(String),
    });
  });
});
