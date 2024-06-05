import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.MYSQLDATABASE,
  process.env.MYSQLUSER,
  process.env.MYSQLPASSWORD,
  {
    host: process.env.MYSQLHOST,
    port: 3306,
    dialect: 'mysql', // ou 'postgres', 'sqlite', 'mssql', etc., dependendo do seu banco de dados
  }
);
