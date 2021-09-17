import { Contact } from '@src/domain/models/contact';
import { CreateContactsService } from '@src/domain/services/contact';
import {
  DomainError,
  InvalidParamError,
  MissingParamError,
} from '@src/shared/errors';
import {
  badRequest,
  created,
  internalServerError,
  unauthorized,
} from '@src/shared/http';
import { Controller } from '@src/shared/ports/controller-port';
import { Request, Response } from '@src/shared/ports/http-port';
import { Result } from '@src/shared/result/result';

export class CreateController implements Controller {
  constructor(private readonly createService: CreateContactsService) {}

  async handle(request: Request): Promise<Response> {
    try {
      const requiredParams = ['contacts', 'type', 'key'];
      for (const param of requiredParams) {
        if (!request.body[param]) {
          return badRequest(new MissingParamError(param));
        }
      }
      const isArrayOfContacts = Boolean(request.body.contacts instanceof Array);
      if (!isArrayOfContacts) {
        return badRequest(new InvalidParamError('contacts must be an array'));
      }
      const { contacts, type, key } = request.body;
      for (const contact of contacts) {
        if (!contact.name) {
          return badRequest(new MissingParamError('contact name'));
        }
        if (!contact.cellphone) {
          return badRequest(new MissingParamError('contact cellphone'));
        }
      }
      const contactsCreated: Result<Contact[]> =
        await this.createService.execute({
          contacts,
          type,
          key,
        });
      if (contactsCreated.isFailure) {
        const domainErrorType = contactsCreated.type;
        const domainError = contactsCreated.error;
        if (domainErrorType === 'unauthorized') {
          return unauthorized(new DomainError(domainError));
        }
        return badRequest(new DomainError(domainError));
      }
      return created({ contacts: contactsCreated.getValue() });
    } catch (error) {
      return internalServerError();
    }
  }
}
