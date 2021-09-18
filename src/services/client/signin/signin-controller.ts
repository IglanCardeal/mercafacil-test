import { ClientSignInService } from '@src/domain/services/client';
import {
  DomainError,
  InvalidParamError,
  MissingParamError,
} from '@src/shared/errors';
import { badRequest, internalServerError, ok } from '@src/shared/http';
import { Controller } from '@src/shared/ports/controller-port';
import { Request, Response } from '@src/shared/ports/http-port';
import { Result } from '@src/shared/result/result';

export class SignInController implements Controller {
  constructor(private readonly signinService: ClientSignInService) {}

  async handle(request: Request): Promise<Response> {
    try {
      const requiredFields = ['type', 'password', 'email'];
      for (const field of requiredFields) {
        if (!request.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const { email, name, type } = request.body;
      // simples validação de email
      if (!email.includes('@')) {
        return badRequest(new InvalidParamError('email'));
      }
      const client: Result<any> = await this.signinService.execute({
        email,
        name,
        type,
      });
      if (client.isFailure) {
        return badRequest(new DomainError(client.error));
      }
      return ok({ token: client.getValue().token });
    } catch (error) {
      return internalServerError();
    }
  }
}
