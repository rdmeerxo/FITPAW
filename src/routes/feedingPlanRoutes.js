import { Router } from 'express';
import { feedingPlanCalculate } from '../controllers/feedingPlanController.js';

const router = Router();

router.post('/calculate', feedingPlanCalculate);

export default router;