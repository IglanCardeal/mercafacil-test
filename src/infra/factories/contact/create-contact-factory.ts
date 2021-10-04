import { SequelizeClientRepository } from '@src/infra/repositories/database/client-repository';
import { SequelizeContactRepository } from '@src/infra/repositories/database/contact-repository';
import { CreateController } from '@src/services/contact/create/create-controller';
import { CreateService } from '@src/services/contact/create/create-service';

export const createContactFactory = () => {
  const contactRepository = new SequelizeContactRepository();
  const clientRepository = new SequelizeClientRepository();
  const createContactService = new CreateService(
    contactRepository,
    clientRepository
  );
  return new CreateController(createContactService);
};
