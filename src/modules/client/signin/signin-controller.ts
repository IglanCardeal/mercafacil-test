import { MissingParamError } from '@src/shared/errors';
import { badRequest, created, internalServerError } from '@src/shared/http';
import { Controller } from '@src/shared/ports/controller-port';
import { Request, Response } from '@src/shared/ports/http-port';

export class SignInController implements Controller {
  // constructor() {} // private readonly signinService: ClientSignInService

  async handle(request: Request): Promise<Response> {
    try {
      const requiredFields = ['name', 'type', 'password', 'email'];
      for (const field of requiredFields) {
        if (!request.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      return created({});
    } catch (error) {
      return internalServerError();
    }
  }
}
