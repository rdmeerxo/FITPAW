import { validate, requireNumber } from '../utils/validation.js';

export function validateAge(body) {
	const { catAgeYears } = body;
	const errors = validate(body, [
		() => requireNumber(catAgeYears, 'catAgeYears', { min: 0 }),
	]);
	return errors;
}
