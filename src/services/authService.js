import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db/database.js';

export async function registerUser(username, password) {
  // Check username already exists
  const existing = await pool.query(
    'SELECT id FROM users WHERE username = $1', [username]
  );
  if (existing.rows.length > 0) {
    const err = new Error('Username already taken');
    err.status = 409;
    throw err;
  }

  const password_hash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at',
    [username, password_hash]
  );
  const user = result.rows[0];
  const token = generateToken(user);
  return { user, token };
}

export async function loginUser(username, password) {
  const result = await pool.query(
    'SELECT * FROM users WHERE username = $1', [username]
  );
  const user = result.rows[0];

  if (!user) {
    const err = new Error('Invalid username or password');
    err.status = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    const err = new Error('Invalid username or password');
    err.status = 401;
    throw err;
  }

  const token = generateToken(user);
  return { user: { id: user.id, username: user.username }, token };
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}
