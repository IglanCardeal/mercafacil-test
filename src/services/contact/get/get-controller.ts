import { MissingParamError } from '@src/shared/errors';
import { badRequest, ok } from '@src/shared/http';
import { Controller } from '@src/shared/ports/controller-port';
import { Request, Response } from '@src/shared/ports/http-port';

export class GetController implements Controller {
  async handle(request: Request): Promise<Response> {
    const { type } = request.body;
    if (!type) {
      return badRequest(new MissingParamError('type'));
    }
    return ok({});
  }
}
