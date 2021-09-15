import { Response } from "../ports/http-port";

export const badRequest = (body: Error): Response => {
  return { statusCode: 400, body: body.message };
};