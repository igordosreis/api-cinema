import { Options } from 'sequelize';
import 'dotenv/config';

const config: Options = {
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '123456',
  database: process.env.DB_NAME || 'cinema_db',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3072,
  dialect: 'mysql',
  timezone: '-03:00', // -03:00 / 'America/Sao_Paulo'
  logging: process.env.LOGS_DB === 'true',
};

export = config;
