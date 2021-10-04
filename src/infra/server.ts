import { ENV } from './config/env';
import { app } from './fastify/app';
import {
  disconnectDatabases,
  tryToConnectToDatabases,
} from './utils/database-connection';
import { delay } from './utils/delay';
import { Logger } from './utils/logger';

process.on('unhandledRejection', (reason, promise) => {
  Logger.error(
    `[ERROR] App exiting due unhandled promise: ${promise} with error: ${reason}`
  );
  throw reason;
});

process.on('uncaughtException', error => {
  Logger.error(`[ERROR] App exiting due uncaught handled error: ${error}`);
  process.exit(ExitCode.Failure);
});

enum ExitCode {
  Failure = 1,
  Success = 0,
}

const DEFAULT_TEN_SECONDS = 10_000;

const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
(async () => {
  try {
    const maxAttemptsToConnectToDb = 5;

    await delay(DEFAULT_TEN_SECONDS);
    await tryToConnectToDatabases(maxAttemptsToConnectToDb);
    await app.listen(ENV.PORT as string);

    Logger.info('[SERVER] Server started success');

    exitSignals.map(signal => {
      process.on(signal, async () => {
        try {
          await disconnectDatabases();
          Logger.info('[SERVER] Server stopped with success');
          process.exit(ExitCode.Success);
        } catch (err) {
          Logger.error(`[SERVER] Server stopper with failure. Error: ${err}`);
          process.exit(ExitCode.Failure);
        }
      });
    });
  } catch (err) {
    Logger.error(`[SERVER] Server exit with error: ${err}`);
    process.exit(ExitCode.Failure);
  }
})();
