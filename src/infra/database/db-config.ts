import { ENV } from '../config/env';

// mysql
const { MYSQL_DATABASE, MYSQL_PASSWORD, MYSQL_USER, MYSQL_PORT } = ENV;
// postgres
const { POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USER, POSTGRES_DATABASE } =
  ENV;

export const dbConfig = {
  ['development' as string]: {
    databases: {
      mysql: {
        database: MYSQL_DATABASE as string,
        username: MYSQL_USER as string,
        password: MYSQL_PASSWORD as string,
        host: '127.0.0.1',
        port: MYSQL_PORT as string,
        dialect: 'mysql',
      },
      postgres: {
        database: POSTGRES_DATABASE as string,
        username: POSTGRES_USER as string,
        password: POSTGRES_PASSWORD as string,
        host: '127.0.0.1',
        port: POSTGRES_PORT as string,
        dialect: 'postgres',
      },
    },
  },
};
