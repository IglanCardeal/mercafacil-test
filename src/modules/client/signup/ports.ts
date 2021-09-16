import { Client } from '@src/domain/models/client';

export interface ClientSignUpRepository {
  varejao: {
    findClientByEmailAndType: (
      email: string,
      clientType: string
    ) => Promise<Client | null>;

    createClient: (client: any) => Promise<Client>;
  };

  macapa: {
    findClientByEmailAndType: (
      email: string,
      clientType: string
    ) => Promise<Client | null>;

    createClient: (client: any) => Promise<Client>;
  };
}
