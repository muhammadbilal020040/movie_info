# 06 - API Documentation

**Base URL:** `http://localhost:5000`  
**Student:** Muhammad Bilal · **ID:** 22501-3251014-

## Auth

- `POST /api/auth/login` `{ email, password }` → `{ token, admin }`
- `GET /api/auth/me` (Bearer token)

## Categories / Genres

- `GET /api/categories` · `GET /api/categories/:id`
- `POST|PUT|DELETE /api/categories` (admin)
- `GET /api/genres` · `GET /api/genres/:id`
- `POST|PUT|DELETE /api/genres` (admin)

## Movies

- `GET /api/movies?q=&category_id=&genre_ids=1,2`
  - Response: `{ exactMatch, message, data }`
- `GET /api/movies/:id`
- `POST /api/movies` multipart: `title`, `description`, `category_id`, `release_date`, `genre_ids` (JSON array), optional `poster`
- `PUT /api/movies/:id` multipart (admin)
- `DELETE /api/movies/:id` (admin)
- `GET /api/movies/stats/summary` (admin)

## Static files

- `GET /uploads/posters/<filename>`
