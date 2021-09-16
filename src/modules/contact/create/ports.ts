import { Client } from '@src/domain/models/client';
import { Contact } from '@src/domain/models/contact';

export interface CreateContactRepository {
  varejao: {
    createContact: (contacts: Omit<Contact, 'id'>[]) => Promise<Contact[]>;
  };

  macapa: {
    createContact: (contacts: Omit<Contact, 'id'>[]) => Promise<Contact[]>;
  };
}

export interface ClientRepository {
  varejao: {
    findClientByKey: (key: string) => Promise<Client | null>;
  };

  macapa: {
    findClientByKey: (key: string) => Promise<Client | null>;
  };
}
