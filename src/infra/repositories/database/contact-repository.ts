import { Contact } from '@src/domain/models/contact';
import { MacapaContact, VarejaoContact } from '@src/infra/models/contact-model';
import { CreateContactRepository } from '@src/repositories/contact-repository';

export class SequelizeContactRepository implements CreateContactRepository {
  public varejao = {
    createContact: async (
      contacts: Omit<Contact, 'id'>[]
    ): Promise<Contact[]> => {
      const contactsCreated = await VarejaoContact.bulkCreate(contacts, {
        updateOnDuplicate: ['name'], // evita duplicados e apenas atualiza nome
      });
      return contactsCreated.map(contact => {
        return {
          id: contact.id,
          name: contact.name,
          cellphone: contact.cellphone,
        };
      });
    },

    getContacts: async (): Promise<Contact[]> => {
      const contacts = await VarejaoContact.findAll();
      return contacts.map(contact => {
        return {
          id: contact.id,
          name: contact.name,
          cellphone: contact.cellphone,
        };
      });
    },
  };

  public macapa = {
    createContact: async (
      contacts: Omit<Contact, 'id'>[]
    ): Promise<Contact[]> => {
      const contactsCreated = await MacapaContact.bulkCreate(contacts, {
        updateOnDuplicate: ['name'], // evita duplicados e apenas atualiza nome
      });
      return contactsCreated.map(contact => {
        return {
          id: contact.id,
          name: contact.name,
          cellphone: contact.cellphone,
        };
      });
    },

    getContacts: async (): Promise<Contact[]> => {
      const contacts = await MacapaContact.findAll();
      return contacts.map(contact => {
        return {
          id: contact.id,
          name: contact.name,
          cellphone: contact.cellphone,
        };
      });
    },
  };
}
