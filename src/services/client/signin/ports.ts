import { Client } from '@src/domain/models/client';

type basicMethod = {
  findClientByEmail: (email: string) => Promise<Client | null>;
};

export interface ClientSignInRepository {
  varejao: basicMethod;

  macapa: basicMethod;
}

export interface PasswordCompare {
  compare: (password: string, hash: string) => Promise<boolean>;
}

export interface TokenGenerator {
  generate: (payload: any) => string;
}
