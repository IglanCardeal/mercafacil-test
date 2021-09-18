import { Client } from '@src/domain/models/client';
import { Contact } from '@src/domain/models/contact';

type baseContacMethod = {
  createContact: (contacts: Omit<Contact, 'id'>[]) => Promise<Contact[]>;
};

export interface CreateContactRepository {
  varejao: baseContacMethod;

  macapa: baseContacMethod;
}

type baseClienMethod = {
  findClientByKey: (key: string) => Promise<Client | null>;
};

export interface ClientRepository {
  varejao: baseClienMethod;

  macapa: baseClienMethod;
}
