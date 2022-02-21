import { ConnectionOptions } from "typeorm";
import { Transaction } from "../models/transaction";
import { User } from "../models/user";

const config: ConnectionOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'ec2-52-215-225-178.eu-west-1.compute.amazonaws.com',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'uhtmudmqegbmqa',
    password: process.env.DB_PASSWORD || '88d39df4222fac20a5c781fd7d47c058587fd7e2cde64eec8b94809140e99212',
    database: process.env.DB_NAME || 'd9oq9an9c8mj6g',
    entities: [User, Transaction],
    synchronize: true,
    ssl: true,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
};

export default config;