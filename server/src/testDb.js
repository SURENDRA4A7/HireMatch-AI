require("dotenv").config();

const pool = require("./config/db");

const testDatabase = async () => {
  try {
    const [rows] = await pool.query(
      "SELECT DATABASE() AS database_name, NOW() AS server_time"
    );

    console.log(
      "Aiven Database Connected Successfully!"
    );

    console.log(rows[0]);

    await pool.end();

  } catch (error) {

    console.error(
      "Database connection failed:"
    );

    console.error(error);

    process.exit(1);

  }
};

testDatabase();