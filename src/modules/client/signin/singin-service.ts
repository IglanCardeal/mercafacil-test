import { Client } from '@src/domain/models/client';
import { ClientSignInService } from '@src/domain/services/client-signin-service';
import { Result } from '@src/shared/result/result';
import { ClientSignInDTO } from './client-signin-dto';
import { ClientSignInRepository } from './ports';

export class SignInService implements ClientSignInService {
  constructor(private readonly clientRepository: ClientSignInRepository) {}

  async execute(clientData: ClientSignInDTO): Promise<Result<Client>> {
    const { email, type } = clientData;
    // verificação de segurança para garantir que o repositório existe
    if (
      !this.clientRepository[type] ||
      typeof this.clientRepository[type].findClientByEmailAndType !== 'function'
    ) {
      throw new Error(`Client repository not found for type: ${type}`);
    }
    const clientFound = await this.clientRepository[
      type
    ].findClientByEmailAndType(email);
    if (!clientFound) {
      return Result.fail('Invalid param: email or password is incorrect');
    }
    return Result.ok({} as Client);
  }
}
