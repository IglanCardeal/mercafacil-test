import { Response } from '../ports/http-port';

export const badRequest = (body: Error): Response => {
  return {
    statusCode: 400,
    body: {
      error: body.message,
    },
  };
};

export const internalServerError = (): Response => {
  return {
    statusCode: 500,
    body: {
      error: 'Internal server error',
    },
  };
};

export const created = (body: any): Response => {
  return {
    statusCode: 201,
    body: body,
  };
};

export const ok = (body: any): Response => {
  return {
    statusCode: 200,
    body: body,
  };
};
