import { Client, clientTypesArray } from '@src/domain/models/client';
import { ClientSignInService } from '@src/domain/services/client';
import { Result } from '@src/shared/result/result';
import { ClientSignInDTO } from './client-signin-dto';
import {
  ClientSignInRepository,
  PasswordCompare,
  TokenGenerator,
} from './ports';

export class SignInService implements ClientSignInService {
  private readonly clientTypes = clientTypesArray;

  constructor(
    private readonly clientRepository: ClientSignInRepository,
    private readonly passwordCompare: PasswordCompare,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async execute(clientData: ClientSignInDTO): Promise<Result<Client>> {
    const { email, type, password } = clientData;
    const isClientTypeAllowed = this.clientTypes.includes(type);
    if (!isClientTypeAllowed) {
      return Result.fail(
        `Invalid client type: ${type}. Must be "varejao" or "macapa"`
      );
    }
    // verificação de segurança para garantir que o repositório existe
    if (
      !this.clientRepository[type] ||
      typeof this.clientRepository[type].findClientByEmail !== 'function'
    ) {
      throw new Error(`Client repository not found for type: ${type}`);
    }
    const clientFound = await this.clientRepository[type].findClientByEmail(
      email
    );
    if (!clientFound) {
      return Result.fail('Invalid param: email or password is incorrect');
    }
    const isValidPassword = await this.passwordCompare.compare(
      password,
      clientFound.password
    );
    if (!isValidPassword) {
      return Result.fail('Invalid param: email or password is incorrect');
    }
    const token = this.tokenGenerator.generate({ key: clientFound.uuid });
    return Result.ok({ token } as any);
  }
}
