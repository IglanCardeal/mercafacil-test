import { ClientTypes } from '@src/domain/models/client';

export interface ClientDTO {
  name: string;
  email: string;
  password: string;
  type: ClientTypes;
}
