import { validateBmi } from '../validators/bmiValidator.js';
import { calculateBmi } from '../services/bmiService.js';

export function bmiCalculate(req, res, next) {
	try {
		const errors = validateBmi(req.body);
		if (errors.length)
			return res
				.status(400)
				.json({ error: { message: 'Validation failed', details: errors } });
		const { ribCageCircumference, legLength } = req.body;
		const result = calculateBmi(ribCageCircumference, legLength);
		res.json(result);
	} catch (err) {
		next(err);
	}
}
