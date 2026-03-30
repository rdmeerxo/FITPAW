import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getLogs, addLog, deleteLog } from '../controllers/logsController.js';

const router = Router({ mergeParams: true }); // needed to access :catId from parent

router.use(authMiddleware);

router.get('/', getLogs);
router.post('/', addLog);
router.delete('/:logId', deleteLog);

export default router;
