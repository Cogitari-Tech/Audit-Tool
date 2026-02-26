const { Client } = require("pg");

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

const sql = `
-- Remove old triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user_registration();

CREATE OR REPLACE FUNCTION public.handle_new_user_registration()
RETURNS TRIGGER AS $$
DECLARE
  v_tenant_id UUID;
  v_owner_role_id UUID;
  v_company_name TEXT;
BEGIN
  -- Extract companyName from user metadata
  v_company_name := NULLIF(TRIM(NEW.raw_user_meta_data->>'companyName'), '');
  
  -- Fallback if empty
  IF v_company_name IS NULL THEN
    v_company_name := INITCAP(SPLIT_PART(NEW.email, '@', 1)) || ' Workspace';
  END IF;

  -- 1. Get owner role ID (system role)
  SELECT id INTO v_owner_role_id 
  FROM public.roles 
  WHERE name = 'owner' AND is_system = true 
  LIMIT 1;

  IF v_owner_role_id IS NULL THEN
    RAISE LOG 'Role "owner" not found. Cannot auto-provision user %', NEW.id;
    RETURN NEW;
  END IF;

  -- 2. Create the Tenant
  INSERT INTO public.tenants (name, plan, plan_status)
  VALUES (v_company_name, 'free', 'active')
  RETURNING id INTO v_tenant_id;

  -- 3. Link user to tenant as Owner
  INSERT INTO public.tenant_members (tenant_id, user_id, role_id, status)
  VALUES (v_tenant_id, NEW.id, v_owner_role_id, 'active');

  -- 4. Update user's raw_app_meta_data with tenant_id so JWT has it
  UPDATE auth.users
  SET raw_app_meta_data = 
    COALESCE(raw_app_meta_data, '{}'::jsonb) || 
    jsonb_build_object('tenant_id', v_tenant_id)
  WHERE id = NEW.id;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in handle_new_user_registration for %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_registration();
`;

async function run() {
  for (const project of PROJECTS) {
    console.log("\\n--- deploying trigger to", project.name, "---");
    const client = new Client({
      connectionString: project.connectionString,
      ssl: { rejectUnauthorized: false },
    });
    try {
      await client.connect();
      await client.query(sql);
      console.log("✅ Trigger deployed in", project.name);
    } catch (err) {
      console.error("Error:", err.message);
    } finally {
      await client.end();
    }
  }
}

run();
