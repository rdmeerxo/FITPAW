import { Router } from 'express';
import { calorieCalculate } from '../controllers/calorieController.js';

const router = Router();
router.post('/calculate', calorieCalculate);
export default router;
