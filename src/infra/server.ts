import { ENV } from './config/env';
import { Databases } from './database/sequelize';
import { app } from './fastify/app';
import { delay } from './utils/delay';
import { Logger } from './utils/logger';

process.on('unhandledRejection', (reason, promise) => {
  Logger.error(
    `[ERROR]: App exiting due unhandled promise: ${promise} with error: ${reason}`
  );
  throw reason;
});

process.on('uncaughtException', error => {
  Logger.error(`[ERROR]: App exiting due uncaught handled error: ${error}`);
  process.exit(ExitCode.Failure);
});

enum ExitCode {
  Failure = 1,
  Success = 0,
}

const startDatabaseConnections = async () => {
  await Databases.mysqlConnect();
  await Databases.postgresConnect();
};

const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
(async () => {
  try {
    const maxAttempts = 5;
    let attempts = 0;
    await delay();
    // tenta conectar aos bancos 5 vezes
    while (attempts <= maxAttempts) {
      try {
        await startDatabaseConnections();
        break;
      } catch (error) {
        Logger.info(`[DATABASE]: Attempt to connect: ${attempts}`);
        attempts++;
        // espera mais 2 segundos antes de tentar novamente
        await delay(2_000, false);
        if (attempts > maxAttempts) {
          Logger.error(
            `[DATABASE]: Max attempts of ${maxAttempts} to connect to databases reached. Unable to connect to databases. HTTP server will not start!`
          );
          throw error;
        }
      }
    }
    await app.listen(ENV.PORT as string);

    Logger.info('[SERVER]: Server started success');

    exitSignals.map(signal => {
      process.on(signal, async () => {
        try {
          await Databases.mysqlDisconnect();
          await Databases.postgresDisconnect();

          Logger.info('[SERVER]: Server stopped with success');
          process.exit(ExitCode.Success);
        } catch (err) {
          Logger.error(`[SERVER]: Server stopper with failure. Error: ${err}`);
          process.exit(ExitCode.Failure);
        }
      });
    });
  } catch (err) {
    Logger.error(`[SERVER]: Server exit with error: ${err}`);
    process.exit(ExitCode.Failure);
  }
})();
