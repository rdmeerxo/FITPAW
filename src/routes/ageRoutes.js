import { Router } from 'express';
import { ageConvert } from '../controllers/ageController.js';

const router = Router();
router.post('/convert', ageConvert);
export default router;
