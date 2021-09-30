import {
  ClientSignInRepository,
  ClientSignUpRepository,
} from '@src/repositories/client-repository';
import { SequelizeClientRepository } from './database/client-db-repository';

export class ClientRepository extends SequelizeClientRepository
  implements ClientSignInRepository, ClientSignUpRepository {}
