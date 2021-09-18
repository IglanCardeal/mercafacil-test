import { GetController } from '@src/services/contact/get/get-controller';
import { GetContacts } from '@src/services/contact/get/get-service';
import { SequelizeClientRepository } from '../repositories/client-repository';
import { SequelizeContactRepository } from '../repositories/contact-repository';

export const getContactFactory = () => {
  const sequelizeClientRepository = new SequelizeClientRepository();
  const sequelizeContactRepository = new SequelizeContactRepository();
  const getContactsService = new GetContacts(
    sequelizeClientRepository,
    sequelizeContactRepository
  );
  return new GetController(getContactsService);
};
