const { Pool } = require("pg");

const pool = new Pool({
  // connectionString: process.env.POSTGRES_URL,
  user: "postgres",
  database: "cashier_app",
  password: "teddyferdian98",
  port: 5432,
  host: "localhost",
  connectionTimeoutMillis: 200,
});

module.exports = {
  pool,
};
