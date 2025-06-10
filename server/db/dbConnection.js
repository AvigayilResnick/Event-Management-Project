import mysql from 'mysql2'
import dotenv from 'dotenv';
dotenv.config();

// This creates a pool of connections that can be reused
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
  password: process.env.MYSQL_PASSWORD,
}).promise();

export default pool;