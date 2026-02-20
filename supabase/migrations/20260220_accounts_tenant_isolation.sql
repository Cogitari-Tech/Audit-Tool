-- ==========================================================
-- Migration: accounts & transactions RLS hardening
-- Audit Tool (single-tenant per deployment)
-- ==========================================================

-- ---- ACCOUNTS ----

DROP POLICY IF EXISTS "Authenticated users can view accounts" ON accounts;
DROP POLICY IF EXISTS "Authenticated users can create accounts" ON accounts;
DROP POLICY IF EXISTS "Authenticated users can update accounts" ON accounts;
DROP POLICY IF EXISTS "Authenticated users can delete accounts" ON accounts;

CREATE POLICY "Authenticated users can view accounts"
ON accounts FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create accounts"
ON accounts FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update accounts"
ON accounts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete accounts"
ON accounts FOR DELETE TO authenticated USING (true);

-- ---- TRANSACTIONS ----

DROP POLICY IF EXISTS "Users can see own transactions" ON transactions;

CREATE POLICY "Users can see own transactions"
ON transactions FOR ALL
USING (auth.uid() = created_by::uuid);
