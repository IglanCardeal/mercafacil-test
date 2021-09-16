import { Client } from '@src/domain/models/client';

export interface ClientSignUpRepository {
  varejao: {
    findClientByEmail: (email: string) => Promise<Client | null>;

    createClient: (client: any) => Promise<Client>;
  };

  macapa: {
    findClientByEmail: (email: string) => Promise<Client | null>;

    createClient: (client: any) => Promise<Client>;
  };
}

export interface Encrypter {
  encrypt: (value: string) => Promise<string>;
}

export interface UUIDGenerator {
  generate: () => string;
}
