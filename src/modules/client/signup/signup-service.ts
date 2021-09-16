import { Client } from '@src/domain/models/client';
import { ClientSignUpService } from '@src/domain/services/client-signup-service';
import { Result } from '@src/shared/result/result';
import { ClientDTO } from './client-dto';
import { ClientSignUpRepository } from './ports';

export class SignUpService implements ClientSignUpService {
  constructor(
    private readonly clientTypes: readonly string[],
    private readonly clientRepository: ClientSignUpRepository
  ) {}

  async execute(clientData: ClientDTO): Promise<Result<Client>> {
    const { type, email } = clientData;
    const isClientTypeAllowed = this.clientTypes.includes(type);
    if (!isClientTypeAllowed) {
      return Result.fail(
        `Invalid client type: ${type}. Must be "varejao" or "macapa"`
      );
    }
    // verificação de segurança para garantir que o repositório existe
    if (
      !this.clientRepository[type] ||
      typeof this.clientRepository[type].findClientByEmailAndType !== 'function'
    ) {
      throw new Error(`Client repository not found for type: ${type}`);
    }
    const emailAlreadyExist = await this.clientRepository[
      type
    ].findClientByEmailAndType(email, type);
    if (emailAlreadyExist) {
      return Result.fail(`Client email ${email} already exist`);
    }
    const client = await this.clientRepository[type].createClient(clientData);
    return Result.ok(client);
  }
}
