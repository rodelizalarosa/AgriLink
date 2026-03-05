-- AgriLink Fresh Database Setup
-- This script will recreate the database with the correct schema for the current application.

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Drop existing tables to start fresh (in reverse order of dependencies)
DROP TABLE IF EXISTS phenotyping_results;
DROP TABLE IF EXISTS purchase_table;
DROP TABLE IF EXISTS product_table;
DROP TABLE IF EXISTS product_category;
DROP TABLE IF EXISTS users_table;
DROP TABLE IF EXISTS auth_table;
DROP TABLE IF EXISTS role_table;

-- 1. Role Table
CREATE TABLE role_table (
  id int(11) NOT NULL AUTO_INCREMENT,
  role_name varchar(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY role_name (role_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO role_table (id, role_name) VALUES
(1, 'buyer'),
(2, 'farmer'),
(3, 'brgy_official'),
(4, 'admin');

-- 2. Auth Table
CREATE TABLE auth_table (
  id int(11) NOT NULL AUTO_INCREMENT,
  email varchar(255) NOT NULL,
  password_hash varchar(255) NOT NULL,
  role_id int(11) NOT NULL,
  is_verified tinyint(1) DEFAULT 0,
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (id),
  UNIQUE KEY email (email),
  KEY role_id (role_id),
  CONSTRAINT auth_table_ibfk_1 FOREIGN KEY (role_id) REFERENCES role_table (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 3. Users Table
CREATE TABLE users_table (
  id int(11) NOT NULL AUTO_INCREMENT,
  auth_id int(11) NOT NULL,
  first_name varchar(100) NOT NULL,
  last_name varchar(100) NOT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id),
  KEY auth_id (auth_id),
  CONSTRAINT users_table_ibfk_1 FOREIGN KEY (auth_id) REFERENCES auth_table (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 4. Product Category Table
CREATE TABLE product_category (
  cat_id int(11) NOT NULL AUTO_INCREMENT,
  cat_name varchar(255) NOT NULL,
  PRIMARY KEY (cat_id),
  UNIQUE KEY cat_name (cat_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO product_category (cat_id, cat_name) VALUES
(1, 'Vegetables'),
(2, 'Fruits'),
(3, 'Grains'),
(4, 'Root Crops'),
(5, 'Others');

-- 5. Product Table
CREATE TABLE product_table (
  p_id int(11) NOT NULL AUTO_INCREMENT,
  u_id int(11) NOT NULL,
  p_name varchar(255) NOT NULL,
  p_description text DEFAULT NULL,
  p_price decimal(10,2) NOT NULL,
  p_unit varchar(50) NOT NULL,
  p_quantity decimal(10,2) NOT NULL,
  p_category int(11) NOT NULL,
  p_image varchar(255) DEFAULT NULL,
  p_status enum('active','archived') DEFAULT 'active',
  harvest_date date DEFAULT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (p_id),
  KEY p_category (p_category),
  KEY u_id (u_id),
  CONSTRAINT product_table_ibfk_1 FOREIGN KEY (u_id) REFERENCES users_table (id) ON DELETE CASCADE,
  CONSTRAINT product_table_ibfk_2 FOREIGN KEY (p_category) REFERENCES product_category (cat_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 6. Purchase Table (Orders)
CREATE TABLE purchase_table (
  req_id int(11) NOT NULL AUTO_INCREMENT,
  buyer_id int(11) NOT NULL,
  product_id int(11) NOT NULL,
  quantity decimal(10,2) NOT NULL,
  req_status enum('Pending','Confirmed','Completed','Cancelled') DEFAULT 'Pending',
  req_date timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (req_id),
  KEY buyer_id (buyer_id),
  KEY product_id (product_id),
  CONSTRAINT purchase_table_ibfk_1 FOREIGN KEY (buyer_id) REFERENCES users_table (id) ON DELETE CASCADE,
  CONSTRAINT purchase_table_ibfk_2 FOREIGN KEY (product_id) REFERENCES product_table (p_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 7. Phenotyping Results Table
CREATE TABLE phenotyping_results (
  result_id int(11) NOT NULL AUTO_INCREMENT,
  product_id int(11) NOT NULL,
  result_date timestamp NOT NULL DEFAULT current_timestamp(),
  variety varchar(255) DEFAULT NULL,
  health_score decimal(5,2) DEFAULT NULL,
  predicted_yield decimal(10,2) DEFAULT NULL,
  status varchar(100) DEFAULT NULL,
  PRIMARY KEY (result_id),
  KEY product_id (product_id),
  CONSTRAINT phenotyping_results_ibfk_1 FOREIGN KEY (product_id) REFERENCES product_table (p_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;
