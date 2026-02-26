const { Client } = require("pg");

const sql = `
  -- Update the confirmation timestamp for the user created by the subagent
  UPDATE auth.users
  SET email_confirmed_at = NOW(),
      phone_confirmed_at = NOW(),
      confirmed_at = NOW(),
      is_sso_user = false
  WHERE email = 'final.test.valid@example.com';
`;

async function run() {
  const client = new Client({
    connectionString:
      "postgresql://postgres:audit-tool2027@db.grqhnhftseisxsobamju.supabase.co:5432/postgres",
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    const result = await client.query(sql);
    console.log(
      "✅ Confirmed final.test.valid@example.com - Rows updated:",
      result.rowCount,
    );
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
}

run();
