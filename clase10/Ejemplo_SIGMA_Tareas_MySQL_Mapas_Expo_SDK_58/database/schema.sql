CREATE DATABASE IF NOT EXISTS sigma CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sigma;

CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('SUPERVISOR', 'TECHNICIAN') NOT NULL DEFAULT 'TECHNICIAN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NULL,
  status ENUM('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'CLOSED') NOT NULL DEFAULT 'OPEN',
  created_by INT UNSIGNED NOT NULL,
  assigned_to INT UNSIGNED NULL,
  latitude DECIMAL(10,7) NULL,
  longitude DECIMAL(10,7) NULL,
  location_accuracy DECIMAL(8,2) NULL COMMENT 'Precisión en metros',
  location_captured_at DATETIME NULL,
  location_address VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tasks_creator FOREIGN KEY (created_by) REFERENCES users(id),
  CONSTRAINT fk_tasks_assigned FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_tasks_status (status),
  INDEX idx_tasks_assigned (assigned_to),
  INDEX idx_tasks_coordinates (latitude, longitude)
);
