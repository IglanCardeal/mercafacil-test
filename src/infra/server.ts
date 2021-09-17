/* eslint-disable no-console */
import { ENV } from './config/env';
import { app } from './fastify/app';

process.on('unhandledRejection', (reason, promise) => {
  console.error(
    `App exiting due unhandled promise: ${promise} with error: ${reason}`
  );

  throw reason;
});

process.on('uncaughtException', (error) => {
  console.error(`App exiting due uncaught handled error: ${error}`);

  process.exit(ExitCode.Failure);
});

enum ExitCode {
  Failure = 1,
  Success = 0,
}

const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
(async () => {
  try {
    await app.listen(ENV.PORT as string);
    console.info('Server started success');

    exitSignals.map((signal) => {
      process.on(signal, async () => {
        try {
          console.info('Server stopped with success');
          process.exit(ExitCode.Success);
        } catch (err) {
          console.error(`Server stopper with failure. Error: ${err}`);
          process.exit(ExitCode.Failure);
        }
      });
    });
  } catch (err) {
    console.error(`Server exit with error: ${err}`);
    process.exit(ExitCode.Failure);
  }
})();
