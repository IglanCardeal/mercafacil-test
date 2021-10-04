import { SignInController } from '@src/services/client/signin/signin-controller';
import { SignInService } from '@src/services/client/signin/singin-service';
import { BcryptAdapter } from '../../adapters/bcrypt/bcrypt-adapter';
import { JsonWebTokenAdapter } from '../../adapters/jwt/jwt-adapter';
import { SequelizeClientRepository } from '../../repositories/client-repository';

export const signinFactory = () => {
  const clientRepository = new SequelizeClientRepository();
  const bcryptAdapter = new BcryptAdapter();
  const jwtAdapter = new JsonWebTokenAdapter();
  const signinService = new SignInService(
    clientRepository,
    bcryptAdapter,
    jwtAdapter
  );
  return new SignInController(signinService);
};
