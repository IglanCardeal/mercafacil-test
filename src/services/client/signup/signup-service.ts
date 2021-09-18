import { Client, clientTypesArray } from '@src/domain/models/client';
import { ClientSignUpService } from '@src/domain/services/client';
import { Result } from '@src/shared/result/result';
import { ClientSignUpDTO } from './client-signup-dto';
import { ClientSignUpRepository, Encrypter, UUIDGenerator } from './ports';

export class SignUpService implements ClientSignUpService {
  private readonly clientTypes = clientTypesArray;

  constructor(
    private readonly clientRepository: ClientSignUpRepository,
    private readonly encrypter: Encrypter,
    private readonly uuidGenerator: UUIDGenerator
  ) {}

  async execute(clientData: ClientSignUpDTO): Promise<Result<Client>> {
    const { type, email, name, password } = clientData;
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
    const emailAlreadyExist = await this.clientRepository[
      type
    ].findClientByEmail(email);
    if (emailAlreadyExist) {
      return Result.fail(`Client email ${email} already exist`);
    }
    const uniqueKey = this.uuidGenerator.generate();
    const hashedPassword = await this.encrypter.encrypt(password);
    const data = {
      uuid: uniqueKey,
      password: hashedPassword,
      name,
      type,
      email,
    };
    const client = await this.clientRepository[type].createClient(data);
    return Result.ok(client);
  }
}
