import { Contact } from '@src/domain/models/contact';
import { CreateContactService } from '@src/domain/services/contact';
import { Result } from '@src/shared/result/result';
import { CreateContactDTO } from './create-contact-dto';

export class CreateService implements CreateContactService {
  constructor(private readonly clientTypes: readonly string[]) {}

  async execute(data: CreateContactDTO): Promise<Result<Contact[]>> {
    const { type } = data;
    const isClientTypeAllowed = this.clientTypes.includes(type);
    if (!isClientTypeAllowed) {
      return Result.fail(
        `Invalid client type: ${type}. Must be "varejao" or "macapa"`
      );
    }
    return Result.ok([] as Contact[]);
  }
}
