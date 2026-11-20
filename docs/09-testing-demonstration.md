# 09 - Testing & Demonstration

**Student:** Muhammad Bilal · **ID:** 22501-3251014-  
**Instructor demo script for Sir Zeeshan**

## Demo flow

1. Open home page - show watermark and recent movies.
2. Browse Movies - filter by category (single) and genres (multiple).
3. Search a nonsense title - show **relevant** results toast/banner.
4. Open a movie detail - description, category, genres, release date.
5. Visit an invalid URL - custom 404.
6. Admin login (`admin@movieinfo.local` / `Admin@123`).
7. Create/edit a movie with poster upload.
8. Try deleting a category that has movies - toast error (protected).
9. Logout and show public site again.

## Suggested test cases

| Case | Expected |
|------|----------|
| Login with wrong password | Error toast |
| Create movie without genre | Warning/error toast |
| Exact search match | `exactMatch: true` |
| No exact match | Relevant movies + message |
| Delete used category | Blocked with message |
| Missing movie id | 404 page |
| Poster missing | Placeholder image |
