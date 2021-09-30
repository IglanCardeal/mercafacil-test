import { CreateController } from '@src/services/contact/create/create-controller';
import { CreateService } from '@src/services/contact/create/create-service';
import { ClientRepository } from '../repositories/client-repository';
import { ContactRepository } from '../repositories/contact-repository';

export const createContactFactory = () => {
  const clientRepository = new ClientRepository();
  const contactRepository = new ContactRepository();
  const createContactService = new CreateService(
    contactRepository,
    clientRepository
  );
  return new CreateController(createContactService);
};
