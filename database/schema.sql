-- Movie Information Website (Topic 39)
-- Student: Muhammad Bilal | ID: 22501-3251014-
-- Database: movie_info_db

CREATE DATABASE IF NOT EXISTS movie_info_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE movie_info_db;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS movie_genres;
DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS admins;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE admins (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE genres (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE movies (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  release_date DATE NOT NULL,
  poster_path VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_movies_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE movie_genres (
  movie_id INT UNSIGNED NOT NULL,
  genre_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (movie_id, genre_id),
  CONSTRAINT fk_mg_movie
    FOREIGN KEY (movie_id) REFERENCES movies(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_mg_genre
    FOREIGN KEY (genre_id) REFERENCES genres(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Demo admin: admin@movieinfo.local / Admin@123
INSERT INTO admins (name, email, password) VALUES
('Site Admin', 'admin@movieinfo.local', '$2b$10$6O1D/O7uMvb0re3kAL3ERu9qmFl8YfKV3W2DSfU7Wo9tAIv1B.8l.');

INSERT INTO categories (name, description) VALUES
('Hollywood', 'English-language films from the United States film industry.'),
('Bollywood', 'Hindi-language films from the Indian film industry.'),
('Animation', 'Animated feature films for all ages.'),
('Documentary', 'Non-fiction films based on real events and people.'),
('Independent', 'Indie and festival films outside major studio systems.');

INSERT INTO genres (name, description) VALUES
('Action', 'High-energy films with stunts and conflict.'),
('Comedy', 'Films focused on humor and entertainment.'),
('Drama', 'Character-driven serious storytelling.'),
('Horror', 'Suspense and fear-focused films.'),
('Sci-Fi', 'Science fiction and futuristic themes.'),
('Romance', 'Love stories and relationships.'),
('Thriller', 'Suspenseful plots and tension.'),
('Adventure', 'Exploration and journey-driven stories.');

INSERT INTO movies (title, description, category_id, release_date, poster_path) VALUES
('Neon Horizon', 'A courier races across a neon city to deliver a package that could rewrite history.', 1, '2022-06-15', 'uploads/posters/neon-horizon.jpg'),
('Monsoon Letters', 'Two strangers exchange letters during monsoon season and rediscover hope.', 2, '2021-08-20', 'uploads/posters/monsoon-letters.jpg'),
('Skyward Pines', 'An animated journey of a young bird learning to trust the wind.', 3, '2020-03-12', 'uploads/posters/skyward-pines.jpg'),
('Echoes of Earth', 'A documentary following climate scientists across vanishing glaciers.', 4, '2023-01-10', 'uploads/posters/echoes-of-earth.jpg'),
('Quiet Harbor', 'An indie drama about a fisherman returning home after twenty years.', 5, '2019-11-05', 'uploads/posters/quiet-harbor.jpg'),
('Circuit Storm', 'Hackers and agents collide when an AI city grid goes rogue.', 1, '2024-02-14', 'uploads/posters/circuit-storm.jpg'),
('Chai & Stars', 'A comedy about a roadside tea stall that becomes a celebrity hotspot.', 2, '2022-12-01', 'uploads/posters/chai-and-stars.jpg'),
('Pixel Knights', 'Animated knights defend a digital kingdom from a corrupted virus king.', 3, '2021-05-22', 'uploads/posters/pixel-knights.jpg'),
('Ocean Vault', 'Explorers dive into a sealed trench hiding wartime secrets.', 1, '2023-09-09', 'uploads/posters/ocean-vault.jpg'),
('Desert Mirror', 'A thriller about identity theft in a remote desert resort.', 5, '2020-07-18', 'uploads/posters/desert-mirror.jpg'),
('Garden of Seconds', 'A romance that unfolds across parallel timelines in one garden.', 1, '2018-04-04', 'uploads/posters/garden-of-seconds.jpg'),
('Steel Lotus', 'An action epic about a bodyguard protecting a whistleblower in Mumbai.', 2, '2024-05-30', 'uploads/posters/steel-lotus.jpg');

INSERT INTO movie_genres (movie_id, genre_id) VALUES
(1, 1), (1, 5), (1, 8),
(2, 3), (2, 6),
(3, 8), (3, 2),
(4, 3),
(5, 3),
(6, 1), (6, 5), (6, 7),
(7, 2), (7, 6),
(8, 1), (8, 8),
(9, 8), (9, 7),
(10, 7), (10, 4),
(11, 6), (11, 5),
(12, 1), (12, 7);
