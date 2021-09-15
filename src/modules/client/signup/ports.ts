import { Client } from '@src/domain/models/client';

export interface ClientSignUpRepository {
  findClientByEmailAndType: (
    email: string,
    clientType: string
  ) => Promise<Client | null>;
}
