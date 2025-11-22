import { Router } from 'express';
import { bmiCalculate } from '../controllers/bmiController.js';

const router = Router();
router.post('/calculate', bmiCalculate);
export default router;
