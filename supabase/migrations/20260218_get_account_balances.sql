-- Function to get account balances for a specific period
-- Used for Income Statement (DRE) and Balance Sheet calculation
-- Usage: supabase.rpc('get_account_balances', { p_start_date: '...', p_end_date: '...' })

CREATE OR REPLACE FUNCTION get_account_balances(
    p_start_date DATE,
    p_end_date DATE
)
RETURNS TABLE (
    account_id TEXT,
    account_name TEXT,
    account_code TEXT,
    account_type TEXT,
    is_analytical BOOLEAN,
    debit_total NUMERIC,
    credit_total NUMERIC,
    balance NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH tx_split AS (
        -- Debits
        SELECT
            account_debit_id AS acc_id,
            amount,
            0::NUMERIC AS credit_amount
        FROM transactions
        WHERE date >= p_start_date AND date <= p_end_date

        UNION ALL

        -- Credits
        SELECT
            account_credit_id AS acc_id,
            0::NUMERIC AS amount,
            amount AS credit_amount
        FROM transactions
        WHERE date >= p_start_date AND date <= p_end_date
    ),
    acc_totals AS (
        SELECT
            acc_id,
            SUM(amount) AS total_debit,
            SUM(credit_amount) AS total_credit
        FROM tx_split
        GROUP BY acc_id
    )
    SELECT
        a.id::TEXT,
        a.name,
        a.code,
        a.type,
        a.is_analytical,
        COALESCE(t.total_debit, 0) AS debit_total,
        COALESCE(t.total_credit, 0) AS credit_total,
        CASE
            -- Accounts with Debit Nature (increase with Debit)
            WHEN a.type IN ('checking', 'savings', 'investment', 'cash', 'Despesa') THEN
                COALESCE(t.total_debit, 0) - COALESCE(t.total_credit, 0)
            -- Accounts with Credit Nature (increase with Credit)
            ELSE
                COALESCE(t.total_credit, 0) - COALESCE(t.total_debit, 0)
        END AS balance
    FROM accounts a
    LEFT JOIN acc_totals t ON a.id = t.acc_id
    ORDER BY a.code;
END;
$$;
