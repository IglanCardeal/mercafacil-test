import { ClientType } from "@src/domain/models/client";
import { DomainError, InvalidParamError, MissingParamError } from "@src/shared/errors";
import { badRequest, created } from "@src/shared/http";
import { Controller } from "@src/shared/ports/controller-port";
import { Request, Response } from "@src/shared/ports/http-port";

export class SignUpController implements Controller {
  async handle (request: Request): Promise<Response> {
    const requiredFields = ['name', 'type', 'password', 'email'];
    for (const field of requiredFields) {
      if (!request.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
    const { type, email } = request.body;
    const isValidClientType = Boolean(
      ClientType.macapa === type || ClientType.varejao === type
    );
    if (!isValidClientType) {
      return badRequest(new DomainError(`Invalid client type: ${type}. Must be "varejao" or "macapa"`));
    }
    if (!email.includes('@')) {
      return badRequest(new InvalidParamError('email'));
    }

    return created({});
  }
}