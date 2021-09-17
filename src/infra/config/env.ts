import { config } from 'dotenv';

config();

const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  PUBLIC_KEY: process.env.PUBLIC_KEY,
  // MySQL
  MYSQL_ROOT_PASSWORD: process.env.MYSQL_ROOT_PASSWORD,
  MYSQL_DATABASE: process.env.MYSQL_DATABASE,
  MYSQL_USER: process.env.MYSQL_USER,
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
  MYSQL_PORT: process.env.MYSQL_PORT,
  MYSQL_ROOT_HOST: process.env.MYSQL_ROOT_HOST,
};

Object.freeze(ENV);

export { ENV };
