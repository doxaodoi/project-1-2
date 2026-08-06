-- =====================================================================
-- CPEN 208 Project 1 - 02_tables.sql
-- ---------------------------------------------------------------------
-- Run while connected to "coe_dept" (after 01_schemas.sql).
-- Creates every table needed for the five required functionalities:
--   1. Student personal information      -> people.students
--   2. Student fees payments             -> finance.fee_bills / finance.payments
--   3. Course enrollment                 -> academic.enrollments
--   4. Lecturers to course assignment    -> academic.lecturer_course_assignment
--   5. Lecturers to TA assignment        -> academic.lecturer_ta_assignment
-- Drops in dependency order so the script is re-runnable.
-- =====================================================================

DROP TABLE IF EXISTS auth.users                        CASCADE;
DROP TABLE IF EXISTS finance.payments                  CASCADE;
DROP TABLE IF EXISTS finance.fee_bills                 CASCADE;
DROP TABLE IF EXISTS academic.enrollments              CASCADE;
DROP TABLE IF EXISTS academic.lecturer_ta_assignment   CASCADE;
DROP TABLE IF EXISTS academic.lecturer_course_assignment CASCADE;
DROP TABLE IF EXISTS academic.courses                  CASCADE;
DROP TABLE IF EXISTS people.teaching_assistants        CASCADE;
DROP TABLE IF EXISTS people.lecturers                  CASCADE;
DROP TABLE IF EXISTS people.students                   CASCADE;
DROP TABLE IF EXISTS people.programs                   CASCADE;

-- ---------------------------------------------------------------------
-- people.programs : degree programmes offered by the department
-- ---------------------------------------------------------------------
CREATE TABLE people.programs (
    program_id      SERIAL PRIMARY KEY,
    code            VARCHAR(20)  NOT NULL UNIQUE,
    name            VARCHAR(120) NOT NULL,
    degree          VARCHAR(60)  NOT NULL,
    duration_years  SMALLINT     NOT NULL DEFAULT 4
);

-- ---------------------------------------------------------------------
-- people.students : student personal information (functionality 1)
-- student_id is the official University of Ghana ID number.
-- ---------------------------------------------------------------------
CREATE TABLE people.students (
    student_id      BIGINT       PRIMARY KEY,
    full_name       VARCHAR(150) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    phone           VARCHAR(20),
    date_of_birth   DATE,
    gender          VARCHAR(20),                 -- nullable; not inferred from names
    level           SMALLINT     NOT NULL DEFAULT 400,
    program_id      INT          NOT NULL REFERENCES people.programs(program_id),
    enrolled_on     DATE         NOT NULL DEFAULT CURRENT_DATE
);

-- ---------------------------------------------------------------------
-- people.lecturers
-- ---------------------------------------------------------------------
CREATE TABLE people.lecturers (
    lecturer_id     SERIAL       PRIMARY KEY,
    staff_no        VARCHAR(20)  NOT NULL UNIQUE,
    title           VARCHAR(20),
    full_name       VARCHAR(150) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    academic_rank   VARCHAR(60),
    phone           VARCHAR(20)
);

-- ---------------------------------------------------------------------
-- people.teaching_assistants
-- A TA may also be a student (student_id link, optional).
-- ---------------------------------------------------------------------
CREATE TABLE people.teaching_assistants (
    ta_id           SERIAL       PRIMARY KEY,
    full_name       VARCHAR(150) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    student_id      BIGINT       REFERENCES people.students(student_id)
);

-- ---------------------------------------------------------------------
-- academic.courses
-- ---------------------------------------------------------------------
CREATE TABLE academic.courses (
    course_id       SERIAL       PRIMARY KEY,
    code            VARCHAR(15)  NOT NULL UNIQUE,   -- e.g. 'CPEN 208'
    title           VARCHAR(150) NOT NULL,
    credit_hours    SMALLINT     NOT NULL DEFAULT 3,
    level           SMALLINT     NOT NULL,
    semester        SMALLINT     NOT NULL CHECK (semester IN (1, 2))
);

-- ---------------------------------------------------------------------
-- academic.lecturer_course_assignment (functionality 4)
-- Which lecturer teaches which course in a given year/semester.
-- ---------------------------------------------------------------------
CREATE TABLE academic.lecturer_course_assignment (
    assignment_id   SERIAL       PRIMARY KEY,
    lecturer_id     INT          NOT NULL REFERENCES people.lecturers(lecturer_id),
    course_id       INT          NOT NULL REFERENCES academic.courses(course_id),
    academic_year   VARCHAR(9)   NOT NULL,          -- e.g. '2025/2026'
    semester        SMALLINT     NOT NULL CHECK (semester IN (1, 2)),
    UNIQUE (lecturer_id, course_id, academic_year, semester)
);

-- ---------------------------------------------------------------------
-- academic.lecturer_ta_assignment (functionality 5)
-- Which TA assists which lecturer, for which course.
-- ---------------------------------------------------------------------
CREATE TABLE academic.lecturer_ta_assignment (
    assignment_id   SERIAL       PRIMARY KEY,
    lecturer_id     INT          NOT NULL REFERENCES people.lecturers(lecturer_id),
    ta_id           INT          NOT NULL REFERENCES people.teaching_assistants(ta_id),
    course_id       INT          NOT NULL REFERENCES academic.courses(course_id),
    academic_year   VARCHAR(9)   NOT NULL,
    UNIQUE (lecturer_id, ta_id, course_id, academic_year)
);

-- ---------------------------------------------------------------------
-- academic.enrollments (functionality 3)
-- ---------------------------------------------------------------------
CREATE TABLE academic.enrollments (
    enrollment_id   SERIAL       PRIMARY KEY,
    student_id      BIGINT       NOT NULL REFERENCES people.students(student_id),
    course_id       INT          NOT NULL REFERENCES academic.courses(course_id),
    academic_year   VARCHAR(9)   NOT NULL,
    semester        SMALLINT     NOT NULL CHECK (semester IN (1, 2)),
    grade           VARCHAR(2),
    enrolled_on     DATE         NOT NULL DEFAULT CURRENT_DATE,
    UNIQUE (student_id, course_id, academic_year, semester)
);

-- ---------------------------------------------------------------------
-- finance.fee_bills : amounts a student is billed (functionality 2)
-- ---------------------------------------------------------------------
CREATE TABLE finance.fee_bills (
    bill_id         SERIAL         PRIMARY KEY,
    student_id      BIGINT         NOT NULL REFERENCES people.students(student_id),
    academic_year   VARCHAR(9)     NOT NULL,
    semester        SMALLINT       NOT NULL CHECK (semester IN (1, 2)),
    description     VARCHAR(120)   NOT NULL,
    amount_due      NUMERIC(12,2)  NOT NULL CHECK (amount_due >= 0),
    billed_on       DATE           NOT NULL DEFAULT CURRENT_DATE
);

-- ---------------------------------------------------------------------
-- finance.payments : amounts a student has paid (functionality 2)
-- ---------------------------------------------------------------------
CREATE TABLE finance.payments (
    payment_id      SERIAL         PRIMARY KEY,
    student_id      BIGINT         NOT NULL REFERENCES people.students(student_id),
    amount          NUMERIC(12,2)  NOT NULL CHECK (amount > 0),
    paid_on         DATE           NOT NULL DEFAULT CURRENT_DATE,
    method          VARCHAR(30)    NOT NULL DEFAULT 'BANK',
    reference       VARCHAR(60)
);

-- ---------------------------------------------------------------------
-- auth.users : login accounts consumed by the API / frontend
-- ---------------------------------------------------------------------
-- student_id is NULL for staff/admin accounts (they are not students);
-- full_name holds an admin's display name (students resolve theirs from people.students).
CREATE TABLE auth.users (
    user_id         SERIAL        PRIMARY KEY,
    student_id      BIGINT        UNIQUE REFERENCES people.students(student_id),
    full_name       VARCHAR(150),
    email           VARCHAR(150)  NOT NULL UNIQUE,
    password_hash   VARCHAR(100)  NOT NULL,
    role            VARCHAR(20)   NOT NULL DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'ADMIN')),
    created_at      TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- Helpful indexes for the fee lookups used by the outstanding-fees function.
CREATE INDEX idx_fee_bills_student ON finance.fee_bills(student_id);
CREATE INDEX idx_payments_student  ON finance.payments(student_id);
CREATE INDEX idx_enrollments_student ON academic.enrollments(student_id);
