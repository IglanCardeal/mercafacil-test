import { Contact } from '@src/domain/models/contact';

export interface CreateContactRepository {
  varejao: {
    createContact: (contacts: Omit<Contact, 'id'>[]) => Promise<Contact[]>;
  };

  macapa: {
    createContact: (contacts: Omit<Contact, 'id'>[]) => Promise<Contact[]>;
  };
}
