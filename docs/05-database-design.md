# 05 - Database Design

**Student:** Muhammad Bilal · **ID:** 22501-3251014-  
**Database:** `movie_info_db`

## Tables

- `admins` - admin accounts (bcrypt password hashes)
- `categories` - single category per movie
- `genres` - genre master list
- `movies` - title, description, category_id, release_date, **poster_path** (path only)
- `movie_genres` - many-to-many link between movies and genres

## Notes

- No image BLOBs are stored in MySQL.
- Deleting a category/genre in use is blocked by application logic (and FK restrict).
- Fresh install schema + seed data: [`../database/schema.sql`](../database/schema.sql)
- Latest phpMyAdmin dump: [`../database/movie_info_db backup.sql`](../database/movie_info_db%20backup.sql)
