-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- Transactions Policy
-- Users can only see transactions they created
CREATE POLICY "Users can see own transactions"
ON transactions
FOR ALL
USING (auth.uid() = created_by::uuid);

-- Accounts Policy
-- Accounts are visible to all authenticated users (read-only)
-- Only admins/service_role can modify (implicit deny for others on INSERT/UPDATE/DELETE unless policy exists)
CREATE POLICY "Authenticated users can view accounts"
ON accounts
FOR SELECT
TO authenticated
USING (true);

-- Allow service_role full access (default, but good to be explicit if needed, usually inherent)
