import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getSavedFoods, addSavedFood, deleteSavedFood } from '../controllers/savedFoodsController.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getSavedFoods);
router.post('/', addSavedFood);
router.delete('/:id', deleteSavedFood);

export default router;
