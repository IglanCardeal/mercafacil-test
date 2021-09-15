import { Response } from '../ports/http-port';

export const badRequest = (body: Error): Response => {
  return {
    statusCode: 400,
    body: {
      error: body.message,
    },
  };
};

export const created = (body: any): Response => {
  return {
    statusCode: 201,
    body: body,
  };
};
