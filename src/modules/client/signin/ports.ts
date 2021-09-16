import { Client } from '@src/domain/models/client';

export interface ClientSignInRepository {
  varejao: {
    findClientByEmailAndType: (email: string) => Promise<Client | null>;
  };

  macapa: {
    findClientByEmailAndType: (email: string) => Promise<Client | null>;
  };
}
