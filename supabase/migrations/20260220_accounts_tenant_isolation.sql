-- Add tenant_id to restrict account visibility
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view accounts" ON accounts;

-- Create an isolated policy: users can only see accounts belonging to their tenant, or global system accounts (tenant_id IS NULL)
CREATE POLICY "Users can view accounts in their tenant"
ON accounts
FOR SELECT
TO authenticated
USING (
    tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid())
    OR tenant_id IS NULL
);

-- Allow users to create custom accounts for their tenant
CREATE POLICY "Users can create accounts in their tenant"
ON accounts
FOR INSERT
TO authenticated
WITH CHECK (
    tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid())
);

-- Allow users to update their own tenant's accounts
CREATE POLICY "Users can update accounts in their tenant"
ON accounts
FOR UPDATE
TO authenticated
USING (
    tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid())
)
WITH CHECK (
    tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid())
);

-- Allow users to delete their own tenant's accounts
CREATE POLICY "Users can delete accounts in their tenant"
ON accounts
FOR DELETE
TO authenticated
USING (
    tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid())
);
