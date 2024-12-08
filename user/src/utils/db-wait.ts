const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;
async function waitForDB(retries = MAX_RETRIES) {
  try {
    const client = await pool.connect();
    console.log("Successfully connected to database");
    client.release();
    process.exit(0);
  } catch (err) {
    console.log(`Failed to connect to database. Retries left: ${retries}`);
    if (retries === 0) {
      console.error("Max retries reached. Exiting.");
      process.exit(1);
    }
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    return waitForDB(retries - 1);
  }
}

waitForDB();
