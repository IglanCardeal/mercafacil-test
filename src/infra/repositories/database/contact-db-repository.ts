import { Contact } from '@src/domain/models/contact';
import { CreateContactRepository } from '@src/repositories/contact-repository';
import { GetContactsRepository } from '@src/services/contact/get/ports';
import { VarejaoContact } from '../../models/contact-model';

export class SequelizeContactRepository
  implements Partial<CreateContactRepository>, Partial<GetContactsRepository> {
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
}
