import { GetController } from '@src/services/contact/get/get-controller';
import { GetContacts } from '@src/services/contact/get/get-service';
import { ClientRepository } from '../repositories/client-repository';
import { ContactRepository } from '../repositories/contact-repository';

export const getContactFactory = () => {
  const sequelizeClientRepository = new ClientRepository();
  const sequelizeContactRepository = new ContactRepository();
  const getContactsService = new GetContacts(
    sequelizeClientRepository,
    sequelizeContactRepository
  );
  return new GetController(getContactsService);
};
