import { clientTypesArray } from '@src/domain/models/client';
import { Contact } from '@src/domain/models/contact';
import { GetContactsService } from '@src/domain/services/contact';

import { Result } from '@src/shared/result/result';
import { ClientRepository, GetContactsDTO } from './ports';

export class GetContacts implements GetContactsService {
  private readonly clientTypes = clientTypesArray;

  constructor(private readonly clientRepository: ClientRepository) {}

  async execute(data: GetContactsDTO): Promise<Result<Contact[]>> {
    const { type, key } = data;
    const isClientTypeAllowed = this.clientTypes.includes(type);
    if (!isClientTypeAllowed) {
      return Result.fail(
        `Invalid client type: ${type}. Must be "varejao" or "macapa"`
      );
    }
    const clientFound = await this.clientRepository[type].findClientByKey(key);
    if (!clientFound) {
      return Result.fail(
        'Client not found. Action not authorized',
        'unauthorized'
      );
    }
    return Result.ok([]);
  }
}
