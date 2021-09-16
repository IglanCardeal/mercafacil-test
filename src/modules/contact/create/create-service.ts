import { Contact } from '@src/domain/models/contact';
import { CreateContactService } from '@src/domain/services/contact';
import { Result } from '@src/shared/result/result';
import { CreateContactDTO } from './create-contact-dto';
import { CreateContactRepository } from './ports';

export class CreateService implements CreateContactService {
  constructor(
    private readonly clientTypes: readonly string[],
    private readonly contactRepository: CreateContactRepository
  ) {}

  async execute(data: CreateContactDTO): Promise<Result<Contact[]>> {
    const { type } = data;
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
    return Result.ok([] as Contact[]);
  }
}
