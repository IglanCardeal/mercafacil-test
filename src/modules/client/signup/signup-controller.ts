import { Client } from '@src/domain/models/client';
import { ClientSignUpService } from '@src/domain/services/client/client-signup-service';
import {
  DomainError,
  InvalidParamError,
  MissingParamError,
} from '@src/shared/errors';
import { badRequest, created, internalServerError } from '@src/shared/http';
import { Controller } from '@src/shared/ports/controller-port';
import { Request, Response } from '@src/shared/ports/http-port';
import { Result } from '@src/shared/result/result';

export class SignUpController implements Controller {
  constructor(private readonly signupService: ClientSignUpService) {}

  async handle(request: Request): Promise<Response> {
    try {
      const requiredFields = ['name', 'type', 'password', 'email'];
      for (const field of requiredFields) {
        if (!request.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const { type, email, password, name } = request.body;
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
      return created(client.getValue());
    } catch (error) {
      return internalServerError();
    }
  }
}
