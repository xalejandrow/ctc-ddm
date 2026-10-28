import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? 'sigma_user',
  password: process.env.DB_PASSWORD ?? 'sigma_password',
  database: process.env.DB_NAME ?? 'sigma_db',
  waitForConnections: true,
  connectionLimit: 10,
});
