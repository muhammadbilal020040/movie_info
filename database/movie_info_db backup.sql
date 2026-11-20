-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 19, 2026 at 01:37 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `movie_info_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `password`, `created_at`) VALUES
(1, 'Site Admin', 'admin@movieinfo.local', '$2b$10$6O1D/O7uMvb0re3kAL3ERu9qmFl8YfKV3W2DSfU7Wo9tAIv1B.8l.', '2026-11-19 08:56:09');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `created_at`) VALUES
(1, 'Hollywood', 'English-language films from the United States film industry.', '2026-11-19 08:56:09'),
(2, 'Bollywood', 'Hindi-language films from the Indian film industry.', '2026-11-19 08:56:09'),
(3, 'Animation', 'Animated feature films for all ages.', '2026-11-19 08:56:09'),
(4, 'Documentary', 'Non-fiction films based on real events and people.', '2026-11-19 08:56:09'),
(5, 'Independent', 'Indie and festival films outside major studio systems.', '2026-11-19 08:56:09');

-- --------------------------------------------------------

--
-- Table structure for table `genres`
--

CREATE TABLE `genres` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `genres`
--

INSERT INTO `genres` (`id`, `name`, `description`, `created_at`) VALUES
(1, 'Action', 'High-energy films with stunts and conflict.', '2026-11-19 08:56:09'),
(2, 'Comedy', 'Films focused on humor and entertainment.', '2026-11-19 08:56:09'),
(3, 'Drama', 'Character-driven serious storytelling.', '2026-11-19 08:56:09'),
(4, 'Horror', 'Suspense and fear-focused films.', '2026-11-19 08:56:09'),
(5, 'Sci-Fi', 'Science fiction and futuristic themes.', '2026-11-19 08:56:09'),
(6, 'Romance', 'Love stories and relationships.', '2026-11-19 08:56:09'),
(7, 'Thriller', 'Suspenseful plots and tension.', '2026-11-19 08:56:09'),
(8, 'Adventure', 'Exploration and journey-driven stories.', '2026-11-19 08:56:09');

-- --------------------------------------------------------

--
-- Table structure for table `movies`
--

CREATE TABLE `movies` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `category_id` int(10) UNSIGNED NOT NULL,
  `release_date` date NOT NULL,
  `poster_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `movies`
--

INSERT INTO `movies` (`id`, `title`, `description`, `category_id`, `release_date`, `poster_path`, `created_at`, `updated_at`) VALUES
(1, 'Neon Horizon', 'A courier races across a neon city to deliver a package that could rewrite history.', 1, '2022-06-15', 'uploads/posters/neon-horizon.jpg', '2026-11-19 08:56:09', '2026-11-19 11:46:03'),
(2, 'Monsoon Letters', 'Two strangers exchange letters during monsoon season and rediscover hope.', 2, '2021-08-20', 'uploads/posters/monsoon-letters.jpg', '2026-11-19 08:56:09', '2026-11-19 11:46:03'),
(3, 'Skyward Pines', 'An animated journey of a young bird learning to trust the wind.', 3, '2020-03-12', 'uploads/posters/skyward-pines.jpg', '2026-11-19 08:56:09', '2026-11-19 11:46:03'),
(4, 'Echoes of Earth', 'A documentary following climate scientists across vanishing glaciers.', 4, '2023-01-10', 'uploads/posters/echoes-of-earth.jpg', '2026-11-19 08:56:09', '2026-11-19 11:46:03'),
(5, 'Quiet Harbor', 'An indie drama about a fisherman returning home after twenty years.', 5, '2019-11-05', 'uploads/posters/quiet-harbor.jpg', '2026-11-19 08:56:09', '2026-11-19 11:46:03'),
(6, 'Circuit Storm', 'Hackers and agents collide when an AI city grid goes rogue.', 1, '2024-02-14', 'uploads/posters/circuit-storm.jpg', '2026-11-19 08:56:09', '2026-11-19 11:46:03'),
(7, 'Chai & Stars', 'A comedy about a roadside tea stall that becomes a celebrity hotspot.', 2, '2022-12-01', 'uploads/posters/chai-and-stars.jpg', '2026-11-19 08:56:09', '2026-11-19 11:46:03'),
(8, 'Pixel Knights', 'Animated knights defend a digital kingdom from a corrupted virus king.', 3, '2021-05-22', 'uploads/posters/pixel-knights.jpg', '2026-11-19 08:56:09', '2026-11-19 11:46:03'),
(9, 'Ocean Vault', 'Explorers dive into a sealed trench hiding wartime secrets.', 1, '2023-09-09', 'uploads/posters/ocean-vault.jpg', '2026-11-19 08:56:09', '2026-11-19 11:46:03'),
(10, 'Desert Mirror', 'A thriller about identity theft in a remote desert resort.', 5, '2020-07-18', 'uploads/posters/desert-mirror.jpg', '2026-11-19 08:56:09', '2026-11-19 11:46:03'),
(11, 'Garden of Seconds', 'A romance that unfolds across parallel timelines in one garden.', 1, '2018-04-04', 'uploads/posters/garden-of-seconds.jpg', '2026-11-19 08:56:09', '2026-11-19 11:46:03'),
(12, 'Steel Lotus', 'An action epic about a bodyguard protecting a whistleblower in Mumbai.', 2, '2024-05-30', 'uploads/posters/steel-lotus.jpg', '2026-11-19 08:56:09', '2026-11-19 11:46:03'),
(20, '9', '9 follows a hand-stitched doll awakening in a world ruined by war between humans and machines. Joining other numbered dolls, 9 confronts hostile mechanical creatures and investigates the ruined world and why the machines want to destroy them. It features striking, detailed animation, an eerie atmosphere, imaginative designs, and a notable voice cast. Critics found the story familiar and underdeveloped, but audiences responded more favorably.', 3, '2006-11-06', 'uploads/posters/1795083582638-7087547.webp', '2026-11-19 10:19:42', '2026-11-19 10:19:42'),
(21, 'KGF 2', 'KGF: Chapter 2 is a 2022 Indian Kannada-language period action film written and directed by Prashanth Neel, and produced by Vijay Kiragandur under his Hombale Films banner. It serves as the direct sequel to KGF: Chapter 1 (2018), as well as the second installment in the KGF franchise.', 2, '2025-11-09', 'uploads/posters/1795083871397-29241002.jpg', '2026-11-19 10:24:31', '2026-11-19 10:24:31');

-- --------------------------------------------------------

--
-- Table structure for table `movie_genres`
--

CREATE TABLE `movie_genres` (
  `movie_id` int(10) UNSIGNED NOT NULL,
  `genre_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `movie_genres`
--

INSERT INTO `movie_genres` (`movie_id`, `genre_id`) VALUES
(1, 1),
(1, 5),
(1, 8),
(2, 3),
(2, 6),
(3, 2),
(3, 8),
(4, 3),
(5, 3),
(6, 1),
(6, 5),
(6, 7),
(7, 2),
(7, 6),
(8, 1),
(8, 8),
(9, 7),
(9, 8),
(10, 4),
(10, 7),
(11, 5),
(11, 6),
(12, 1),
(12, 7),
(20, 1),
(20, 5),
(20, 8),
(21, 1),
(21, 3),
(21, 7);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `genres`
--
ALTER TABLE `genres`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_movies_category` (`category_id`);

--
-- Indexes for table `movie_genres`
--
ALTER TABLE `movie_genres`
  ADD PRIMARY KEY (`movie_id`,`genre_id`),
  ADD KEY `fk_mg_genre` (`genre_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `genres`
--
ALTER TABLE `genres`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `movies`
--
ALTER TABLE `movies`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `movies`
--
ALTER TABLE `movies`
  ADD CONSTRAINT `fk_movies_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `movie_genres`
--
ALTER TABLE `movie_genres`
  ADD CONSTRAINT `fk_mg_genre` FOREIGN KEY (`genre_id`) REFERENCES `genres` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_mg_movie` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
