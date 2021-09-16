import { Contact } from '@src/domain/models/contact';
import { CreateContactService } from '@src/domain/services/contact';
import { Result } from '@src/shared/result/result';
import { CreateContactDTO } from './create-contact-dto';
import { ClientRepository, CreateContactRepository } from './ports';

export class CreateService implements CreateContactService {
  constructor(
    private readonly clientTypes: readonly string[],
    private readonly contactRepository: CreateContactRepository,
    private readonly clientRepository: ClientRepository
  ) {}

  async execute(data: CreateContactDTO): Promise<Result<Contact[]>> {
    const { type, key } = data;
    const isClientTypeAllowed = this.clientTypes.includes(type);
    if (!isClientTypeAllowed) {
      return Result.fail(
        `Invalid client type: ${type}. Must be "varejao" or "macapa"`
      );
    }
    // verificação de segurança para garantir que o repositório existe
    if (
      !this.contactRepository[type] ||
      typeof this.contactRepository[type].createContact !== 'function'
    ) {
      throw new Error(`Client repository not found for type: ${type}`);
    }
    const clientFound = await this.clientRepository[type].findClientByKey(key);
    if (!clientFound) {
      return Result.fail(
        'Client not found. Action not authorized',
        'unauthorized'
      );
    }
    return Result.ok([] as Contact[]);
  }
}
