import { Client, ClientType } from '@src/domain/models/client';
import { SignUpService } from '@src/domain/services/signup-service';
import {
  DomainError,
  InvalidParamError,
  MissingParamError,
} from '@src/shared/errors';
import { badRequest, created } from '@src/shared/http';
import { Controller } from '@src/shared/ports/controller-port';
import { Request, Response } from '@src/shared/ports/http-port';
import { Result } from '@src/shared/result/result';

export class SignUpController implements Controller {
  constructor(private readonly signupService: SignUpService) {}

  async handle(request: Request): Promise<Response> {
    const requiredFields = ['name', 'type', 'password', 'email'];
    for (const field of requiredFields) {
      if (!request.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
    const { type, email, password, name } = request.body;
    const isValidClientType = Boolean(
      ClientType.macapa === type || ClientType.varejao === type
    );
    if (!isValidClientType) {
      return badRequest(
        new DomainError(
          `Invalid client type: ${type}. Must be "varejao" or "macapa"`
        )
      );
    }
    if (!email.includes('@')) {
      return badRequest(new InvalidParamError('email'));
    }
    const client: Result<Client> = await this.signupService.execute({
      type,
      email,
      password,
      name,
    });
    if (client.isFailure) {
      return badRequest(new DomainError(client.error));
    }
    return created({});
  }
}
