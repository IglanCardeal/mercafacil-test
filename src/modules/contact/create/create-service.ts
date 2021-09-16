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
    const { type, key, contacts } = data;
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
    const formatedContact = this.domainFormater[type](contacts);
    const contactsCreated = await this.contactRepository[type].createContact(
      formatedContact
    );
    return Result.ok(contactsCreated as Contact[]);
  }

  private domainFormater = {
    ['macapa' as string]: (contacts: Omit<Contact, 'id'>[]) => {
      const formatedContact: Omit<Contact, 'id'>[] = contacts.map(
        ({ name, cellphone }: Omit<Contact, 'id'>) => {
          return {
            name: name.trim().replace(/\s\s+/g, ' ').toUpperCase(),
            cellphone: cellphone
              .replace(/\D/g, '')
              .replace(/(\d{2})(\d{2})(\d{5})(\d)/, '+$1 ($2) $3-$4'),
          };
        }
      );
      return formatedContact;
    },

    ['varejao' as string]: (contacts: Omit<Contact, 'id'>[]) => {
      const formatedContact: Omit<Contact, 'id'>[] = contacts.map(
        ({ name, cellphone }: Omit<Contact, 'id'>) => {
          return {
            name: name
              .trim()
              .replace(/\s\s+/g, ' ')
              .split(' ')
              .map((word) => {
                if (word.length > 2)
                  return (
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  );
                return word.toLowerCase();
              })
              .join(' '),
            cellphone: cellphone.replace(/\D/g, ''),
          };
        }
      );
      return formatedContact;
    },
  };
}
