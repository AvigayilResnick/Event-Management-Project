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
   price_min INT,
   price_max INT,
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

CREATE TABLE role_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  requested_role ENUM('supplier', 'admin') NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


INSERT INTO users (full_name, email, phone, role)
VALUES 
('Gal Cohen', 'gal.cohen@example.com', '0501111111', 'supplier'),
('Maya Levi', 'maya.levi@example.com', '0502222222', 'supplier'),
('Ori Kaplan', 'ori.kaplan@example.com', '0503333333', 'supplier');

INSERT INTO passwords (user_id, password_hash)
VALUES
(1, '$2b$10$y8EY.gjH6hDZng2dqPEqle7lDc6NNBQqkMYMraH1X4BZ1Q8/kCn6C'), -- password123
(2, '$2b$10$y8EY.gjH6hDZng2dqPEqle7lDc6NNBQqkMYMraH1X4BZ1Q8/kCn6C'),
(3, '$2b$10$y8EY.gjH6hDZng2dqPEqle7lDc6NNBQqkMYMraH1X4BZ1Q8/kCn6C');

INSERT INTO supplier_profiles (user_id, business_name, category, description, price_range, city)
VALUES
(1, 'Gal Photography', 'Photographer', 'Experienced wedding photographer', '$2000-$5000', 'Tel Aviv'),
(2, 'Maya Catering', 'Caterer', 'Delicious kosher catering', '$5000-$15000', 'Jerusalem'),
(3, 'Ori DJ Services', 'DJ', 'Professional DJ for events', '$1000-$3000', 'Haifa');

INSERT INTO events (name)
VALUES ('Wedding'), ('Bar Mitzvah'), ('Corporate Event');
INSERT INTO supplier_event_types (supplier_id, event_id)
VALUES
(1, 1), -- Gal Photography - Wedding
(2, 1), -- Maya Catering - Wedding
(2, 2), -- Maya Catering - Bar Mitzvah
(3, 1), -- Ori DJ - Wedding
(3, 3); -- Ori DJ - Corporate Event

