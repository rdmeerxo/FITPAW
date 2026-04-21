import { Router } from 'express';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import pool from '../db/database.js';

const router = Router();

router.use(adminMiddleware);

// GET /api/admin/stats — overall stats
router.get('/stats', async (req, res, next) => {
  try {
    const [usersResult, catsResult, logsResult] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query('SELECT COUNT(*) FROM cats'),
      pool.query('SELECT COUNT(*) FROM weight_logs'),
    ]);

    res.json({
      totalUsers: parseInt(usersResult.rows[0].count),
      totalCats: parseInt(catsResult.rows[0].count),
      totalWeightLogs: parseInt(logsResult.rows[0].count),
    });
  } catch (err) { next(err); }
});

// GET /api/admin/users — user list with cats and avg weight
router.get('/users', async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.username,
        u.created_at,
        COUNT(DISTINCT c.id) AS cat_count,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT('name', c.name, 'avg_weight', 
              ROUND(CAST((
                SELECT AVG(wl.weight_kg) FROM weight_logs wl WHERE wl.cat_id = c.id
              ) AS NUMERIC), 2)
            )
          ) FILTER (WHERE c.id IS NOT NULL), '[]'
        ) AS cats
      FROM users u
      LEFT JOIN cats c ON c.user_id = u.id
      GROUP BY u.id, u.username, u.created_at
      ORDER BY u.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) { next(err); }
});

export default router;
