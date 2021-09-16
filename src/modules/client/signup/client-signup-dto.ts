import { ClientTypes } from '@src/domain/models/client';

export interface ClientSignUpDTO {
  name: string;
  email: string;
  password: string;
  type: ClientTypes;
}
