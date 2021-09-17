import { clientTypesArray } from '@src/domain/models/client';
import { Contact } from '@src/domain/models/contact';
import { GetContactsService } from '@src/domain/services/contact';
import { Result } from '@src/shared/result/result';
import { GetContactsDTO } from './ports';

export class GetContacts implements GetContactsService {
  constructor(private readonly clientTypes = clientTypesArray) {}

  async execute(data: GetContactsDTO): Promise<Result<Contact[]>> {
    const { type } = data;
    const isClientTypeAllowed = this.clientTypes.includes(type);
    if (!isClientTypeAllowed) {
      return Result.fail(
        `Invalid client type: ${type}. Must be "varejao" or "macapa"`
      );
    }
    return Result.ok([]);
  }
}
