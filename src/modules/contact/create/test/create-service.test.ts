/* eslint-disable @typescript-eslint/no-unused-vars */
import { clientTypesArray } from '@src/domain/models/client';
import { Contact } from '@src/domain/models/contact';
import { Result } from '@src/shared/result/result';
import { CreateContactDTO } from '../create-contact-dto';
import { CreateService } from '../create-service';
import { CreateContactRepository } from '../ports';

class CreateContactRepositoryStub implements CreateContactRepository {
  public varejao = {
    async createContact(contacts: any): Promise<Contact[]> {
      return [] as any;
    },
  };

  public macapa = {
    async createContact(contacts: any): Promise<Contact[]> {
      return [] as any;
    },
  };
}

const sutFactory = () => {
  const createContactRepositoryStub = new CreateContactRepositoryStub();
  return {
    sut: new CreateService(clientTypesArray, createContactRepositoryStub),
    createContactRepositoryStub,
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
});
