import { ENV } from '../config/env';

const { MYSQL_DATABASE, MYSQL_PASSWORD, MYSQL_USER, MYSQL_PORT } = ENV;

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
      // Database2: {
      //   database: process.env.RDS_DATABASE2,
      //   username: process.env.RDS_USERNAME2,
      //   password: process.env.RDS_PASSWORD2,
      //   host: process.env.RDS_HOSTNAME2,
      //   port: process.env.RDS_PORT2,
      //   dialect: 'mysql',
      // },
    },
  },
};
