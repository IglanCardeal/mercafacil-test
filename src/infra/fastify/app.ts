import Fastify, { FastifyInstance, FastifyReply } from 'fastify';

const app: FastifyInstance = Fastify({
  logger: {
    level: 'info',
    prettyPrint: true,
  },
});

app.get('/ping', async (request, reply: FastifyReply) => {
  return reply.send({ pong: 'it worked!' });
});

export { app };
