-- Run this once in Railway's PostgreSQL query editor

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(20) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cats (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(30) NOT NULL,
  date_of_birth DATE,
  neuter_status BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS weight_logs (
  id SERIAL PRIMARY KEY,
  cat_id INTEGER REFERENCES cats(id) ON DELETE CASCADE,
  weight_kg DECIMAL(5,2) NOT NULL,
  rib_circumference DECIMAL(5,2),
  leg_length DECIMAL(5,2),
  fbmi DECIMAL(5,2),
  logged_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS saved_foods (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  calories_per_100g DECIMAL(7,2) NOT NULL,
  barcode VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Pre-created test users (password is 'fitpaw123' for both)
INSERT INTO users (username, password_hash) VALUES
  ('testuser1', '$2b$10$rJ8QqO1Z5ZQwX8k5Y9mN8.vGxHj1234567890abcdefghijklmnop'),
  ('testuser2', '$2b$10$rJ8QqO1Z5ZQwX8k5Y9mN8.vGxHj1234567890abcdefghijklmnop')
ON CONFLICT DO NOTHING;
