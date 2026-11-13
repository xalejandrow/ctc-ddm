import mysql from "mysql2/promise";
import "dotenv/config";

export const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  database: process.env.DB_NAME || "sigma",
  user: process.env.DB_USER || "sigma_user",
  password: process.env.DB_PASSWORD || "sigma_password",
  waitForConnections: true,
  connectionLimit: 10,
});
