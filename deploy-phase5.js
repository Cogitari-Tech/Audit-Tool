const { Client } = require("pg");
const fs = require("fs");

const PROJECTS = [
  {
    name: "DEV",
    connectionString:
      "postgresql://postgres:audit-tool2027@db.grqhnhftseisxsobamju.supabase.co:5432/postgres",
  },
  {
    name: "PROD",
    connectionString:
      "postgresql://postgres:audit-tool2027@db.yuldkgknnvvtmlpkqsji.supabase.co:5432/postgres",
  },
];

const sql = fs.readFileSync(
  "./supabase/migrations/20260226_phase5_audit_core.sql",
  "utf8",
);

async function run() {
  for (const project of PROJECTS) {
    console.log(`\n--- deploying phase 5 to ${project.name} ---`);
    const client = new Client({
      connectionString: project.connectionString,
      ssl: { rejectUnauthorized: false },
    });
    try {
      await client.connect();
      // Execute the migration SQL
      await client.query(sql);
      console.log(`✅ Phase 5 deployed in ${project.name}`);
    } catch (err) {
      console.error(`❌ Error in ${project.name}:`, err.message);
    } finally {
      await client.end();
    }
  }
}

run();
