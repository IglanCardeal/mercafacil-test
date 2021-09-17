/* eslint-disable no-console */
import { Dialect, Sequelize } from 'sequelize';

import { ENV } from '../config/env';
import { Logger } from '../utils/logger';
import { dbConfig } from './db-config';

const env = ENV.NODE_ENV as string;

const { mysql, postgres } = dbConfig[env].databases;

const databases = {
  mysqlConnection: new Sequelize(
    mysql.database,
    mysql.username,
    mysql.password,
    {
      dialect: mysql.dialect as Dialect,
      host: mysql.host,
    }
  ),
  postgresConnection: new Sequelize(
    postgres.database,
    postgres.username,
    postgres.password,
    {
      dialect: postgres.dialect as Dialect,
      host: postgres.host,
    }
  ),
};

export class Databases {
  public static async mysqlConnect() {
    try {
      await databases.mysqlConnection.authenticate();
      Logger.info('[DATABASE] MySQL connection success');
    } catch (error) {
      throw new Error(`[DATABASE]: ${error}`);
    }
  }

  public static async postgresConnect() {
    try {
      await databases.postgresConnection.authenticate();
      Logger.info('[DATABASE] Postgres connection success');
    } catch (error) {
      throw new Error(`[DATABASE]: ${error}`);
    }
  }

  public static async mysqlDisconnect() {
    try {
      await databases.mysqlConnection.close();
      Logger.warn('[DATABASE] MySQL connection close success');
    } catch (error) {
      throw new Error(`[DATABASE]: ${error}`);
    }
  }

  public static async postgresDisconnect() {
    try {
      await databases.postgresConnection.close();
      Logger.info('[DATABASE] Postgres connection close success');
    } catch (error) {
      throw new Error(`[DATABASE]: ${error}`);
    }
  }
}
