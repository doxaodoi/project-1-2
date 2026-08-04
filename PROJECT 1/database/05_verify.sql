-- =====================================================================
-- CPEN 208 Project 1 - 05_verify.sql
-- ---------------------------------------------------------------------
-- Run while connected to "coe_dept" (after 04_seed.sql).
-- Quick sanity checks + a demonstration of the required JSON function.
-- =====================================================================

-- Row counts per table -------------------------------------------------
SELECT 'programs'            AS table, COUNT(*) FROM people.programs
UNION ALL SELECT 'students',              COUNT(*) FROM people.students
UNION ALL SELECT 'lecturers',             COUNT(*) FROM people.lecturers
UNION ALL SELECT 'teaching_assistants',   COUNT(*) FROM people.teaching_assistants
UNION ALL SELECT 'courses',               COUNT(*) FROM academic.courses
UNION ALL SELECT 'lecturer_course_asg',   COUNT(*) FROM academic.lecturer_course_assignment
UNION ALL SELECT 'lecturer_ta_asg',       COUNT(*) FROM academic.lecturer_ta_assignment
UNION ALL SELECT 'enrollments',           COUNT(*) FROM academic.enrollments
UNION ALL SELECT 'fee_bills',             COUNT(*) FROM finance.fee_bills
UNION ALL SELECT 'payments',              COUNT(*) FROM finance.payments
UNION ALL SELECT 'users',                 COUNT(*) FROM auth.users;

-- Outstanding for a single student (David Kwame Odoi-Anim) -------------
SELECT finance.get_student_outstanding(22312110) AS david_outstanding;

-- A readable per-student billed/paid/outstanding view ------------------
SELECT
    s.student_id,
    s.full_name,
    COALESCE(SUM(DISTINCT_b.total_billed), 0) AS total_billed,
    COALESCE(pp.total_paid, 0)                AS total_paid,
    finance.get_student_outstanding(s.student_id) AS outstanding
FROM people.students s
LEFT JOIN (
    SELECT student_id, SUM(amount_due) AS total_billed
    FROM finance.fee_bills GROUP BY student_id
) DISTINCT_b ON DISTINCT_b.student_id = s.student_id
LEFT JOIN (
    SELECT student_id, SUM(amount) AS total_paid
    FROM finance.payments GROUP BY student_id
) pp ON pp.student_id = s.student_id
GROUP BY s.student_id, s.full_name, pp.total_paid
ORDER BY s.full_name
LIMIT 10;

-- ***** THE REQUIRED FUNCTION: outstanding fees for ALL students, JSON *****
SELECT finance.get_outstanding_fees();

-- Pretty-printed version (easier to read in pgAdmin) ------------------
SELECT jsonb_pretty(finance.get_outstanding_fees()::jsonb);
