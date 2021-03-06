import { SignUpController } from '@src/services/client/signup/signup-controller';
import { SignUpService } from '@src/services/client/signup/signup-service';
import { BcryptAdapter } from '../../adapters/bcrypt/bcrypt-adapter';
import { UuidAdapter } from '../../adapters/uuidv4/uuid-adapter';
import { SequelizeClientRepository } from '../../repositories/database/client-repository';

export const signupFactory = () => {
  const sequelizeClientRepository = new SequelizeClientRepository();
  const encrypter = new BcryptAdapter();
  const uuid = new UuidAdapter();
  const signupService = new SignUpService(
    sequelizeClientRepository,
    encrypter,
    uuid
  );
  return new SignUpController(signupService);
};
