import { fetchFoodByBarcode } from '../services/foodService.js';

export async function getFoodByBarcode(req, res, next) {
	try {
		const { barcode } = req.params;
		const data = await fetchFoodByBarcode(barcode);
		res.json(data);
	} catch (err) {
		next(err);
	}
}
