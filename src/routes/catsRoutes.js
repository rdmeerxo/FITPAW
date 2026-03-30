import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getCats, getCat, createCat, updateCat, deleteCat } from '../controllers/catsController.js';

const router = Router();

router.use(authMiddleware); // all cat routes require login

router.get('/', getCats);
router.get('/:id', getCat);
router.post('/', createCat);
router.put('/:id', updateCat);
router.delete('/:id', deleteCat);

export default router;
