-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 05-02-2025 a las 23:15:14
-- Versión del servidor: 8.3.0
-- Versión de PHP: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bon_photo`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(66, '3D Renders'),
(67, 'Animals'),
(68, 'Architecture & Interiors'),
(69, 'Archival'),
(70, 'Business & Work'),
(71, 'Current Events'),
(72, 'Deck the Halls'),
(73, 'Experimental'),
(74, 'Fashion & Beauty'),
(75, 'Festive Food & Drink'),
(76, 'Film'),
(77, 'Food & Drink'),
(78, 'Health & Wellness'),
(79, 'Holiday Cheers'),
(80, 'Holiday Patterns'),
(81, 'Merry & Bright'),
(82, 'Nature'),
(83, 'People'),
(84, 'Spirituality'),
(85, 'Sports'),
(86, 'Street Photography'),
(87, 'Table Spreads'),
(88, 'Textures & Patterns'),
(89, 'Through the Window'),
(90, 'Timeless Tradition'),
(91, 'Travel'),
(92, 'Wallpapers'),
(93, 'Winter Blues'),
(94, 'Winter Whiteout'),
(95, 'Winter Wonderland');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comments`
--

DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint NOT NULL COMMENT 'Boolean-like status field',
  `user_id` int NOT NULL,
  `photo_id` int NOT NULL,
  `parent_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `photo_id` (`photo_id`),
  KEY `fk_comments_parent` (`parent_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `likes`
--

DROP TABLE IF EXISTS `likes`;
CREATE TABLE IF NOT EXISTS `likes` (
  `date` datetime DEFAULT NULL,
  `users_id` int DEFAULT NULL,
  `photos_id` int DEFAULT NULL,
  UNIQUE KEY `users_id` (`users_id`,`photos_id`),
  KEY `user_id` (`users_id`),
  KEY `photo_id` (`photos_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `likes`
--

INSERT INTO `likes` (`date`, `users_id`, `photos_id`) VALUES
('2025-01-28 13:37:18', 60, 26);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `photos`
--

DROP TABLE IF EXISTS `photos`;
CREATE TABLE IF NOT EXISTS `photos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text COMMENT 'Photo description for details',
  `photo_url` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `alt` varchar(255) DEFAULT NULL COMMENT 'Alternative text for accessibility',
  `upload_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint NOT NULL COMMENT 'Boolean-like status field',
  `users_id` int DEFAULT NULL,
  `categories_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`users_id`),
  KEY `category_id` (`categories_id`)
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `photos`
--

INSERT INTO `photos` (`id`, `title`, `description`, `photo_url`, `alt`, `upload_date`, `status`, `users_id`, `categories_id`) VALUES
(1, 'Hong Kong Street View', 'Hong Kong Street View - Sun Hung', '/uploads/john.smith/full/hong_kong_street_view.jpeg', 'A view of a courtyard from a high building', '2025-01-06 19:26:48', 1, 49, 66),
(2, 'Power of Light', 'The power of light', '/uploads/emma.white/full/power_of_light.jpeg', 'A man standing in a dark room pointing at something', '2025-01-05 19:26:48', 1, 50, 67),
(3, 'Abstract Blue', 'Abstract composition in blue tones', '/uploads/carlos.rodriguez/full/abstract_blue.jpeg', 'A blurry photo of a black and blue background', '2025-01-04 19:26:48', 1, 51, 68),
(4, '35mm Soaked Film', '35mm soaked film', '/uploads/sophie.dubois/full/35mm_soaked_film.jpeg', 'A woman taking a picture of herself with a camera', '2025-01-03 19:26:48', 1, 52, 69),
(5, 'Milky Way Switzerland', 'Milky Way Switzerland', '/uploads/marco.rossi/full/milky_way_switzerland.jpeg', 'The night sky over a snowy mountain range', '2025-01-02 19:26:48', 1, 53, 70),
(6, 'Beauty Essentials', 'Beauty', '/uploads/john.smith/full/beauty_essentials.jpeg', 'The contents of a white purse', '2025-01-01 19:26:48', 1, 49, 71),
(7, 'Abstract Art', 'Colorful abstract composition', '/uploads/emma.white/full/abstract_art.jpeg', 'A colorful object is shown on a white background', '2024-12-31 19:26:48', 1, 50, 72),
(8, 'Red Door', 'Architectural detail', '/uploads/carlos.rodriguez/full/red_door.jpeg', 'A red brick building with a green door', '2024-12-30 19:26:48', 1, 51, 73),
(9, 'White Bird', 'Majestic white bird in nature', '/uploads/sophie.dubois/full/white_bird.jpeg', 'A large white bird with a long beak', '2024-12-29 19:26:48', 1, 52, 74),
(10, 'Beach Umbrella', 'Yellow umbrella on sandy beach', '/uploads/marco.rossi/full/beach_umbrella.jpeg', 'A yellow umbrella sitting on top of a sandy beach', '2024-12-28 19:26:48', 1, 53, 75),
(11, 'Aerial Formation', 'Group of airplanes in formation', '/uploads/john.smith/full/aerial_formation.jpeg', 'A group of airplanes flying through a blue sky', '2024-12-27 19:26:48', 1, 49, 76),
(12, 'Winter Forest', 'Beautiful sunny weather on a winter day', '/uploads/emma.white/full/winter_forest.jpeg', 'A person standing on a snow covered hill', '2024-12-26 19:26:48', 1, 50, 77),
(13, 'City Skyline', 'Like what you see? Follow me @thatcameraguymc', '/uploads/carlos.rodriguez/full/city_skyline.jpeg', 'Two people sitting on a bench in front of a city skyline', '2024-12-25 19:26:48', 1, 51, 78),
(14, 'Urban Walker', 'Fujifilm Superia Premium 400, Minolta TC-1', '/uploads/sophie.dubois/full/urban_walker.jpeg', 'A man walking down a street next to tall buildings', '2024-12-24 19:26:48', 1, 52, 79),
(15, 'Mountain Hikers', 'Group hiking adventure', '/uploads/marco.rossi/full/mountain_hikers.jpeg', 'A group of people hiking up a hill', '2024-12-23 19:26:48', 1, 53, 80),
(16, 'Mirissa Sunset', 'Mirissa beach at sunset', '/uploads/john.smith/full/mirissa_sunset.jpeg', 'An aerial view of a beach and ocean', '2024-12-22 19:26:48', 1, 49, 81),
(17, 'Ocean Waves', 'Aesthetic green blue wallpaper', '/uploads/emma.white/full/ocean_waves.jpeg', 'A blue object with a wavy design on it', '2024-12-21 19:26:48', 1, 50, 82),
(18, 'Rocky Coast', 'Mirissa beach at sunset', '/uploads/carlos.rodriguez/full/rocky_coast.jpeg', 'An aerial view of the ocean with rocks in the water', '2024-12-20 19:26:48', 1, 51, 83),
(19, 'Black Sand Beach', 'Waves', '/uploads/sophie.dubois/full/black_sand_beach.jpeg', 'An aerial view of a black sand beach', '2024-12-19 19:26:48', 1, 52, 84),
(20, 'Street Photography', 'Asian couple doing a photoshoot', '/uploads/marco.rossi/full/street_photography.jpeg', 'A man and a woman walking down a street', '2024-12-18 19:26:48', 1, 53, 85),
(21, 'Forest Dreams', 'Dreamy forest landscape', '/uploads/john.smith/full/forest_dreams.jpeg', 'A blurry photo of a forest with red flowers', '2024-12-17 19:26:48', 1, 49, 86),
(22, 'Dried Flowers', 'Still life with dried flowers', '/uploads/emma.white/full/dried_flowers.jpeg', 'A collection of dried flowers on a white surface', '2024-12-16 19:26:48', 1, 50, 87),
(23, 'Paper Art', '3d render', '/uploads/carlos.rodriguez/full/paper_art.jpeg', 'A computer generated image of white paper', '2024-12-15 19:26:48', 1, 51, 88),
(24, 'Mt Baker Sunset', 'Stunning view of Mt. Baker at sunset', '/uploads/sophie.dubois/full/mt_baker_sunset.jpeg', 'A view of a mountain covered in clouds', '2024-12-14 19:26:48', 1, 52, 89),
(25, 'Lavender Fields', 'Lavender field at sunset', '/uploads/marco.rossi/full/lavender_fields.jpeg', 'A field of lavender flowers with a sunset in the background', '2024-12-13 19:26:48', 1, 53, 90),
(26, 'White Dome', 'Dome', '/uploads/john.smith/full/white_dome.jpeg', 'A tall white building with a sky background', '2024-12-12 19:26:48', 1, 49, 91),
(27, 'Abstract Purple', 'Abstract background for your project', '/uploads/emma.white/full/abstract_purple.jpeg', 'A purple and blue abstract design on a white background', '2024-12-11 19:26:48', 1, 50, 92),
(28, 'Purple Bloom', '8k 3d render', '/uploads/carlos.rodriguez/full/purple_bloom.jpeg', 'A blurry image of a flower on a purple background', '2024-12-10 19:26:48', 1, 51, 93),
(29, 'Snow Mountains', 'Winter mountain landscape', '/uploads/sophie.dubois/full/snow_mountains.jpeg', 'A snow covered field with mountains in the background', '2024-12-09 19:26:48', 1, 52, 94),
(30, 'Purple Car', 'Group photo with vintage car', '/uploads/marco.rossi/full/purple_car.jpeg', 'A group of people standing around a purple car', '2024-12-08 19:26:48', 1, 53, 95),
(84, 'Turtle', 'A giant  turtle in a foggy world', '/uploads/john.doe/full/turtle_1737295165813.jpg', 'giant  turtle in a foggy world', '2025-01-19 13:59:25', 1, 60, 84),
(85, 'Home123', 'updated home picture with camera ', '/uploads/nikky.home/full/home123_1737295511646.jpg', 'family house ', '2025-01-19 14:05:11', 1, 62, 86),
(87, 'Intergace', 'A design proposal for an app', '/uploads/jean.rake/full/intergace_1737313741662.jpg', 'A nice interface design', '2025-01-19 19:09:01', 1, 61, 74),
(89, 'Head', 'A man standing in front of a huge animal skull in the dark', '/uploads/john.doe/full/head_1737371176113.jpg', 'A man and a head', '2025-01-20 11:06:16', 1, 60, 84),
(91, 'Bed', 'A wooden bed', '/uploads/john.doe/full/bed_1738074228784.jpg', 'A bed made out of wood', '2025-01-28 14:23:48', 1, 60, 68);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` tinyint NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(0, 'Admin'),
(1, 'Photographer'),
(2, 'User');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL COMMENT 'User display name',
  `email` varchar(100) NOT NULL,
  `password` char(60) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `role_id` tinyint DEFAULT NULL,
  `is_photographer` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`, `role_id`, `is_photographer`) VALUES
(49, 'john_smith', 'john.smith@email.com', '$2b$12$q6LqtcZOxZDpI/5aB5ey8uQh1PumsT5bOI2FhQLpueiaL2rndZmta', '2025-01-07 20:26:48', 1, 1),
(50, 'emma_white', 'emma.white@email.com', '$2b$12$q6LqtcZOxZDpI/5aB5ey8uQh1PumsT5bOI2FhQLpueiaL2rndZmta', '2025-01-07 20:26:48', 1, 1),
(51, 'carlos_rodriguez', 'carlos.r@email.com', '$2b$12$q6LqtcZOxZDpI/5aB5ey8uQh1PumsT5bOI2FhQLpueiaL2rndZmta', '2025-01-07 20:26:48', 1, 1),
(52, 'sophie_dubois', 'sophie.d@email.com', '$2b$12$q6LqtcZOxZDpI/5aB5ey8uQh1PumsT5bOI2FhQLpueiaL2rndZmta', '2025-01-07 20:26:48', 1, 1),
(53, 'marco_rossi', 'marco.rossi@email.com', '$2b$12$q6LqtcZOxZDpI/5aB5ey8uQh1PumsT5bOI2FhQLpueiaL2rndZmta', '2025-01-07 20:26:48', 1, 1),
(60, 'JohnDoe123', 'john.doe@example.com', '$2b$10$zPttjr1J8etnVaufUzbv1OCFjIS2zSqyxWugBr3lfWG9ZOnv8iYty', '2025-01-18 15:22:29', 1, 0),
(61, 'Jean123', 'jean.rake@example.com', '$2b$10$Rpkdl8oNiNpQOdELeexhi.x3oowRvc9ia984qRAZCqTuRjwQFtuG.', '2025-01-18 16:51:21', 1, 0),
(62, 'Nikky123', 'nikky.home@example.com', '$2b$10$8kcBwiwF.BQseONWLbr6COq1eAOrkGYTYkCyXst1V6doNHAs8m97y', '2025-01-19 15:03:39', 1, 0),
(66, 'new_user', 'new.user@example.com', '$2b$10$bv74cx7ZXZ8v4n5VHt7y4e6OfpKBOJnDg.bww7ECL2j62MLqRGaAm', '2025-01-28 00:15:46', 1, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_details`
--

DROP TABLE IF EXISTS `user_details`;
CREATE TABLE IF NOT EXISTS `user_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `users_id` int DEFAULT NULL,
  `location` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`users_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `user_details`
--

INSERT INTO `user_details` (`id`, `users_id`, `location`) VALUES
(11, 49, 'New York, USA'),
(12, 50, 'London, UK'),
(13, 51, 'Barcelona, Spain'),
(14, 52, 'Paris, France'),
(15, 53, 'Rome, Italy');

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `fk_comments_parent` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `photo_comments` FOREIGN KEY (`photo_id`) REFERENCES `photos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_comments` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `Fk_likes_users` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_photos` FOREIGN KEY (`photos_id`) REFERENCES `photos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `photos`
--
ALTER TABLE `photos`
  ADD CONSTRAINT `photo_categories` FOREIGN KEY (`categories_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  ADD CONSTRAINT `users_photos` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_user_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  ADD CONSTRAINT `roles` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Filtros para la tabla `user_details`
--
ALTER TABLE `user_details`
  ADD CONSTRAINT `Fk_user_details_users` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
