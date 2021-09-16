import { Client } from '@src/domain/models/client';

export interface ClientSignUpRepository {
  varejao: {
    findClientByEmailAndType: (
      email: string,
      clientType: string
    ) => Promise<Client | null>;
  };

  macapa: {
    findClientByEmailAndType: (
      email: string,
      clientType: string
    ) => Promise<Client | null>;
  };
}
