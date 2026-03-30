import pool from '../db/database.js';

export async function getCatsByUser(userId) {
  const result = await pool.query(
    'SELECT * FROM cats WHERE user_id = $1 ORDER BY created_at ASC',
    [userId]
  );
  return result.rows;
}

export async function getCatById(catId, userId) {
  const result = await pool.query(
    'SELECT * FROM cats WHERE id = $1 AND user_id = $2',
    [catId, userId]
  );
  return result.rows[0] || null;
}

export async function createCat(userId, { name, date_of_birth, neuter_status }) {
  if (!name || name.length > 30) {
    const err = new Error('Cat name is required and must be under 30 characters');
    err.status = 400;
    throw err;
  }
  const result = await pool.query(
    'INSERT INTO cats (user_id, name, date_of_birth, neuter_status) VALUES ($1, $2, $3, $4) RETURNING *',
    [userId, name, date_of_birth || null, neuter_status || false]
  );
  return result.rows[0];
}

export async function updateCat(catId, userId, fields) {
  const { name, date_of_birth, neuter_status } = fields;
  const result = await pool.query(
    `UPDATE cats SET
      name = COALESCE($1, name),
      date_of_birth = COALESCE($2, date_of_birth),
      neuter_status = COALESCE($3, neuter_status)
     WHERE id = $4 AND user_id = $5 RETURNING *`,
    [name, date_of_birth, neuter_status, catId, userId]
  );
  return result.rows[0] || null;
}

export async function deleteCat(catId, userId) {
  await pool.query(
    'DELETE FROM cats WHERE id = $1 AND user_id = $2',
    [catId, userId]
  );
}
