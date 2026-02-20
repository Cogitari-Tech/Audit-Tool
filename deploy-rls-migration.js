#!/usr/bin/env node
// deploy-rls-migration.js
// Applies the accounts tenant-isolation RLS migration to audit-tool databases

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const MIGRATION_SQL = fs.readFileSync(
  path.join(__dirname, 'supabase/migrations/20260220_accounts_tenant_isolation.sql'),
  'utf8'
);

const PROJECTS = [
  {
    name: 'audit-tool-beta',
    dsn: process.env.AUDIT_TOOL_BETA_DSN || 'postgresql://postgres:audit-tool2026@db.grqhnhftseisxsobamju.supabase.co:5432/postgres',
  },
  {
    name: 'audit-tool-prod',
    dsn: process.env.AUDIT_TOOL_PROD_DSN,
  },
];

async function applyMigration(project) {
  if (!project.dsn) {
    console.warn(`⚠️  [${project.name}] DSN not set — skipping. Set AUDIT_TOOL_PROD_DSN env var.`);
    return;
  }

  const client = new Client({ connectionString: project.dsn, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    console.log(`🔗 [${project.name}] Connected.`);
    await client.query(MIGRATION_SQL);
    console.log(`✅ [${project.name}] Migration applied successfully.`);
  } catch (err) {
    console.error(`❌ [${project.name}] Error: ${err.message}`);
  } finally {
    await client.end();
  }
}

(async () => {
  console.log('🛡️  Applying accounts tenant isolation migration...\n');
  for (const project of PROJECTS) {
    await applyMigration(project);
  }
  console.log('\nDone.');
})();
