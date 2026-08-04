-- =====================================================================
-- CPEN 208 Project 1 - 03_functions.sql
-- ---------------------------------------------------------------------
-- Run while connected to "coe_dept" (after 02_tables.sql).
--
-- REQUIRED FUNCTION:
--   finance.get_outstanding_fees()
--   Calculates the outstanding fees for EVERY student and returns the
--   result as a JSON array (one object per student).
--
--   outstanding = SUM(fee_bills.amount_due) - SUM(payments.amount)
--
-- A scalar helper finance.get_student_outstanding(student_id) is also
-- provided; the API/frontend reuse it for a single logged-in student.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Per-student outstanding balance (single value). Returns 0 when a
-- student has no bills, and treats missing payments as 0.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION finance.get_student_outstanding(p_student_id BIGINT)
RETURNS NUMERIC
LANGUAGE sql
STABLE
AS $$
    SELECT
        COALESCE((SELECT SUM(amount_due) FROM finance.fee_bills
                  WHERE student_id = p_student_id), 0)
      - COALESCE((SELECT SUM(amount)     FROM finance.payments
                  WHERE student_id = p_student_id), 0);
$$;

-- ---------------------------------------------------------------------
-- Outstanding fees for ALL students, returned as a JSON array.
-- Example element:
--   {
--     "student_id": 22312110,
--     "full_name": "David Kwame Odoi-Anim",
--     "email": "22312110@st.ug.edu.gh",
--     "total_billed": 12800.00,
--     "total_paid": 9000.00,
--     "outstanding": 3800.00
--   }
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION finance.get_outstanding_fees()
RETURNS JSON
LANGUAGE sql
STABLE
AS $$
    SELECT COALESCE(json_agg(row_to_json(t) ORDER BY t.full_name), '[]'::json)
    FROM (
        SELECT
            s.student_id,
            s.full_name,
            s.email,
            COALESCE(b.total_billed, 0)                       AS total_billed,
            COALESCE(p.total_paid, 0)                         AS total_paid,
            COALESCE(b.total_billed, 0) - COALESCE(p.total_paid, 0) AS outstanding
        FROM people.students s
        LEFT JOIN (
            SELECT student_id, SUM(amount_due) AS total_billed
            FROM finance.fee_bills
            GROUP BY student_id
        ) b ON b.student_id = s.student_id
        LEFT JOIN (
            SELECT student_id, SUM(amount) AS total_paid
            FROM finance.payments
            GROUP BY student_id
        ) p ON p.student_id = s.student_id
    ) t;
$$;

COMMENT ON FUNCTION finance.get_outstanding_fees()
    IS 'Returns a JSON array of every student''s billed, paid and outstanding fees.';
