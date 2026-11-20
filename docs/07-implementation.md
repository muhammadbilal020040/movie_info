# 07 - Implementation

**Student:** Muhammad Bilal · **ID:** 22501-3251014-

## Structure

- `client/` - React (Vite) + Bootstrap SPA
- `server/` - Express REST API
- `database/` - `schema.sql` (fresh install) and `movie_info_db backup.sql` (latest dump)
- `docs/` - project documentation

## Key flows

1. **Search:** exact AND filters first; if empty, relevant fallback (title → category → any genre → recent).
2. **Uploads:** Multer writes to `server/uploads/posters/`; DB stores relative path only.
3. **Toasts:** `ToastProvider` + `useToast()` for success/error/warning/info; no native alerts.
4. **Deletes:** Bootstrap confirm modal; category/genre delete blocked when in use.
5. **Watermarks:** student name and ID in footer, home credit strip, admin shell, page titles, docs.

## Auth

JWT Bearer token stored in `localStorage` after admin login.
