import '../utils/module-alias';

import { Response } from '@src/shared/ports/http-port';
import Fastify, { FastifyInstance, FastifyReply } from 'fastify';
import { signupFactory } from './signup-factory';
import { signinFactory } from './signin-factory';

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
  return reply.send(response);
});

app.post('/api/client/signin', async (request, reply: FastifyReply) => {
  const clientData = request.body;
  const signInController = signinFactory();
  const response: Response = await signInController.handle({
    body: clientData,
  });
  return reply.send(response);
});

app.get('/api/contact/get', async (request, reply: FastifyReply) => {
  const token = request.headers['authorization'];
  request.log.info(`[TOKEN]: ${token}`);
  return reply.send({ pong: 'it worked!' });
});

export { app };
