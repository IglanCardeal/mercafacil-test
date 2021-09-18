/* eslint-disable no-console */
import { Dialect, Sequelize } from 'sequelize';

import { ENV } from '../config/env';
import { Logger } from '../utils/logger';
import { dbConfig } from './db-config';

const env = ENV.NODE_ENV as string;

const { mysql, postgres } = dbConfig[env].databases;

export const databases = {
  mysqlConnection: new Sequelize(
    mysql.database,
    mysql.username,
    mysql.password,
    {
      dialect: mysql.dialect as Dialect,
      host: mysql.host,
      logging: false,
      define: {
        timestamps: false, // desativado evita uso de createdAt e updatedAt
      },
    }
  ),
  postgresConnection: new Sequelize(
    postgres.database,
    postgres.username,
    postgres.password,
    {
      dialect: postgres.dialect as Dialect,
      host: postgres.host,
      logging: false,
      define: {
        timestamps: false, // desativado evita uso de createdAt e updatedAt
      },
    }
  ),
};

export class Databases {
  public static async mysqlConnect() {
    try {
      await databases.mysqlConnection.authenticate();
      Logger.info('[DATABASE] MySQL connection success');
      await databases.mysqlConnection.query(`
        CREATE TABLE IF NOT EXISTS contacts (
          id serial PRIMARY KEY,
          name VARCHAR ( 200 ) NOT NULL,
          cellphone VARCHAR ( 20 ) NOT NULL
        );
      `);
      Logger.info('[DATABASE] MySQL table contacts created with success');
      await databases.mysqlConnection.query(`
        CREATE TABLE IF NOT EXISTS Clients (
          id serial PRIMARY KEY,
          name VARCHAR ( 200 ) NOT NULL,
          email VARCHAR ( 512 ) NOT NULL,
          type VARCHAR ( 128 ) NOT NULL,
          uuid VARCHAR ( 512 ) NOT NULL,
          password VARCHAR ( 512 ) NOT NULL
        );
      `);
      Logger.info('[DATABASE] MySQL table clients created with success');
    } catch (error) {
      throw new Error(`[DATABASE]: ${error}`);
    }
  }

  public static async postgresConnect() {
    try {
      await databases.postgresConnection.authenticate();
      Logger.info('[DATABASE] Postgres connection success');
      await databases.postgresConnection.query(`
        CREATE TABLE IF NOT EXISTS contacts (
          id serial PRIMARY KEY,
          name VARCHAR ( 100 ) NOT NULL,
          cellphone VARCHAR ( 13 ) NOT NULL
        );
      `);
      Logger.info('[DATABASE] Postgres table contacts created with success');
      await databases.postgresConnection.query(`
        CREATE TABLE IF NOT EXISTS Clients (
          id serial PRIMARY KEY,
          name VARCHAR ( 200 ) NOT NULL,
          email VARCHAR ( 512 ) NOT NULL,
          type VARCHAR ( 128 ) NOT NULL,
          uuid VARCHAR ( 512 ) NOT NULL,
          password VARCHAR ( 512 ) NOT NULL
        );
      `);
      Logger.info('[DATABASE] Postgres table clients created with success');
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
