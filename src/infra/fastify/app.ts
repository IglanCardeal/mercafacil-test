import '../utils/module-alias';

import { Response } from '@src/shared/ports/http-port';
import Fastify, { FastifyInstance, FastifyReply } from 'fastify';
import { signupFactory } from './signup-factory';

const app: FastifyInstance = Fastify({
  logger: {
    level: 'info',
    prettyPrint: true,
  },
});

app.post('/api/client/signup', async (request, reply: FastifyReply) => {
  const clientData = request.body;
  const signUpController = signupFactory();
  const response: Response = await signUpController.handle({
    body: clientData,
  });
  return reply.send(response);
});

// app.get('/ping', async (request, reply: FastifyReply) => {
//   return reply.send({ pong: 'it worked!' });
// });

export { app };
