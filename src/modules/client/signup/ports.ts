import { Client } from '@src/domain/models/client';

export interface ClientSignUpRepository {
  varejao: {
    findClientByEmailAndType: (email: string) => Promise<Client | null>;

    createClient: (client: any) => Promise<Client>;
  };

  macapa: {
    findClientByEmailAndType: (email: string) => Promise<Client | null>;

    createClient: (client: any) => Promise<Client>;
  };
}

export interface Encrypter {
  encrypt: (value: string) => Promise<string>;
}

export interface UUIDGenerator {
  generate: () => string;
}
