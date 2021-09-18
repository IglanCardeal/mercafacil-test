import { CreateController } from '@src/services/contact/create/create-controller';
import { CreateService } from '@src/services/contact/create/create-service';
import { SequelizeClientRepository } from '../repositories/client-repository';
import { SequelizeContactRepository } from '../repositories/contact-repository';

export const createContactFactory = () => {
  const contactRepository = new SequelizeContactRepository();
  const clientRepository = new SequelizeClientRepository();
  const createContactService = new CreateService(
    contactRepository,
    clientRepository
  );
  return new CreateController(createContactService);
};
