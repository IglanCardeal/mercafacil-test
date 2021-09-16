import { InvalidParamError, MissingParamError } from '@src/shared/errors';
import { badRequest, created } from '@src/shared/http';
import { Controller } from '@src/shared/ports/controller-port';
import { Request, Response } from '@src/shared/ports/http-port';

export class CreateController implements Controller {
  async handle(request: Request): Promise<Response> {
    if (!request.body.contacts) {
      return badRequest(new MissingParamError('contacts'));
    }
    const isArrayOfContacts = Boolean(request.body.contacts instanceof Array);
    if (!isArrayOfContacts) {
      return badRequest(new InvalidParamError('contacts must be an array'));
    }
    return created({});
  }
}
