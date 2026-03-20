-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 20, 2026 at 06:01 AM
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
-- Database: `agrilink_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `auth_table`
--

CREATE TABLE `auth_table` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role_id` int(11) NOT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auth_table`
--

INSERT INTO `auth_table` (`id`, `email`, `password_hash`, `role_id`, `is_verified`, `created_at`, `updated_at`) VALUES
(1, 'tapalesrasheed123@gmail.com', '$2b$10$kKFplTLmXRwWPc4oupflcubUzMzP39m4oTSognmokOc4aq263yqou', 2, 1, '2026-03-04 04:21:37', '2026-03-04 04:22:51'),
(2, 'tapalesrasheed123+1@gmail.com', '$2b$10$3DIGpxbJ3SKTriZBoRedpeeV.ow9R2tIaImwjvmCKHL30GxRR1a7.', 2, 1, '2026-03-20 04:05:16', '2026-03-20 04:08:57'),
(3, 'tapalesrasheed123+2@gmail.com', '$2b$10$Prwu4zRdUKtNpsj2Q311uOqcjyxnXGv8UaTIT2vgH9AmyJSDQL.QW', 1, 1, '2026-03-20 04:33:06', '2026-03-20 04:33:27');

-- --------------------------------------------------------

--
-- Table structure for table `phenotyping_results`
--

CREATE TABLE `phenotyping_results` (
  `result_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `result_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `variety` varchar(255) DEFAULT NULL,
  `health_score` decimal(5,2) DEFAULT NULL,
  `predicted_yield` decimal(10,2) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_category`
--

CREATE TABLE `product_category` (
  `cat_id` int(11) NOT NULL,
  `cat_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_category`
--

INSERT INTO `product_category` (`cat_id`, `cat_name`) VALUES
(2, 'Fruits'),
(3, 'Grains'),
(5, 'Others'),
(4, 'Root Crops'),
(1, 'Vegetables');

-- --------------------------------------------------------

--
-- Table structure for table `product_table`
--

CREATE TABLE `product_table` (
  `p_id` int(11) NOT NULL,
  `u_id` int(11) NOT NULL,
  `p_name` varchar(255) NOT NULL,
  `p_description` text DEFAULT NULL,
  `p_price` decimal(10,2) NOT NULL,
  `p_unit` varchar(50) NOT NULL,
  `p_quantity` decimal(10,2) NOT NULL,
  `p_category` int(11) NOT NULL,
  `p_image` varchar(255) DEFAULT NULL,
  `p_status` enum('active','archived') DEFAULT 'active',
  `harvest_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_table`
--

INSERT INTO `product_table` (`p_id`, `u_id`, `p_name`, `p_description`, `p_price`, `p_unit`, `p_quantity`, `p_category`, `p_image`, `p_status`, `harvest_date`, `created_at`, `updated_at`) VALUES
(9, 2, 'Kamote', '', 80.00, 'kg', 5.00, 4, '/uploads/p_image-1773980690364-208825774.jpg', 'active', '2026-03-31', '2026-03-20 04:24:50', '2026-03-20 04:24:50'),
(10, 2, 'Sili', '', 60.00, 'kg', 20.00, 1, '/uploads/p_image-1773980810823-691826969.webp', 'active', '2026-03-25', '2026-03-20 04:26:50', '2026-03-20 04:26:50'),
(11, 2, 'Ampalaya', '', 80.00, 'kg', 14.00, 1, '/uploads/p_image-1773980866036-466744536.webp', 'active', '2026-03-23', '2026-03-20 04:27:46', '2026-03-20 04:27:46'),
(12, 2, 'Carrots', '', 250.00, 'sack', 30.00, 1, '/uploads/p_image-1773981059431-123479468.webp', 'active', '2026-03-31', '2026-03-20 04:30:59', '2026-03-20 04:30:59'),
(13, 2, 'Patatas', '', 90.00, 'kg', 7.00, 1, '/uploads/p_image-1773981101330-398813016.webp', 'active', '2026-03-31', '2026-03-20 04:31:41', '2026-03-20 04:31:41');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_table`
--

CREATE TABLE `purchase_table` (
  `req_id` int(11) NOT NULL,
  `buyer_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `req_status` enum('Pending','Confirmed','Completed','Cancelled') DEFAULT 'Pending',
  `req_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role_table`
--

CREATE TABLE `role_table` (
  `id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role_table`
--

INSERT INTO `role_table` (`id`, `role_name`) VALUES
(4, 'admin'),
(3, 'brgy_official'),
(1, 'buyer'),
(2, 'farmer');

-- --------------------------------------------------------

--
-- Table structure for table `users_table`
--

CREATE TABLE `users_table` (
  `id` int(11) NOT NULL,
  `auth_id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users_table`
--

INSERT INTO `users_table` (`id`, `auth_id`, `first_name`, `last_name`, `created_at`) VALUES
(1, 1, 'Rasheed', 'Culpa necessitatibus', '2026-03-04 04:21:37'),
(2, 2, 'John', 'Doeka', '2026-03-20 04:05:16'),
(3, 3, 'John', 'Ni', '2026-03-20 04:33:06');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auth_table`
--
ALTER TABLE `auth_table`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `phenotyping_results`
--
ALTER TABLE `phenotyping_results`
  ADD PRIMARY KEY (`result_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `product_category`
--
ALTER TABLE `product_category`
  ADD PRIMARY KEY (`cat_id`),
  ADD UNIQUE KEY `cat_name` (`cat_name`);

--
-- Indexes for table `product_table`
--
ALTER TABLE `product_table`
  ADD PRIMARY KEY (`p_id`),
  ADD KEY `p_category` (`p_category`),
  ADD KEY `u_id` (`u_id`);

--
-- Indexes for table `purchase_table`
--
ALTER TABLE `purchase_table`
  ADD PRIMARY KEY (`req_id`),
  ADD KEY `buyer_id` (`buyer_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `role_table`
--
ALTER TABLE `role_table`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- Indexes for table `users_table`
--
ALTER TABLE `users_table`
  ADD PRIMARY KEY (`id`),
  ADD KEY `auth_id` (`auth_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `auth_table`
--
ALTER TABLE `auth_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `phenotyping_results`
--
ALTER TABLE `phenotyping_results`
  MODIFY `result_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_category`
--
ALTER TABLE `product_category`
  MODIFY `cat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `product_table`
--
ALTER TABLE `product_table`
  MODIFY `p_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `purchase_table`
--
ALTER TABLE `purchase_table`
  MODIFY `req_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `role_table`
--
ALTER TABLE `role_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users_table`
--
ALTER TABLE `users_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `auth_table`
--
ALTER TABLE `auth_table`
  ADD CONSTRAINT `auth_table_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role_table` (`id`);

--
-- Constraints for table `phenotyping_results`
--
ALTER TABLE `phenotyping_results`
  ADD CONSTRAINT `phenotyping_results_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product_table` (`p_id`) ON DELETE CASCADE;

--
-- Constraints for table `product_table`
--
ALTER TABLE `product_table`
  ADD CONSTRAINT `product_table_ibfk_1` FOREIGN KEY (`u_id`) REFERENCES `users_table` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_table_ibfk_2` FOREIGN KEY (`p_category`) REFERENCES `product_category` (`cat_id`);

--
-- Constraints for table `purchase_table`
--
ALTER TABLE `purchase_table`
  ADD CONSTRAINT `purchase_table_ibfk_1` FOREIGN KEY (`buyer_id`) REFERENCES `users_table` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchase_table_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product_table` (`p_id`) ON DELETE CASCADE;

--
-- Constraints for table `users_table`
--
ALTER TABLE `users_table`
  ADD CONSTRAINT `users_table_ibfk_1` FOREIGN KEY (`auth_id`) REFERENCES `auth_table` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
