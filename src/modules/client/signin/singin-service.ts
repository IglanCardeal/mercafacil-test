import { Client } from '@src/domain/models/client';
import { ClientSignInService } from '@src/domain/services/client-signin-service';
import { Result } from '@src/shared/result/result';
import { ClientSignInDTO } from './client-signin-dto';

export class SignInService implements ClientSignInService {
  async execute(clientData: ClientSignInDTO): Promise<Result<Client>> {
    clientData;
    return Result.ok({} as Client);
  }
}
