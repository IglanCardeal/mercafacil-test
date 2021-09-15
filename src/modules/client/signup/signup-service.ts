import { ClientType } from '@src/domain/models/client';
import { ClientSignUpService } from '@src/domain/services/client-signup-service';
import { Result } from '@src/shared/result/result';
import { ClientDTO } from './client-dto';

export class SignUpService implements ClientSignUpService {
  async execute(clientData: ClientDTO): Promise<Result<any>> {
    const { type } = clientData;
    const isValidClientType = Boolean(
      ClientType.macapa === type || ClientType.varejao === type
    );
    if (!isValidClientType) {
      return Result.fail(
        `Invalid client type: ${type}. Must be "varejao" or "macapa"`
      );
    }
    return Result.ok({});
  }
}
