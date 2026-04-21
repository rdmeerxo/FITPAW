import { authMiddleware } from './authMiddleware.js';

const ADMIN_USERNAME = 'erdemtugsadmin'; 

export function adminMiddleware(req, res, next) {
  // first verify JWT
  authMiddleware(req, res, () => {
    if (req.user?.username !== ADMIN_USERNAME) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }
    next();
  });
}
