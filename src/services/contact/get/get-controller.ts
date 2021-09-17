import { Contact } from '@src/domain/models/contact';
import { GetContactService } from '@src/domain/services/contact';
import { DomainError, MissingParamError } from '@src/shared/errors';
import { badRequest, ok, unauthorized } from '@src/shared/http';
import { Controller } from '@src/shared/ports/controller-port';
import { Request, Response } from '@src/shared/ports/http-port';
import { Result } from '@src/shared/result/result';

export class GetController implements Controller {
  constructor(private readonly getService: GetContactService) {}

  async handle(request: Request): Promise<Response> {
    const requiredParams = ['key', 'type'];
    for (const param of requiredParams) {
      if (!request.body[param]) {
        return badRequest(new MissingParamError(param));
      }
    }
    const { type, key } = request.body;
    const contacts: Result<Contact[]> = await this.getService.execute({
      type,
      key,
    });
    if (contacts.isFailure) {
      const domainErrorType = contacts.type;
      const domainError = contacts.error;
      if (domainErrorType === 'unauthorized') {
        return unauthorized(new DomainError(domainError));
      }
    }
    return ok({ contacts: contacts.getValue() });
  }
}