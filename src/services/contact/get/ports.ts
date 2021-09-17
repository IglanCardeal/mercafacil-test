import { Client, ClientTypes } from '@src/domain/models/client';
import { Contact } from '@src/domain/models/contact';

export interface GetContactsDTO {
  type: ClientTypes;
  key: string;
}

export interface ClientRepository {
  varejao: {
    findClientByKey: (key: string) => Promise<Client | null>;
  };

  macapa: {
    findClientByKey: (key: string) => Promise<Client | null>;
  };
}

export interface GetContactsRepository {
  varejao: {
    getContacts: () => Promise<Contact[]>;
  };

  macapa: {
    getContacts: () => Promise<Contact[]>;
  };
}
