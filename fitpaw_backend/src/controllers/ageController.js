import { validateAge } from '../validators/ageValidator.js';
import { convertCatAge } from '../services/ageService.js';

export function ageConvert(req, res, next) {
	try {
		const errors = validateAge(req.body);
		if (errors.length)
			return res
				.status(400)
				.json({ error: { message: 'Validation failed', details: errors } });
		const { catAgeYears } = req.body;
		const result = convertCatAge(catAgeYears);
		res.json(result);
	} catch (err) {
		next(err);
	}
}
