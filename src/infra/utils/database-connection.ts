import { Databases } from '../database/sequelize';
import { delay } from './delay';
import { Logger } from './logger';

const startDatabaseConnections = async () => {
  await Databases.mysqlConnect();
  await Databases.postgresConnect();
};

const maxAttemptsReached = (
  attempts: number,
  maxAttempts: number,
  error: Error
) => {
  if (attempts >= maxAttempts) {
    Logger.error(
      `[DATABASE] Max attempts of ${maxAttempts} to connect to databases reached. Unable to connect to databases. HTTP server will not start!`
    );
    throw error;
  }
};

export const tryToConnectToDatabases = async (maxAttempts: number) => {
  let attempts = 0;
  while (attempts < maxAttempts) {
    try {
      await startDatabaseConnections();
      break;
    } catch (error) {
      attempts++;
      Logger.info(`[DATABASE] Attempts to connect: ${attempts}`);
      // espera mais 2 segundos antes de tentar novamente
      await delay(2_000, false);
      maxAttemptsReached(attempts, maxAttempts, error as Error);
    }
  }
};

export const disconnectDatabases = async () => {
  await Databases.mysqlDisconnect();
  await Databases.postgresDisconnect();
  Logger.info('[DATABASE] Databases disconnection success');
};
