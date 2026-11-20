# 08 - Setup Guide

**Student:** Muhammad Bilal · **ID:** 22501-3251014-

## Prerequisites

- XAMPP (MySQL running)
- Node.js + npm

## Database

1. Start MySQL in XAMPP.
2. **Fresh install:** import `database/schema.sql` via phpMyAdmin or:
   ```bash
   C:\xampp\mysql\bin\mysql.exe -u root < D:\MB\database\schema.sql
   ```
   This creates `movie_info_db`, tables, and demo seed data.
3. **Restore latest backup (optional):** import `database/movie_info_db backup.sql` into an existing `movie_info_db` database in phpMyAdmin (or create the empty DB first, then import the dump).

## Backend

```bash
cd D:\MB\server
copy .env.example .env
npm install
npm start
```

API: `http://localhost:5000`

## Frontend

```bash
cd D:\MB\client
npm install
npm run dev
```

App: `http://localhost:5173`

## Demo credentials

| Field | Value |
|-------|-------|
| Email | `admin@movieinfo.local` |
| Password | `Admin@123` |

## Environment

See `server/.env.example` for `DB_*`, `JWT_SECRET`, `PORT`, `CLIENT_URL`.
