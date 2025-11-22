import { validateFeedingPlan} from '../validators/feedingPlanValidator.js';
import { fetchFoodByBarcode } from '../services/foodService.js';
import { computeFeedingPlan } from '../services/feedingPlanService.js';


export function feedingPlanCalculate(req, res, next) {
	try {
		const errors = validateFeedingPlan(req.body);
		if (errors.length) {
			return res.status(400).json({
				error: {message: 'Validation failed', details: errors}
			});
		}

		const { foods, rer, mealsPerDay } = req.body;
		const result = computeFeedingPlan({ foods, rer, mealsPerDay});
		res.json(result);
	} catch (err) {
		next(err);
	}


}
