# Movie Information Website (Topic 39)

**Student:** Muhammad Bilal  
**ID:** 22501-3251014-  
**Specialization:** Software Engineering  
**Semester:** 3rd  
**Instructor:** Sir Zeeshan  

Individual full-stack project using React.js, Node.js, Express.js, and MySQL (XAMPP).

## Quick start

1. Start **Apache + MySQL** in XAMPP.
2. Import [`database/schema.sql`](database/schema.sql) in phpMyAdmin / MySQL for a fresh install.  
   To restore the latest data dump instead, import [`database/movie_info_db backup.sql`](database/movie_info_db%20backup.sql) into an existing `movie_info_db` database.
3. Backend:
   ```bash
   cd server
   copy .env.example .env
   npm install
   npm start
   ```
4. Frontend:
   ```bash
   cd client
   npm install
   npm run dev
   ```
5. Open `http://localhost:5173`

### Demo admin

- Email: `admin@movieinfo.local`
- Password: `Admin@123`

## Documentation

See the [`docs/`](docs/) folder for full project documentation, setup, API reference, testing, and submission checklist.
