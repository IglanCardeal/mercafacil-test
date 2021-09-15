import { MissingParamError } from "@src/shared/errors/missing-param-error";
import { Controller } from "@src/shared/ports/controller-port";
import { Request, Response } from "@src/shared/ports/http-port";

export const badRequest = (body: Error): Response => ({ statusCode: 400, body: body.message });

export class SignUpController implements Controller {
  async handle (request: Request): Promise<Response> {
    const requiredFields = ['name', 'type', 'password'];
    for (const field of requiredFields) {
      if (!request.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
    return {
      statusCode: 201,
      body: {
        message: 'Client signup success'
      }
    };
  }
}