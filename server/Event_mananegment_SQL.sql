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



-- 1 Admin
INSERT INTO users (full_name, email, phone, role) VALUES
('Sarala and Avigayil', 'eventmanagement146@gmail.com', '0500000000', 'admin');

-- 5 CLIENTS
INSERT INTO users (full_name, email, phone, role) VALUES
('Alice Green', 'alice@example.com', '0501234567', 'client'),
('Ben Azulay', 'ben@example.com', '0502345678', 'client'),
('Chen Mizrahi', 'chen@example.com', '0503456789', 'client'),
('Dana Levi', 'dana@example.com', '0504567890', 'client'),
('Eyal Shamir', 'eyal@example.com', '0505678901', 'client');

-- 15 SUPPLIERS
INSERT INTO users (full_name, email, phone, role) VALUES
('Gal Cohen', 'gal@example.com', '0506789012', 'supplier'),
('Maya Levi', 'maya@example.com', '0507890123', 'supplier'),
('Ori Kaplan', 'ori@example.com', '0508901234', 'supplier'),
('Lior Ben David', 'lior@example.com', '0509012345', 'supplier'),
('Nina Peretz', 'nina@example.com', '0510123456', 'supplier'),
('Ronit Levy', 'ronit@example.com', '0511234567', 'supplier'),
('Gadi Hadad', 'gadi@example.com', '0512345678', 'supplier'),
('Tomer Gold', 'tomer@example.com', '0513456789', 'supplier'),
('Dikla Ezra', 'dikla@example.com', '0514567890', 'supplier'),
('Amit Cohen', 'amit@example.com', '0515678901', 'supplier'),
('David Mizrahi', 'david@example.com', '0516789012', 'supplier'),
('Oren Yair', 'oren@example.com', '0517890123', 'supplier'),
('Yael Levi', 'yael@example.com', '0518901234', 'supplier'),
('Noa Bar', 'noa@example.com', '0519012345', 'supplier'),
('Ziv Shalev', 'ziv@example.com', '0520123456', 'supplier');


INSERT INTO supplier_profiles (user_id, business_name, category, description, price_min, price_max, city) VALUES
(7, 'Gal Photography', 'Photographer', 'Captures special moments.', 1500, 3000, 'Tel Aviv'),
(8, 'Maya Lights', 'Lighting', 'Professional event lighting.', 2000, 4000, 'Haifa'),
(9, 'Ori Sounds', 'DJ', 'Top DJ for any event.', 2500, 4500, 'Jerusalem'),
(10, 'Lior Events', 'Lighting', 'Expert in venue lighting.', 2200, 3900, 'Netanya'),
(11, 'Nina Catering', 'Caterer', 'Delicious food for all events.', 1800, 4200, 'Holon'),
(12, 'Ronit Music', 'DJ', 'Feel the beat with Ronit.', 2600, 4600, 'Raanana'),
(13, 'Gadi Photos', 'Photographer', 'Memories in every shot.', 1700, 3100, 'Tel Aviv'),
(14, 'Tomer Audio', 'Sound Technician', 'Clear sound solutions.', 2300, 4300, 'Beer Sheva'),
(15, 'Dikla Flowers', 'Decorator', 'Beautiful floral arrangements.', 2100, 3700, 'Holon'),
(16, 'Amit Events', 'Planner', 'Plan your perfect day.', 3000, 5500, 'Tel Aviv'),
(17, 'David Studio', 'Photographer', 'Studio sessions and events.', 1900, 3400, 'Ramat Gan'),
(18, 'Oren Light & Sound', 'Lighting', 'Complete audio-visual service.', 2800, 4800, 'Petah Tikva'),
(19, 'Yael Cakes', 'Caterer', 'Cakes and sweets for events.', 1200, 2500, 'Rehovot'),
(20, 'Noa Moments', 'Photographer', 'Natural and artistic photos.', 1750, 3300, 'Herzliya'),
(21, 'Ziv Pro DJ', 'DJ', 'Professional DJing since 2010.', 2600, 4600, 'Hadera');

INSERT INTO events (id, name) VALUES
(1, 'Wedding'),
(2, 'Bar Mitzvah'),
(3, 'Corporate Event');

-- נשייך לספקים אחד או יותר מסוגי האירועים הקיימים:
-- Wedding = 1, Bar Mitzvah = 2, Corporate Event = 3

-- Wedding
INSERT INTO supplier_event_types (supplier_id, event_id)
SELECT id, 1 FROM supplier_profiles WHERE user_id IN (7, 9,  11, 12, 13, 17, 20, 21);

-- Bar Mitzvah
INSERT INTO supplier_event_types (supplier_id, event_id)
SELECT id, 2 FROM supplier_profiles WHERE user_id IN (11, 13, 19, 20);

-- Corporate Event
INSERT INTO supplier_event_types (supplier_id, event_id)
SELECT id, 3 FROM supplier_profiles WHERE user_id IN (8, 10, 14, 18, 21);

INSERT INTO passwords (user_id, password_hash)
SELECT id, '$2b$10$y8EY.gjH6hDZng2dqPEqle7lDc6NNBQqkMYMraH1X4BZ1Q8/kCn6C'
FROM users;
INSERT INTO supplier_categories (event_id, category) VALUES
(1, 'Photographer'), (1, 'DJ'), (1, 'Caterer'),
(2, 'Photographer'), (2, 'Caterer'),
(3, 'DJ'), (3, 'Lighting'), (3, 'Sound Technician'), (3, 'Decorator'), (3, 'Planner');