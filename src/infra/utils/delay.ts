import { Logger } from './logger';

const DEFAULT_FIVE_SECONDS = 5_000;

/**
 * Use para esperar um tempo até os containers do banco de dados subir.
 * @default 5 segundos
 */
export async function delay (
  timeInMs: number = DEFAULT_FIVE_SECONDS,
  showLogs = true
) {
  if (showLogs) {
    Logger.info(
      `[PRE START]: Waiting ${timeInMs /
        1000} seconds before start to trying connect to databases and start the HTTP server.`
    );
    Logger.info(
      `[PRE START]: Set a higher number of seconds on 'delay' function call on 'server.ts' if the server did not start correctly due container initialization delay, causing database connection fail.`
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(null);
    }, timeInMs);
  });
}
