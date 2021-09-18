import { ClientTypes } from '@src/domain/models/client';
import { Contact } from '@src/domain/models/contact';

export interface CreateContactDTO {
  type: ClientTypes;
  uuid: string;
  contacts: Omit<Contact, 'id'>[];
}
