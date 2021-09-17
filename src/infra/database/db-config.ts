import { ENV } from '../config/env';

// mysql
const {
  MYSQL_DATABASE,
  MYSQL_PASSWORD,
  MYSQL_USER,
  MYSQL_PORT,
  MYSQL_ROOT_HOST,
} = ENV;
// postgres
const {
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_DATABASE,
  POSTGRES_ROOT_HOST,
} = ENV;

export const dbConfig = {
  ['development' as string]: {
    databases: {
      mysql: {
        database: MYSQL_DATABASE as string,
        username: MYSQL_USER as string,
        password: MYSQL_PASSWORD as string,
        host: MYSQL_ROOT_HOST as string,
        port: MYSQL_PORT as string,
        dialect: 'mysql',
      },
      postgres: {
        database: POSTGRES_DATABASE as string,
        username: POSTGRES_USER as string,
        password: POSTGRES_PASSWORD as string,
        host: POSTGRES_ROOT_HOST as string,
        port: POSTGRES_PORT as string,
        dialect: 'postgres',
      },
    },
  },
};
