const { Client } = require('pg');

const PROJECTS = [
  { name: 'DEV', connectionString: 'postgresql://postgres:audit-tool2027@db.grqhnhftseisxsobamju.supabase.co:5432/postgres' },
  { name: 'PROD', connectionString: 'postgresql://postgres:audit-tool2027@db.yuldkgknnvvtmlpkqsji.supabase.co:5432/postgres' },
];

const sql = `
  -- List all policies on tenant_members
  SELECT policyname, cmd, qual::text, with_check::text
  FROM pg_policies
  WHERE tablename = 'tenant_members';
`;

async function run() {
  for (const project of PROJECTS) {
    console.log('\\n---', project.name, '---');
    const client = new Client({ connectionString: project.connectionString, ssl: { rejectUnauthorized: false } });
    try {
      await client.connect();
      const { rows } = await client.query(sql);
      console.log(JSON.stringify(rows, null, 2));
    } catch (err) {
      console.error('Error:', err.message);
    } finally {
      await client.end();
    }
  }
}

run();
