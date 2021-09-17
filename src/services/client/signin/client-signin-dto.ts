import { ClientTypes } from '@src/domain/models/client';

export interface ClientSignInDTO {
  email: string;
  password: string;
  type: ClientTypes;
}
