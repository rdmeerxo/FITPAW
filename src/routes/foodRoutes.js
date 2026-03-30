import { Router } from 'express';
import { getFoodByBarcode } from '../controllers/foodController.js';
import { validateFoodBarcode } from '../validators/foodValidator.js';

const router = Router();

router.get('/lookup/:barcode', validateFoodBarcode, getFoodByBarcode);

export default router;
