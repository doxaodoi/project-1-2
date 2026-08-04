# CPEN 208 — Projects 1 & 2 · CoE Department System

**David Kwame Odoi-Anim — 22312110**
University of Ghana · Department of Computer Engineering · Second Semester 2025/2026

A relational database plus a full-stack web application for a Computer Engineering
Department: student information, fees & payments, course enrollment, and
lecturer / teaching-assistant assignments.

```
ODOI-ANIM_22312110/
├── PROJECT 1/                  Database + Next.js 14 frontend
│   ├── database/               SQL scripts (00–05) + backup
│   ├── web/                    Next.js 14 app (login / register / dashboard)
│   └── report/                 CPEN208-Project1-Report.pdf
└── PROJECT 2/                  API / web service (backend)
    ├── api/                    Spring Boot REST API
    ├── database/               Same SQL scripts + backup
    └── report/                 CPEN208-Project2-Report.pdf
```

## Architecture

```
Browser ──► Next.js 14 frontend (:3000) ──► Spring Boot API (:8080) ──► PostgreSQL (coe_dept)
            PROJECT 1/web                    PROJECT 2/api                PROJECT */database
```

The frontend never talks to the database directly — it calls the Project 2 API,
which runs the Project 1 SQL (including the `finance.get_outstanding_fees()`
function) via `JdbcTemplate`. Authentication is custom: **BCrypt** password
hashing + a **JWT** stored in an HttpOnly cookie.

## Prerequisites
- PostgreSQL 16+ (managed with pgAdmin) — a `postgres` superuser
- Java 21 + Maven (the API also runs from an IDE)
- Node.js 18+ / npm

## 1 · Database (pgAdmin)
Run the scripts in `PROJECT 1/database` in order, in the pgAdmin Query Tool:
1. `00_create_database.sql` — connect to the **postgres** database, run it (creates `coe_dept`).
2. Reconnect to **coe_dept**, then run `01_schemas.sql` → `02_tables.sql` →
   `03_functions.sql` → `04_seed.sql` → `05_verify.sql`.

`05_verify.sql` ends with `SELECT finance.get_outstanding_fees();` — the required
JSON array of every student's outstanding fees.

Restore the provided backup instead of running the scripts:
`pg_restore -h localhost -U postgres -d coe_dept PROJECT\ 1/database/coe_dept_backup.backup`

## 2 · API — Spring Boot (PROJECT 2/api)
```bash
cd "PROJECT 2/api"
set DB_PASSWORD=your_postgres_password   # Windows (use export on macOS/Linux)
mvn spring-boot:run
```
API base: `http://localhost:8080`. Key endpoint:
`GET /api/fees/outstanding` → the Project 1 outstanding-fees JSON array.

## 3 · Frontend — Next.js (PROJECT 1/web)
```bash
cd "PROJECT 1/web"
copy .env.example .env.local     # defaults point at http://localhost:8080
npm install
npm run dev
```
Open `http://localhost:3000`.

## Demo logins
Every seeded student can sign in with the password **`Student@123`**, using the
email `<studentID>@st.ug.edu.gh` — e.g. `22312110@st.ug.edu.gh`.
You can also register a brand-new account from the Register page.

## Tech stack
| Layer | Technology |
|-------|-----------|
| Database | PostgreSQL (schemas, tables, PL/pgSQL-style SQL function) |
| Backend  | Spring Boot 3.5 (Java 21), Spring Web + JDBC, BCrypt, HS256 JWT |
| Frontend | Next.js 14 (App Router, TypeScript, Tailwind CSS) |
