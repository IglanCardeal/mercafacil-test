import { Client, ClientTypes } from '@src/domain/models/client';
import { ClientSignUpService } from '@src/domain/services/client-signup-service';
import { Result } from '@src/shared/result/result';
import { ClientDTO } from './client-dto';

export class SignUpService implements ClientSignUpService {
  async execute(clientData: ClientDTO): Promise<Result<Client>> {
    const { type } = clientData;
    const clientTypesAllowed: string[] = Object.values(ClientTypes);
    const isValidClientType = clientTypesAllowed.includes(type)
    if (!isValidClientType) {
      return Result.fail(
        `Invalid client type: ${type}. Must be "varejao" or "macapa"`
      );
    }
    return Result.ok({} as Client);
  }
}
