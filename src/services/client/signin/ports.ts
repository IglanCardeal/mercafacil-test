import { Client } from '@src/domain/models/client';

export interface ClientSignInRepository {
  varejao: {
    findClientByEmail: (email: string) => Promise<Client | null>;
  };

  macapa: {
    findClientByEmail: (email: string) => Promise<Client | null>;
  };
}

export interface PasswordCompare {
  compare: (password: string, hash: string) => Promise<boolean>;
}

export interface TokenGenerator {
  generate: (payload: any) => string;
}
