-- =====================================================================
-- CPEN 208 Project 1 - Computer Engineering Department System
-- 00_create_database.sql
-- ---------------------------------------------------------------------
-- Run this script FIRST, while connected to the default "postgres"
-- database (in pgAdmin: open a Query Tool on the "postgres" database).
-- It creates the project database. Every later script (01..05) must be
-- run while connected to the "coe_dept" database.
-- =====================================================================

-- Drop if it already exists (fresh install). Comment out to keep data.
DROP DATABASE IF EXISTS coe_dept;

CREATE DATABASE coe_dept
    WITH
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;

COMMENT ON DATABASE coe_dept
    IS 'CPEN 208 Project 1 - Computer Engineering Department academic & fees system.';

-- After this completes, reconnect to "coe_dept" and run 01_schemas.sql.
