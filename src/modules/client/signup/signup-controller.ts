import { ClientType } from "@src/domain/models/client";
import { MissingParamError } from "@src/shared/errors/missing-param-error";
import { badRequest } from "@src/shared/http";
import { Controller } from "@src/shared/ports/controller-port";
import { Request, Response } from "@src/shared/ports/http-port";


export class SignUpController implements Controller {
  async handle (request: Request): Promise<Response> {
    const requiredFields = ['name', 'type', 'password'];
    for (const field of requiredFields) {
      if (!request.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
    const { type } = request.body;
    const isValidClientType = Boolean(
      ClientType.macapa === type || ClientType.varejao === type
    );
    if (!isValidClientType) {
      return badRequest(new Error(`Invalid client type: ${type}. Must be "varejao" or "macapa"`));
    }
    return {
      statusCode: 201,
      body: {
        message: 'Client signup success'
      }
    };
  }
}