import { MissingParamError } from '@src/shared/errors';
import { badRequest, ok } from '@src/shared/http';
import { Controller } from '@src/shared/ports/controller-port';
import { Request, Response } from '@src/shared/ports/http-port';

export class GetController implements Controller {
  async handle(request: Request): Promise<Response> {
    const requiredParams = ['key', 'type'];
    for (const param of requiredParams) {
      if (!request.body[param]) {
        return badRequest(new MissingParamError(param));
      }
    }
    // const { type, key } = request.body;
    return ok({});
  }
}
