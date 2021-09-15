import { ClientSignUpService } from '@src/domain/services/client-signup-service';
import { Result } from '@src/shared/result/result';
import { ClientDTO } from './client-dto';

export class SignUpService implements ClientSignUpService {
  async execute(data: ClientDTO): Promise<Result<any>> {
    data
    return Result.ok({});
  }
}
