import pino from 'pino';

const logger = pino({
  enabled: true,
  level: 'info',
});

Object.freeze(logger);

export const Logger = logger;
