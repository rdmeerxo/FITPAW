import pool from '../db/database.js';

export async function getSavedFoods(userId) {
  const result = await pool.query(
    'SELECT * FROM saved_foods WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
}

export async function addSavedFood(userId, { name, calories_per_100g, barcode }) {
  if (!name || !calories_per_100g) {
    const err = new Error('Food name and calories are required');
    err.status = 400;
    throw err;
  }
  // check duplicate
  const existing = await pool.query(
    'SELECT id FROM saved_foods WHERE user_id = $1 AND name = $2',
    [userId, name]
  );
  if (existing.rows.length > 0) {
    const err = new Error('Food already saved');
    err.status = 409;
    throw err;
  }
  const result = await pool.query(
    'INSERT INTO saved_foods (user_id, name, calories_per_100g, barcode) VALUES ($1, $2, $3, $4) RETURNING *',
    [userId, name, calories_per_100g, barcode || null]
  );
  return result.rows[0];
}

export async function deleteSavedFood(foodId, userId) {
  await pool.query(
    'DELETE FROM saved_foods WHERE id = $1 AND user_id = $2',
    [foodId, userId]
  );
}
