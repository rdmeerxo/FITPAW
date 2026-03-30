import pool from '../db/database.js';

export async function getLogsByCat(catId) {
  const result = await pool.query(
    'SELECT * FROM weight_logs WHERE cat_id = $1 ORDER BY logged_at DESC',
    [catId]
  );
  return result.rows;
}

export async function addLog(catId, { weight_kg, rib_circumference, leg_length, fbmi }) {
  const result = await pool.query(
    `INSERT INTO weight_logs (cat_id, weight_kg, rib_circumference, leg_length, fbmi)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [catId, weight_kg, rib_circumference || null, leg_length || null, fbmi || null]
  );
  return result.rows[0];
}

export async function deleteLog(logId) {
  await pool.query('DELETE FROM weight_logs WHERE id = $1', [logId]);
}
