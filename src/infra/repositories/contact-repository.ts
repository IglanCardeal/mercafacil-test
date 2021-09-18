import { Contact } from '@src/domain/models/contact';
import { CreateContactRepository } from '@src/repositories/contact-repository';

export class SequelizeContactRepository implements CreateContactRepository {
  public varejao = {
    createContact: async (
      contacts: Omit<Contact, 'id'>[]
    ): Promise<Contact[]> => {
      contacts;
      return [] as any;
    },

    getContacts: async (): Promise<Contact[]> => {
      return [] as any;
    },
  };

  public macapa = {
    createContact: async (
      contacts: Omit<Contact, 'id'>[]
    ): Promise<Contact[]> => {
      contacts;
      return [] as any;
    },

    getContacts: async (): Promise<Contact[]> => {
      return [] as any;
    },
  };
}
