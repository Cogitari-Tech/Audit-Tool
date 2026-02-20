const { Client } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function main() {
  const connectionString =
    process.env.MCP_SERVER_POSTGRES_DSN || process.env.DATABASE_URL;

  if (!connectionString) {
    console.error(
      "Error: No connection string found (MCP_SERVER_POSTGRES_DSN or DATABASE_URL).",
    );
    process.exit(1);
  }

  // Mask password for logging
  const maskedCtx = connectionString.replace(/:([^:@]+)@/, ":****@");
  console.log(`Connecting to database: ${maskedCtx}`);

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }, // Required for Supabase
  });

  try {
    await client.connect();
    console.log("Connected successfully.");

    // Check for transactions table
    const tableRes = await client.query(
      "SELECT to_regclass('public.transactions') as table_exists;",
    );
    if (!tableRes.rows[0].table_exists) {
      console.warn(
        'WARNING: Table "public.transactions" does not exist in this database!',
      );
      console.warn(
        "The migration might successfully create the function, but it will fail at runtime.",
      );
    } else {
      console.log('Confirmed: "public.transactions" table exists.');
    }

    const sqlPath = path.join(
      __dirname,
      "../supabase/migrations/20260218_get_account_balances.sql",
    );
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`Migration file not found at ${sqlPath}`);
    }

    const sql = fs.readFileSync(sqlPath, "utf8");

    console.log('Deploying RPC function "get_account_balances"...');
    await client.query(sql);
    console.log("Migration applied successfully!");

    // Verify function existence
    const funcRes = await client.query(
      "SELECT proname FROM pg_proc WHERE proname = 'get_account_balances';",
    );
    if (funcRes.rows.length > 0) {
      console.log('Verification: Function "get_account_balances" exists.');
    } else {
      console.error("Verification FAILED: Function not found after execution.");
    }
  } catch (e) {
    console.error("Execution Failed:", e);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
