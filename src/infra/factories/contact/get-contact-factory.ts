import { SequelizeClientRepository } from '@src/infra/repositories/database/client-repository';
import { SequelizeContactRepository } from '@src/infra/repositories/database/contact-repository';
import { GetController } from '@src/services/contact/get/get-controller';
import { GetContacts } from '@src/services/contact/get/get-service';

export const getContactFactory = () => {
  const sequelizeClientRepository = new SequelizeClientRepository();
  const sequelizeContactRepository = new SequelizeContactRepository();
  const getContactsService = new GetContacts(
    sequelizeClientRepository,
    sequelizeContactRepository
  );
  return new GetController(getContactsService);
};
