import '../utils/module-alias'; // deve ser importado no topo

import { Response } from '@src/shared/ports/http-port';
import Fastify, { FastifyInstance, FastifyReply } from 'fastify';

import { signupFactory } from '../factories/client/signup-factory';
import { signinFactory } from '../factories/client/signin-factory';
import { JsonWebTokenAdapter } from '../adapters/jwt/jwt-adapter';
import { getContactFactory } from '../factories/contact/get-contact-factory';
import { createContactFactory } from '../factories/contact/create-contact-factory';

const app: FastifyInstance = Fastify({
  logger: {
    level: 'info',
    prettyPrint: true,
  },
});

app.setNotFoundHandler(
  {
    preValidation: (req, reply, done) => {
      done();
    },
    preHandler: (req, reply, done) => {
      done();
    },
  },
  function (request, reply) {
    reply.code(404).send({
      statusCode: 404,
      body: {
        error: 'Resource not found',
      },
    });
  }
);

app.post('/api/client/signup', async (request, reply: FastifyReply) => {
  const clientData = request.body;
  const signUpController = signupFactory();
  const response: Response = await signUpController.handle({
    body: clientData,
  });
  return reply.status(response.statusCode).send(response);
});

app.post('/api/client/signin', async (request, reply: FastifyReply) => {
  const clientData = request.body;
  const signInController = signinFactory();
  const response: Response = await signInController.handle({
    body: clientData,
  });
  return reply.status(response.statusCode).send(response);
});

app.get('/api/contact/get', async (request, reply: FastifyReply) => {
  const token = request.headers['authorization'];
  if (!token) {
    return reply.send({
      statusCode: 400,
      body: { error: 'Missing authentication token' },
    });
  }
  const clientData = AuthService.verify(token, reply);
  const getContactsController = getContactFactory();
  const response = await getContactsController.handle({
    body: { uuid: clientData.uuid, type: clientData.type },
  });
  return reply.status(response.statusCode).send(response);
});

app.post('/api/contact/create', async (request, reply: FastifyReply) => {
  const token = request.headers['authorization'];
  const { contacts } = request.body as any;
  if (!token) {
    return reply.send({
      statusCode: 400,
      body: { error: 'Missing authentication token' },
    });
  }
  const clientData = AuthService.verify(token, reply);
  const createContactsController = createContactFactory();
  const response = await createContactsController.handle({
    body: { uuid: clientData.uuid, type: clientData.type, contacts },
  });
  return reply.status(response.statusCode).send(response);
});

export { app };

class AuthService {
  public static verify (token: string, reply: FastifyReply): any {
    const [bearer, rawToken] = token.split(' '); // recupera o token sem o "Bearer"
    if (!bearer) {
      return reply.send({
        statusCode: 400,
        body: { error: 'Incorrect token format. Must start with "Bearer"' },
      });
    }
    if (!rawToken) {
      return reply.send({
        statusCode: 400,
        body: { error: 'Missing raw authentication token' },
      });
    }
    try {
      const clientData = new JsonWebTokenAdapter().verify(rawToken as string);
      return clientData;
    } catch (err) {
      const error = err as Error;
      return reply.send({
        statusCode: 400,
        body: { error: error.message },
      });
    }
  }
}
