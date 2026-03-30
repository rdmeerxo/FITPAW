import { validateCalorie } from '../validators/calorieValidator.js';
import { calculateCalories } from '../services/calorieService.js';

export function calorieCalculate(req, res, next) {
	try {
		const errors = validateCalorie(req.body);
		if (errors.length)
			return res
				.status(400)
				.json({ error: { message: 'Validation failed', details: errors } });
		const { weightKg, neutered, age, goal } = req.body;
		const result = calculateCalories(weightKg, neutered, age, goal);
		res.json(result);
	} catch (err) {
		next(err);
	}
}
