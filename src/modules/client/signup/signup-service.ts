import { Client, clientTypesArray } from '@src/domain/models/client';
import { ClientSignUpService } from '@src/domain/services/client-signup-service';
import { Result } from '@src/shared/result/result';
import { ClientDTO } from './client-dto';
import { ClientSignUpRepository } from './ports';

export class SignUpService implements ClientSignUpService {
  constructor(private readonly clientRepository: ClientSignUpRepository) {}

  async execute(clientData: ClientDTO): Promise<Result<Client>> {
    const { type, email } = clientData;
    const isClientTypeAllowed = clientTypesArray.includes(type);
    if (!isClientTypeAllowed) {
      return Result.fail(
        `Invalid client type: ${type}. Must be "varejao" or "macapa"`
      );
    }
    const emailAlreadyExist =
      await this.clientRepository.findClientByEmailAndType(email, type);
    if (emailAlreadyExist) {
      return Result.fail(`Client email ${email} already exist`);
    }
    return Result.ok({} as Client);
  }
}
