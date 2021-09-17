import { Client, ClientTypes } from '@src/domain/models/client';

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
