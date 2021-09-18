import { Client } from '@src/domain/models/client';

type basicMethods = {
  findClientByEmail: (email: string) => Promise<Client | null>;

  createClient: (client: any) => Promise<Client>;
};

export interface ClientSignUpRepository {
  varejao: basicMethods;

  macapa: basicMethods;
}

export interface Encrypter {
  encrypt: (value: string) => Promise<string>;
}

export interface UUIDGenerator {
  generate: () => string;
}
