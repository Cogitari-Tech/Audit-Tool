const { Client } = require('pg');

const PROJECTS = [
  { name: 'DEV', connectionString: 'postgresql://postgres:audit-tool2027@db.grqhnhftseisxsobamju.supabase.co:5432/postgres' },
  { name: 'PROD', connectionString: 'postgresql://postgres:audit-tool2027@db.yuldkgknnvvtmlpkqsji.supabase.co:5432/postgres' },
];

const sql = `
  -- Fix tenant_members RLS: allow users to read their own memberships
  -- This prevents infinite recursion when auth.jwt() doesn't have tenant_id
  DROP POLICY IF EXISTS "Users can read own memberships" ON public.tenant_members;
  CREATE POLICY "Users can read own memberships" ON public.tenant_members
    FOR SELECT USING (
      user_id = auth.uid()
      OR tenant_id::text = coalesce(auth.jwt() ->> 'tenant_id', '')
    );

  DROP POLICY IF EXISTS "Admins can manage team" ON public.tenant_members;
  CREATE POLICY "Admins can manage team" ON public.tenant_members
    FOR ALL USING (
      tenant_id::text = coalesce(auth.jwt() ->> 'tenant_id', '')
    );

  -- Fix roles RLS: ensure system roles are always readable
  DROP POLICY IF EXISTS "roles_read" ON public.roles;
  CREATE POLICY "roles_read" ON public.roles
    FOR SELECT USING (true);

  -- Fix permissions RLS: always readable
  DROP POLICY IF EXISTS "permissions_read" ON public.permissions;
  CREATE POLICY "permissions_read" ON public.permissions
    FOR SELECT USING (true);

  -- Fix role_permissions RLS: always readable
  DROP POLICY IF EXISTS "role_permissions_read" ON public.role_permissions;
  CREATE POLICY "role_permissions_read" ON public.role_permissions
    FOR SELECT USING (true);

  -- Fix tenants RLS: allow reading own tenant
  DROP POLICY IF EXISTS "Users can read own tenant" ON public.tenants;
  CREATE POLICY "Users can read own tenant" ON public.tenants
    FOR SELECT USING (
      id::text = coalesce(auth.jwt() ->> 'tenant_id', '')
      OR id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid())
    );
`;

async function run() {
  for (const project of PROJECTS) {
    console.log('Running RLS fix on', project.name);
    const client = new Client({ connectionString: project.connectionString, ssl: { rejectUnauthorized: false } });
    try {
      await client.connect();
      await client.query(sql);
      console.log('✅', project.name, 'done');
    } catch (err) {
      console.error('❌', project.name, err.message);
    } finally {
      await client.end();
    }
  }
}

run();
