import { ClientTypes } from '@src/domain/models/client';

export interface GetContactsDTO {
  type: ClientTypes;
  key: string;
}
