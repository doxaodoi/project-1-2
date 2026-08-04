-- =====================================================================
-- CPEN 208 Project 1 - 01_schemas.sql
-- ---------------------------------------------------------------------
-- Run while connected to the "coe_dept" database.
-- Organises the database into four logical schemas:
--   people    -> persons: students, lecturers, teaching assistants
--   academic  -> courses, enrollments and teaching assignments
--   finance   -> fee bills, payments and the outstanding-fees function
--   auth      -> login accounts for the web/API layer
-- =====================================================================

CREATE SCHEMA IF NOT EXISTS people;
CREATE SCHEMA IF NOT EXISTS academic;
CREATE SCHEMA IF NOT EXISTS finance;
CREATE SCHEMA IF NOT EXISTS auth;

COMMENT ON SCHEMA people   IS 'Persons: students, lecturers, teaching assistants.';
COMMENT ON SCHEMA academic IS 'Courses, enrollments, lecturer/TA assignments.';
COMMENT ON SCHEMA finance  IS 'Fee bills, payments and outstanding-fee calculations.';
COMMENT ON SCHEMA auth     IS 'Login accounts for the Next.js frontend / Spring Boot API.';
