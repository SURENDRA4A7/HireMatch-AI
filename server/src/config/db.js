const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

let sslConfig;

if (process.env.DB_SSL_CA) {
  sslConfig = {
    ca: process.env.DB_SSL_CA.replace(/\\n/g, "\n"),
  };
} else {
  sslConfig = {
    ca: fs.readFileSync(
      path.join(__dirname, "../../certificates/ca.pem")
    ),
  };
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,

  user: process.env.DB_USER,

  password: process.env.DB_PASSWORD,

  database: process.env.DB_NAME,

  port: Number(process.env.DB_PORT) || 3306,

  waitForConnections: true,

  connectionLimit: 10,

  queueLimit: 0,

  ssl: sslConfig,
});

module.exports = pool;