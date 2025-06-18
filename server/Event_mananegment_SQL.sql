-- Create the database
CREATE DATABASE IF NOT EXISTS event_manager;
USE event_manager;

-- Users table (clients, suppliers, admins)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),
  role ENUM('client', 'supplier', 'admin') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Passwords table (separated for security)
CREATE TABLE passwords (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Supplier profiles table (details shown on supplier page)
CREATE TABLE supplier_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  business_name VARCHAR(100),
  category VARCHAR(50),
  description TEXT,
  price_min INT NULL,       -- מחיר מינימום (מספר)
  price_max INT NULL,       -- מחיר מקסימום (מספר)
  city VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Event types table (e.g. Wedding, Bar Mitzvah, etc.)
CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- Supplier categories per event type (e.g. Photographer for Wedding)
CREATE TABLE supplier_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  category VARCHAR(100) NOT NULL,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Relation: suppliers to event types (many-to-many)
CREATE TABLE supplier_event_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  supplier_id INT NOT NULL,
  event_id INT NOT NULL,
  FOREIGN KEY (supplier_id) REFERENCES supplier_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Messages table (used for contact or live chat)
CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  from_user_id INT NOT NULL,
  to_user_id INT NOT NULL,
  message_text TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  email_sent BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Images uploaded by suppliers
CREATE TABLE images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  supplier_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  FOREIGN KEY (supplier_id) REFERENCES supplier_profiles(id) ON DELETE CASCADE
);