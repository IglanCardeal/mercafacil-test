/* eslint-disable no-console */
import { Dialect, Sequelize } from 'sequelize';

import { ENV } from '../config/env';
import { dbConfig } from './db-config';

const env = ENV.NODE_ENV as string;

const { mysql } = dbConfig[env].databases;

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
};

databases.mysqlConnection
  .authenticate()
  .then(() => console.log('MySQL Connection success'))  
  .catch(() => console.log('MySQL Connection failed'));
